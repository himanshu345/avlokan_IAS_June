import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface VerificationResponse {
  verified: boolean;
}

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createOrder = async (amount: number): Promise<RazorpayOrder> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.post(`${API_URL}/api/payment/create-order`, {
      amount,
      currency: 'INR'
    });
    return response.data as RazorpayOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData: RazorpayResponse): Promise<VerificationResponse> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const response = await axios.post(
      `${API_URL}/api/payment/verify-payment`,
      paymentData
    );
    return response.data as VerificationResponse;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

export const activateSubscription = async (userId: string, planId: string, durationInMonths: number = 1) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  await axios.post(`${API_URL}/api/payment/activate-subscription`, {
    userId,
    planId,
    durationInMonths,
  });
};

export const initiatePayment = async (
  amount: number,
  planName: string,
  userId: string,
  planId: string,
  durationInMonths: number = 1
) => {
  try {
    const res = await initializeRazorpay();
    if (!res) throw new Error('Razorpay SDK failed to load');
    const order = await createOrder(amount);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'avlokanias',
      description: planName,
      order_id: order.id,
      handler: async function (response: RazorpayResponse) {
        try {
          const verification = await verifyPayment(response);
          if (verification.verified) {
            // Payment successful: activate subscription here!
            await activateSubscription(userId, planId, durationInMonths);
            window.location.href = '/payment-success';
          } else {
            window.location.href = '/payment-failed';
          }
        } catch (error) {
          window.location.href = '/payment-failed';
        }
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#7a4df9',
      },
    };

    console.log('Razorpay Checkout options:', options);

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    throw error;
  }
}; 