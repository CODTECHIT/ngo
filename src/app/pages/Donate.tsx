import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Gift, Eye, Stethoscope, Users, BookOpen, TreePine, Loader2, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Aurora from '../components/reactbits/Aurora';
import BlurText from '../components/reactbits/BlurText';
import GradientText from '../components/reactbits/GradientText';
import { initiateRazorpayPayment } from '../../lib/paymentService';
import { sendDonationInvoiceEmail } from '../../lib/emailService';
import { supabase } from '../../lib/supabase';
import { usePublicAuth } from '../contexts/PublicAuthContext';

// Causes / Services with tailored impact statements for each preset amount
const CAUSES = [
  {
    id: 'vision',
    name: 'Vision Care',
    icon: Eye,
    tagline: 'Give Vision, Restore Hope',
    description: 'Sponsor free cataract screenings, diagnostic eye drops and high-quality prescription spectacles for elderly villagers and children.',
    color: 'from-emerald-500 to-teal-700',
    bgLight: 'bg-emerald-50/80',
    borderLight: 'border-emerald-200',
    textLight: 'text-emerald-800',
    presets: [
      { amount: 200, label: 'Spectacles', impact: 'Provide one pair of spectacles to a student.' },
      { amount: 1000, label: 'School Vision', impact: 'Support vision care initiatives for a school.' },
      { amount: 2500, label: 'Cataract Surgery', impact: 'Sponsor cataract surgery for one elderly person.' },
      { amount: 5000, label: 'School Program', impact: 'Donate spectacles for students through a school vision program.' }
    ],
    defaultImpact: 'Every rupee directly funds rural vision checkups and prevents avoidable blindness in tribal communities.'
  },
  {
    id: 'health',
    name: 'Rural Healthcare',
    icon: Stethoscope,
    tagline: 'Healthcare to the Doorstep',
    description: 'Fund diagnostic camps, blood sugar/BP testing units and basic medicine distribution in remote tribal hamlets.',
    color: 'from-blue-500 to-indigo-700',
    bgLight: 'bg-blue-50/80',
    borderLight: 'border-blue-200',
    textLight: 'text-blue-800',
    presets: [
      { amount: 200, label: 'Elderly Care', impact: 'Support healthcare for one elderly person.' },
      { amount: 600, label: 'Health Package', impact: 'Sponsor a health package for 5 people.' },
      { amount: 2500, label: 'Village Camp', impact: 'Support a village health camp.' },
      { amount: 5000, label: 'Medicine Drive', impact: 'Sponsor medicine distribution during a village medical camp.' }
    ],
    defaultImpact: 'Your donation provides essential life-saving diagnostic medical care to underserved rural populations.'
  },
  {
    id: 'women',
    name: 'Women Empowerment',
    icon: Users,
    tagline: 'Empower a Woman, Uplift a Family',
    description: 'Provide vocational tailoring equipment, financial literacy training and self-reliance seed kits to rural women.',
    color: 'from-purple-500 to-pink-700',
    bgLight: 'bg-purple-50/80',
    borderLight: 'border-purple-200',
    textLight: 'text-purple-800',
    presets: [
      { amount: 1000, label: 'Stitch Training', impact: 'Sponsor vocational stitching training for 1 woman.' },
      { amount: 2500, label: '5 Women', impact: 'Sponsor stitching training for 5 women in a village.' },
      { amount: 5000, label: 'Sewing Machine', impact: "Donate 1 sewing machine to support women's livelihoods." },
      { amount: 20000, label: '6-Month Program', impact: "Sponsor a 6-month vocational training program. The completion certificate will carry the sponsor's name." }
    ],
    defaultImpact: 'Empowering women with vocational skills creates sustainable income and strengthens entire communities.'
  },
  {
    id: 'education',
    name: 'Child Education & Nutrition',
    icon: BookOpen,
    tagline: 'Nurture Young Minds',
    description: 'Sponsor study materials, school kits and daily nutritious meals for children in rural government schools.',
    color: 'from-amber-500 to-orange-700',
    bgLight: 'bg-amber-50/80',
    borderLight: 'border-amber-200',
    textLight: 'text-amber-800',
    presets: [
      { amount: 500, label: 'School Kit', impact: 'Donate a school bag and gift for 1 student.' },
      { amount: 1000, label: 'Nutrition Day', impact: 'Sponsor a one-day nutrition program for school children.' },
      { amount: 10000, label: 'Classroom', impact: 'Sponsor a classroom with school bags and textbooks for students.' }
    ],
    defaultImpact: 'Education is the most powerful tool to break the cycle of poverty. Your gift opens doors to a brighter future.'
  },
  {
    id: 'environment',
    name: 'Green Earth & Plantation',
    icon: TreePine,
    tagline: 'Plant Today, Breathe Tomorrow',
    description: 'Support native sapling plantation, tree maintenance and community environmental conservation drives.',
    color: 'from-teal-500 to-emerald-800',
    bgLight: 'bg-teal-50/80',
    borderLight: 'border-teal-200',
    textLight: 'text-teal-800',
    presets: [
      { amount: 200, label: '2 Saplings', impact: 'Plants and nurtures 2 native fruit saplings in a rural community space.' },
      { amount: 400, label: '5 Trees', impact: 'Sponsors 5 native shade trees with protective tree guards.' },
      { amount: 600, label: 'Manure Kit', impact: 'Funds organic manure and drip watering support for 10 saplings for 6 months.' },
      { amount: 1000, label: '15 Trees', impact: 'Sponsors a green plantation drive planting 15 native trees in a public school.' },
      { amount: 2500, label: '30 Saplings', impact: 'Funds a community water-harvesting trench and 30 tree saplings.' },
      { amount: 5000, label: 'Green Grove', impact: 'Sponsors an entire green grove of 75+ trees with 1-year volunteer maintenance.' }
    ],
    defaultImpact: 'Protecting our environment ensures clean air, water and sustainable livelihoods for future generations.'
  }
];

