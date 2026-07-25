import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, FileText, Trash2, Printer, CheckCircle, ExternalLink, ShieldCheck, Heart, Ticket, Award } from 'lucide-react';
import { getSentEmails, markEmailAsRead, EmailNotification } from '../../lib/emailService';
import { usePublicAuth } from '../contexts/PublicAuthContext';

export function GmailInboxModal({ isOpen, onClose, initialEmailId, criteria }: { 
  isOpen: boolean; 
  onClose: () => void;
  initialEmailId?: string | null;
  criteria?: any;
}) {
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);
  const [filter, setFilter] = useState<'all' | 'donation' | 'registration' | 'certificate'>('all');
  const { user } = usePublicAuth();

  const loadEmails = () => {
    const allList = getSentEmails();
    
    // Filter out internal admin system reports from regular users' view
    let list = allList.filter(e => 
      !e.subject.includes('Daily NGO Analytics') && 
      !e.subject.includes('Gmail Engine Health Report') &&
      !e.subject.includes('Executive Analytics')
    );

    // If user is logged in, ONLY show emails addressed to this user or matching their action
    if (user?.email) {
      const userList = list.filter(e => 
        e.to.toLowerCase() === user.email?.toLowerCase() ||
        (criteria?.email && e.to.toLowerCase() === criteria.email.toLowerCase()) ||
        (criteria?.transactionId && (e.metadata?.transactionId === criteria.transactionId || e.htmlContent.includes(criteria.transactionId))) ||
        (criteria?.mailId && e.id === criteria.mailId)
      );
      if (userList.length > 0) {
        list = userList;
      }
    } else if (criteria?.email) {
      const filtered = list.filter(e => e.to.toLowerCase() === criteria?.email.toLowerCase());
      if (filtered.length > 0) list = filtered;
    }

    setEmails(list);

    // Find exact email requested by criteria or initialEmailId
    let found: EmailNotification | undefined;
    if (criteria?.mailId || initialEmailId) {
      found = list.find(e => e.id === (criteria?.mailId || initialEmailId));
    }
    if (!found && criteria?.transactionId) {
      found = list.find(e => e.metadata?.transactionId === criteria.transactionId || e.htmlContent.includes(criteria.transactionId));
    }
    if (!found && criteria?.email) {
      found = list.find(e => e.to.toLowerCase() === criteria.email.toLowerCase());
    }

    if (found) {
      setSelectedEmail(found);
      markEmailAsRead(found.id);
    } else if (!selectedEmail && list.length > 0) {
      setSelectedEmail(list[0]);
      markEmailAsRead(list[0].id);
    } else if (list.length === 0) {
      setSelectedEmail(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    }
  }, [isOpen, initialEmailId, criteria]);

  useEffect(() => {
    const handleNewEmail = () => loadEmails();
    window.addEventListener('ngo-new-email', handleNewEmail);
    window.addEventListener('ngo-email-updated', handleNewEmail);
    return () => {
      window.removeEventListener('ngo-new-email', handleNewEmail);
      window.removeEventListener('ngo-email-updated', handleNewEmail);
    };
  }, []);

  if (!isOpen) return null;

  const filteredEmails = filter === 'all' ? emails : emails.filter(e => e.type === filter);

  const handlePrint = (email: EmailNotification) => {
    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (printWin) {
      printWin.document.write(`
        <html>
          <head>
            <title>${email.subject}</title>
            <style>
              body { font-family: 'Inter', system-ui, sans-serif; padding: 20px; background: #fff; }
            </style>
          </head>
          <body>
            ${email.htmlContent}
            <script>
              setTimeout(() => { window.print(); window.close(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  const handleDelete = (id: string) => {
    try {
      const remaining = emails.filter(e => e.id !== id);
      localStorage.setItem('ngo_sent_emails_history', JSON.stringify(remaining));
      setEmails(remaining);
      if (selectedEmail?.id === id) {
        setSelectedEmail(remaining[0] || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-black/10 w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden relative"
        >
          {/* Top Navbar */}
          <div className="bg-gradient-to-r from-[#02042B] to-[#0F6E6E] text-white px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl text-emerald-400">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none">Your Email Confirmations & 80G Receipts</h3>
                <p className="text-xs text-zinc-300 mt-1">Official Tax Invoices, Event Tickets, and Certificates delivered to your registered email</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full font-semibold border border-emerald-500/30">
                <ShieldCheck size={14} /> Official Verified Receipts
              </span>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Content: Sidebar + Preview */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-full sm:w-80 md:w-96 border-r border-zinc-200 bg-zinc-50 flex flex-col shrink-0">
              {/* Filter Tabs */}
              <div className="p-3 border-b border-zinc-200 flex gap-1 bg-white overflow-x-auto shrink-0">
                {(['all', 'donation', 'registration', 'certificate'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      filter === t ? 'bg-[#0F6E6E] text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {t === 'all' ? 'All Mails' : `${t}s`}
                  </button>
                ))}
              </div>

              {/* Emails List */}
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-200">
                {filteredEmails.length === 0 ? (
                  <div className="p-8 text-center text-zinc-400">
                    <Mail size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No sent emails in this folder yet.</p>
                    <p className="text-xs text-zinc-400 mt-1">Make a donation or register for an event to receive an instant Gmail notification!</p>
                  </div>
                ) : (
                  filteredEmails.map((email) => {
                    const isSelected = selectedEmail?.id === email.id;
                    return (
                      <div
                        key={email.id}
                        onClick={() => {
                          setSelectedEmail(email);
                          markEmailAsRead(email.id);
                        }}
                        className={`p-4 cursor-pointer transition-colors relative ${
                          isSelected ? 'bg-emerald-50/70 border-l-4 border-[#0F6E6E]' : 'hover:bg-zinc-100/80 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-zinc-900 truncate flex items-center gap-1.5">
                            {email.type === 'donation' && <Heart size={14} className="text-red-500 shrink-0" />}
                            {email.type === 'registration' && <Ticket size={14} className="text-blue-500 shrink-0" />}
                            {email.type === 'certificate' && <Award size={14} className="text-amber-500 shrink-0" />}
                            Srishree Vision NGO
                          </span>
                          <span className="text-[10px] text-zinc-400 shrink-0">
                            {new Date(email.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`text-xs font-semibold truncate mb-1 ${!email.read ? 'text-zinc-900 font-bold' : 'text-zinc-700'}`}>
                          {email.subject}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate">
                          To: {email.to}
                        </div>
                        {!email.read && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Email Preview Pane */}
            <div className="flex-1 bg-white flex flex-col overflow-hidden">
              {selectedEmail ? (
                <>
                  {/* Email Header */}
                  <div className="p-6 border-b border-zinc-200 bg-zinc-50/50 flex flex-wrap items-center justify-between gap-4 shrink-0">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F6E6E] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                          {selectedEmail.type}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {new Date(selectedEmail.date).toLocaleString()}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-zinc-900">{selectedEmail.subject}</h2>
                      <div className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
                        <span>From: <strong className="text-zinc-700">Srishree Vision Foundation &lt;invoices@srishreevision.org&gt;</strong></span>
                        <span>•</span>
                        <span>To: <strong className="text-zinc-700">{selectedEmail.to}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrint(selectedEmail)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F6E6E] text-white text-xs font-bold hover:bg-[#0c5959] transition-all shadow-sm"
                      >
                        <Printer size={14} /> Print / Download PDF
                      </button>
                      <button
                        onClick={() => handleDelete(selectedEmail.id)}
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Email"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* HTML Content Viewer */}
                  <div className="flex-1 overflow-y-auto p-6 bg-zinc-100/50">
                    <div className="max-w-3xl mx-auto shadow-lg rounded-2xl overflow-hidden bg-white">
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
                  <Mail size={56} className="mb-4 opacity-20" />
                  <p className="text-base font-medium text-zinc-600">Select an email to view details</p>
                  <p className="text-xs text-zinc-400 max-w-sm mt-1">
                    Your sent donation receipts, event tickets, and completion certificates will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
