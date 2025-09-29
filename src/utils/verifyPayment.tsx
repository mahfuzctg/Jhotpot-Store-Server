import axios from "axios";
import config from "../config";

export const verifyPayment = async (tnxId: string) => {
    try {
      const response = await axios.get(config.payment_verify_url!, {
        params: {
          store_id: config.store_id,
          signature_key: config.signature_key,
          type: 'json',
          request_id: tnxId,
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error.response?.data || error.message);
      throw new Error('Payment validation failed!');
    }
  };
  