export default function Donate() {
  const { user } = usePublicAuth();
  const [selectedCause, setSelectedCause] = useState(CAUSES[0]);
  const [amount, setAmount] = useState<number>(CAUSES[0].presets[0].amount);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountVal, setCustomAmountVal] = useState<string>('');

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    mobile: '',
    pan: '',
    isAnonymous: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const handleAmountClick = (val: number) => {
    setIsCustomAmount(false);
    setAmount(val);
  };

  const handleCauseSelect = (cause: typeof CAUSES[0]) => {
    setSelectedCause(cause);
    setIsCustomAmount(false);
    setAmount(cause.presets[0].amount);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountVal(val);
    const num = parseInt(val || '0', 10);
    setAmount(num > 0 ? num : 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const currentPreset = selectedCause.presets.find(p => p.amount === amount);
  const currentImpact = currentPreset?.impact ||
    (amount >= 5000 ? `Creates a transformational, large-scale impact in ${selectedCause.name} benefitting dozens of families!` : selectedCause.defaultImpact);

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 50) {
      alert("Please enter a donation amount of at least ₹50 to support our initiatives.");
      return;
    }
    if (!formData.name || !formData.email || !formData.mobile) {
      alert("Please fill in your Name, Email and Mobile number for the official tax receipt.");
      return;
    }

    setIsProcessing(true);

    await initiateRazorpayPayment({
      amount: amount,
      title: 'Donation - ' + selectedCause.name,
      description: currentImpact,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.mobile
      },
      onSuccess: async (paymentId) => {
        setIsProcessing(false);

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
          });
          setTimeout(() => {
            confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
          }, 400);
        } catch { }

        // Save donation to Supabase (if online table exists) & local storage history
        const donationObj = {
          id: 'don_' + Date.now(),
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          pan: formData.pan || 'N/A',
          amount: amount,
          cause: selectedCause.name,
          payment_id: paymentId,
          status: 'paid',
          is_anonymous: formData.isAnonymous,
          created_at: new Date().toISOString()
        };

        try {
          const { error } = await supabase.from('donations').insert([donationObj]);
          if (error && error.message && (error.message.includes('is_anonymous') || error.message.includes('column'))) {
            const { is_anonymous, ...fallbackObj } = donationObj;
            await supabase.from('donations').insert([fallbackObj]);
          }
        } catch (dbErr) {
          console.warn('Online DB insert fallback:', dbErr);
        }

        try {
          const past = JSON.parse(localStorage.getItem('ngo_saved_donations') || '[]');
          localStorage.setItem('ngo_saved_donations', JSON.stringify([donationObj, ...past]));
          window.dispatchEvent(new Event('ngo_donation_added'));
        } catch { }

        // Trigger Gmail Invoice Sending
        const invoiceMail = sendDonationInvoiceEmail({
          name: formData.name,
          email: formData.email,
          amount: amount,
          cause: selectedCause.name,
          transactionId: paymentId,
          pan: formData.pan || undefined
        });

        setSuccessReceipt({
          ...donationObj,
          mailId: invoiceMail.id
        });
      },
      onFailure: (err) => {
        setIsProcessing(false);
        if (err !== 'Payment cancelled by user' && err !== 'Payment checkout cancelled') {
          alert('Payment could not be completed: ' + err);
        }
      }
    });
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Hero Section */}
      <section className="pt-24 pb-10 md:pt-28 md:pb-14 px-4 md:px-6 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-multiply">
          <Aurora colorStops={["#0F6E6E", "#4CAF50", "#29B6F6"]} amplitude={1.3} />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-multiply z-0 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} className="text-emerald-600 animate-pulse" /> 100% Direct Grassroots Impact • Eligible for 80G Tax Exemption
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 mb-6 tracking-tight leading-tight">
            <BlurText text="Fund a Vision," delay={100} animateBy="words" direction="top" />{' '}
            <GradientText colors={["#0F6E6E", "#4CAF50", "#0F6E6E"]} animationSpeed={5} showBorder={false}>Transform a Life</GradientText>
          </h1>

          <p className="text-zinc-600 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-light leading-relaxed">
            Instead of a generic donation, choose a specific cause that touches your heart. Witness exactly how your contribution restores sight, health and dignity.
          </p>
        </div>
      </section>

      {/* Main Interactive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Choose Your Cause (Services) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 flex items-center gap-2">
                <Gift className="text-[#0F6E6E]" /> Step 1: Select a Cause to Support
              </h2>
            </div>
            <p className="text-sm text-zinc-500 mb-6 font-light">
              Click on an initiative below to see how your contribution creates tangible change.
            </p>

            <div className="space-y-3.5">
              {CAUSES.map((cause) => {
                const Icon = cause.icon;
                const isSelected = selectedCause.id === cause.id;
                return (
                  <motion.div
                    key={cause.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCauseSelect(cause)}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden ${isSelected
                      ? `bg-white border-[#0F6E6E] shadow-[0_10px_30px_rgba(15,110,110,0.15)] ring-2 ring-[#0F6E6E]/20`
                      : 'bg-white/80 border-black/5 hover:border-black/15 shadow-sm'
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-[#0F6E6E] to-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <CheckCircle2 size={12} /> Selected Cause
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`p-3.5 rounded-2xl ${isSelected ? 'bg-gradient-to-br ' + cause.color + ' text-white shadow-md' : 'bg-black/5 text-zinc-600'}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-0.5">{cause.tagline}</div>
                        <h3 className="font-bold text-lg text-zinc-900 mb-1">{cause.name}</h3>
                        <p className="text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">{cause.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Amount Selector & Donor Checkout Form */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl border border-black/10 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#0F6E6E]/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-1 flex items-center gap-2">
                <Heart className="text-red-500 fill-red-500 animate-bounce" size={22} /> Step 2: Choose Amount & Donate
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mb-6 font-light">
                Supporting: <strong className="text-[#0F6E6E] font-bold">{selectedCause.name}</strong>
              </p>

              {/* Amount Preset Grid */}
              <div className={`grid gap-3 mb-4 ${selectedCause.presets.length % 3 === 0 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
                {selectedCause.presets.map((preset) => {
                  const isBtnSelected = !isCustomAmount && amount === preset.amount;
                  return (
                    <button
                      key={preset.amount}
                      type="button"
                      onClick={() => handleAmountClick(preset.amount)}
                      className={`py-3.5 px-3 rounded-2xl font-extrabold text-base transition-all border-2 flex flex-col items-center justify-center ${isBtnSelected
                        ? 'bg-[#0F6E6E] text-white border-[#0F6E6E] shadow-[0_4px_15px_rgba(15,110,110,0.3)] scale-[1.02]'
                        : 'bg-zinc-50 hover:bg-zinc-100/80 text-zinc-800 border-zinc-200 hover:border-zinc-300'
                        }`}
                    >
                      <span>₹{preset.amount.toLocaleString('en-IN')}</span>
                      <span className={`text-[10px] font-medium mt-0.5 ${isBtnSelected ? 'text-emerald-200' : 'text-zinc-400'}`}>
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Manual Amount Entry */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Or Enter Custom Amount (₹)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(true);
                      setAmount(parseInt(customAmountVal || '500', 10));
                    }}
                    className="text-xs font-bold text-[#0F6E6E] hover:underline flex items-center gap-1"
                  >
                    ✍️ Manual Entry
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-400">₹</span>
                  <input
                    type="text"
                    placeholder="Enter any custom amount (e.g. 1500)"
                    value={isCustomAmount ? customAmountVal : amount.toString()}
                    onFocus={() => {
                      setIsCustomAmount(true);
                      setCustomAmountVal(amount.toString());
                    }}
                    onChange={handleCustomChange}
                    className={`w-full pl-10 pr-4 py-3.5 rounded-2xl text-lg font-bold outline-none transition-all border-2 ${isCustomAmount ? 'border-[#0F6E6E] ring-4 ring-[#0F6E6E]/10 bg-white text-zinc-900' : 'border-zinc-200 bg-zinc-50/50 text-zinc-700'
                      }`}
                  />
                </div>
              </div>

              {/* Creative Impact Banner */}
              <motion.div
                key={`${selectedCause.id}-${amount}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border mb-6 ${selectedCause.bgLight} ${selectedCause.borderLight} flex items-start gap-3.5 shadow-sm`}
              >
                <div className="p-2 rounded-xl bg-white shadow-sm text-[#0F6E6E] shrink-0 mt-0.5">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Your Tangible Impact</div>
                  <p className={`text-sm font-semibold leading-snug mt-0.5 ${selectedCause.textLight}`}>
                    "{currentImpact}"
                  </p>
                </div>
              </motion.div>

              {/* Donor Form */}
              <form onSubmit={handleDonateSubmit} className="space-y-3.5 border-t border-zinc-200 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. user name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-[#0F6E6E] focus:ring-2 focus:ring-[#0F6E6E]/10 outline-none text-sm text-zinc-900 font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+918977910974"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-[#0F6E6E] focus:ring-2 focus:ring-[#0F6E6E]/10 outline-none text-sm text-zinc-900 font-medium bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1">Email Address *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="for 80G Tax Invoice"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-[#0F6E6E] focus:ring-2 focus:ring-[#0F6E6E]/10 outline-none text-sm text-zinc-900 font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block mb-1">PAN Number (Optional)</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      placeholder="For 80G Tax Exemption"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-[#0F6E6E] focus:ring-2 focus:ring-[#0F6E6E]/10 outline-none text-sm text-zinc-900 font-medium uppercase bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-zinc-300 text-[#0F6E6E] focus:ring-[#0F6E6E]"
                  />
                  <label htmlFor="isAnonymous" className="text-xs text-zinc-600 font-medium cursor-pointer">
                    Make this an anonymous donation
                  </label>
                </div>

                {/* Donate Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing || amount < 50}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-[#0F6E6E] via-[#02042B] to-[#4CAF50] text-white font-extrabold rounded-2xl hover:opacity-95 transition-all shadow-[0_10px_25px_rgba(15,110,110,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 text-base group"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Connecting to Razorpay Secure...</span>
                    </>
                  ) : (
                    <>
                      <Heart size={18} className="fill-white text-white group-hover:scale-110 transition-transform" />
                      <span>Donate ₹{amount.toLocaleString('en-IN')} with Razorpay</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Trust Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> 80G Tax Exemption</span>
                <span className="flex items-center gap-1">🔒 Razorpay Bank-Grade SSL</span>
                <span className="flex items-center gap-1">✨ Instant SMTP Email Receipt</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Celebratory Success Modal */}
      <AnimatePresence>
        {successReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center relative overflow-hidden border border-black/10"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 size={44} className="animate-bounce" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                🎉 Donation Successful & Saved
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900 mb-2">Thank You, {successReceipt.name}!</h3>
              <p className="text-zinc-600 text-sm mb-6 leading-relaxed">
                Your generous contribution of <strong className="text-emerald-600 font-bold text-lg">₹{successReceipt.amount.toLocaleString('en-IN')}</strong> towards <strong className="text-zinc-800">{successReceipt.cause}</strong> has been received.
              </p>

              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-left mb-6 text-xs space-y-2">
                <div className="flex justify-between"><span className="text-zinc-500">Transaction ID:</span> <strong className="font-mono text-zinc-800">{successReceipt.payment_id}</strong></div>
                <div className="flex justify-between"><span className="text-zinc-500">80G Tax Invoice:</span> <strong className="text-emerald-600 font-semibold">Sent via SMTP ({successReceipt.email})</strong></div>
                <div className="flex justify-between"><span className="text-zinc-500">Date:</span> <strong className="text-zinc-800">{new Date(successReceipt.created_at).toLocaleString()}</strong></div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSuccessReceipt(null)}
                  className="w-full py-3.5 bg-[#0F6E6E] text-white font-bold rounded-xl hover:bg-[#0c5959] transition-all shadow-md text-sm"
                >
                  Make Another Impact
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
