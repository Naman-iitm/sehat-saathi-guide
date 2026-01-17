export interface Coupon {
  code: string;
  description: string;
  descriptionHi: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number; // Only for percentage discounts
  validFrom: Date;
  validUntil: Date;
  isFirstTimeUser: boolean;
  isActive: boolean;
}

export const coupons: Coupon[] = [
  {
    code: 'WELCOME10',
    description: 'Get 10% off on your first order! Maximum discount ₹100.',
    descriptionHi: 'अपने पहले ऑर्डर पर 10% की छूट पाएं! अधिकतम छूट ₹100।',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 200,
    maxDiscount: 100,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    isFirstTimeUser: true,
    isActive: true,
  },
  {
    code: 'FLAT50',
    description: 'Flat ₹50 off on orders above ₹300.',
    descriptionHi: '₹300 से ऊपर के ऑर्डर पर ₹50 की छूट।',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 300,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-03-31'),
    isFirstTimeUser: false,
    isActive: true,
  },
  {
    code: 'HEALTH20',
    description: 'Get 20% off on orders above ₹500! Maximum discount ₹200.',
    descriptionHi: '₹500 से ऊपर के ऑर्डर पर 20% की छूट! अधिकतम छूट ₹200।',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscount: 200,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-06-30'),
    isFirstTimeUser: false,
    isActive: true,
  },
  {
    code: 'SEHAT100',
    description: 'Flat ₹100 off on orders above ₹800.',
    descriptionHi: '₹800 से ऊपर के ऑर्डर पर ₹100 की छूट।',
    discountType: 'flat',
    discountValue: 100,
    minOrderAmount: 800,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    isFirstTimeUser: false,
    isActive: true,
  },
  {
    code: 'REPUBLIC26',
    description: 'Special Republic Day offer! Get 26% off (Max ₹260).',
    descriptionHi: 'विशेष गणतंत्र दिवस ऑफर! 26% की छूट (अधिकतम ₹260)।',
    discountType: 'percentage',
    discountValue: 26,
    minOrderAmount: 300,
    maxDiscount: 260,
    validFrom: new Date('2026-01-20'),
    validUntil: new Date('2026-01-26'),
    isFirstTimeUser: false,
    isActive: true,
  },
  {
    code: 'EXPIRED50',
    description: 'This coupon has expired.',
    descriptionHi: 'यह कूपन समाप्त हो गया है।',
    discountType: 'flat',
    discountValue: 50,
    minOrderAmount: 100,
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-12-31'),
    isFirstTimeUser: false,
    isActive: true,
  },
];

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discount?: number;
  errorMessage?: string;
  errorMessageHi?: string;
}

export const validateCoupon = (
  code: string,
  cartTotal: number,
  isFirstTimeUser: boolean = false
): CouponValidationResult => {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) {
    return {
      isValid: false,
      errorMessage: 'Invalid coupon code. Please check and try again.',
      errorMessageHi: 'अमान्य कूपन कोड। कृपया जांचें और पुनः प्रयास करें।',
    };
  }

  if (!coupon.isActive) {
    return {
      isValid: false,
      errorMessage: 'This coupon is no longer active.',
      errorMessageHi: 'यह कूपन अब सक्रिय नहीं है।',
    };
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return {
      isValid: false,
      errorMessage: 'This coupon has expired or is not yet valid.',
      errorMessageHi: 'यह कूपन समाप्त हो गया है या अभी मान्य नहीं है।',
    };
  }

  if (coupon.isFirstTimeUser && !isFirstTimeUser) {
    return {
      isValid: false,
      errorMessage: 'This coupon is only valid for first-time users.',
      errorMessageHi: 'यह कूपन केवल पहली बार के उपयोगकर्ताओं के लिए मान्य है।',
    };
  }

  if (cartTotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      errorMessage: `Minimum order amount of ₹${coupon.minOrderAmount} required.`,
      errorMessageHi: `न्यूनतम ₹${coupon.minOrderAmount} के ऑर्डर की आवश्यकता है।`,
    };
  }

  // Calculate discount
  let discount: number;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((cartTotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed cart total
  discount = Math.min(discount, cartTotal);

  return {
    isValid: true,
    coupon,
    discount,
  };
};
