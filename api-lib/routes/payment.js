const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper to get Razorpay credentials from environment variables.
// Uses ONLY server-side variables. VITE_-prefixed values live in the public
// bundle and must never be trusted for HMAC signing or order creation.
const getRazorpayCreds = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const isReal = keyId && !keyId.includes('placeholder') && keyId !== 'rzp_test_placeholder' && keyId !== 'rzp_test_THmV0hOQyiid4q';
  return { keyId, keySecret, isReal };
};

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid amount in INR is required.' });
    }

    const { keyId, keySecret, isReal } = getRazorpayCreds();
    const amountInPaise = Math.round(Number(amount) * 100);

    // If live credentials with secret are available, create an official Razorpay order
    if (isReal && keyId && keySecret) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {}
        })
      });

      if (!rzpRes.ok) {
        const errData = await rzpRes.json().catch(() => ({}));
        console.error('Razorpay order creation failed:', errData);
        return res.status(rzpRes.status).json({ error: errData.error?.description || 'Failed to create Razorpay order' });
      }

      const orderData = await rzpRes.json();
      return res.json({
        success: true,
        order_id: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        key_id: keyId,
        mode: 'live'
      });
    }

    // Fallback/Test Simulation Mode (when test key or placeholder is configured)
    const simulatedOrderId = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return res.json({
      success: true,
      order_id: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key_id: keyId || 'rzp_test_placeholder',
      mode: 'test_simulation'
    });
  } catch (err) {
    console.error('Error in /api/payment/create-order:', err);
    res.status(500).json({ error: 'Internal server error creating payment order.' });
  }
});

// Verify Razorpay Payment Signature & Authenticity
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: 'Payment ID is required for verification.' });
    }

    const { keyId, keySecret, isReal } = getRazorpayCreds();

    // 1. If we have an order ID and signature with a real secret key, perform HMAC SHA256 verification
    if (razorpay_order_id && razorpay_signature && keySecret && isReal) {
      const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(payload)
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        return res.json({
          success: true,
          verified: true,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          method: 'hmac_sha256',
          message: 'Payment signature cryptographically verified.'
        });
      } else {
        console.warn(`HMAC mismatch for order ${razorpay_order_id}: expected ${expectedSignature}, got ${razorpay_signature}`);
        return res.status(400).json({
          success: false,
          verified: false,
          error: 'Payment signature verification failed. Cryptographic mismatch.'
        });
      }
    }

    // 2. If no signature/order_id (or if secret is set), query Razorpay Payments API directly to confirm status
    if (isReal && keyId && keySecret) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        method: 'GET',
        headers: { 'Authorization': authHeader }
      });

      if (rzpRes.ok) {
        const paymentData = await rzpRes.json();
        if (paymentData.status === 'captured' || paymentData.status === 'authorized') {
          return res.json({
            success: true,
            verified: true,
            payment_id: razorpay_payment_id,
            status: paymentData.status,
            method: 'api_direct_query',
            message: 'Payment verified directly with Razorpay bank servers.'
          });
        } else {
          return res.status(400).json({
            success: false,
            verified: false,
            status: paymentData.status,
            error: `Payment exists in Razorpay but status is ${paymentData.status}.`
          });
        }
      }
    }

    // 3. Test/Simulated Mode Fallback
    if (!isReal || razorpay_order_id?.startsWith('order_test_') || razorpay_payment_id?.startsWith('pay_test_') || razorpay_payment_id?.startsWith('sim_')) {
      return res.json({
        success: true,
        verified: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id || null,
        method: 'test_simulation_verified',
        message: 'Test mode payment verified.'
      });
    }

    // If it reached here without verification in live mode, reject
    return res.status(400).json({
      success: false,
      verified: false,
      error: 'Unable to verify payment authenticity against bank servers.'
    });
  } catch (err) {
    console.error('Error in /api/payment/verify:', err);
    res.status(500).json({ error: 'Internal server error verifying payment.' });
  }
});

module.exports = router;
