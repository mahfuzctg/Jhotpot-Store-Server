export type TOrder = {
    vendorId: string;
    transactionId: string;
    totalPrice: number;
    coupon?: string;
    orderDetails: {
      productId: string;
      quantity: number;
      pricePerUnit: number;
    }[];
  };