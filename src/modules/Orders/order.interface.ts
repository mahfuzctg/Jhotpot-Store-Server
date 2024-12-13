

  export type TOrder = {
    vendorId: string;
    transactionId: string;
    deliveryAddress: string;
    totalPrice: number;
    coupon?: string;
    orderDetails: {
      productId: string;
      quantity: number;
      pricePerUnit: number;
    }[];
  };

  export type TOrderFilterRequest = {
    vendorId?: string;
    customerId?: string;
  };