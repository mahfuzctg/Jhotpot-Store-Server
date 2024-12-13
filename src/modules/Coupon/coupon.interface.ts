import { DiscountType } from "@prisma/client";


export interface ICoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  endDate: Date;
}