// Production Razorpay Payment Integration Service
// Requires a valid Razorpay API Key in environment variables to process real transactions.

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // Amount in INR
  title: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  onSuccess: (paymentId: string) => void;
  onFailure?: (error: string) => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (options: PaymentOptions) => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Check if we have a real Razorpay key configured
  const isRealKeyConfigured = keyId && keyId !== 'rzp_test_placeholder' && !keyId.includes('placeholder');

  if (!isRealKeyConfigured) {
    const errorMsg = "Live Razorpay API Key is not configured in .env (VITE_RAZORPAY_KEY_ID). Please add your real Razorpay API Key to process online payments.";
    alert(errorMsg);
    if (options.onFailure) options.onFailure(errorMsg);
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    const errorMsg = "Razorpay banking SDK failed to load. Please check your internet connection.";
    alert(errorMsg);
    if (options.onFailure) options.onFailure(errorMsg);
    return;
  }

  try {
    const rzp = new window.Razorpay({
      key: keyId,
      amount: Math.round(options.amount * 100), // Amount in paise
      currency: 'INR',
      name: 'Srishree Vision Foundation',
      description: `${options.title} - ${options.description}`,
      image: '/logo.jpeg',
      prefill: {
        name: options.prefill.name,
        email: options.prefill.email,
        contact: options.prefill.contact
      },
      theme: {
        color: '#0F6E6E'
      },
      handler: function (response: any) {
        if (response && response.razorpay_payment_id) {
          options.onSuccess(response.razorpay_payment_id);
        } else {
          const errorMsg = "Payment verification failed: No valid Razorpay payment ID received.";
          if (options.onFailure) options.onFailure(errorMsg);
        }
      },
      modal: {
        ondismiss: function () {
          if (options.onFailure) options.onFailure('Payment checkout cancelled by user');
        }
      }
    });

    rzp.on('payment.failed', function (response: any) {
      console.error('Razorpay payment failed:', response.error);
      const errorMsg = response.error?.description || 'Payment transaction failed';
      if (options.onFailure) options.onFailure(errorMsg);
    });

    rzp.open();
  } catch (err: any) {
    console.error('Error initializing Razorpay SDK:', err);
    const errorMsg = "Failed to open Razorpay checkout screen: " + (err.message || err);
    alert(errorMsg);
    if (options.onFailure) options.onFailure(errorMsg);
  }
};
