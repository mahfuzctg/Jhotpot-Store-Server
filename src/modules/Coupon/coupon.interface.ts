

export interface ICoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  endDate: Date;
}