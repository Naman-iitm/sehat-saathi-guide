import { describe, it, expect } from 'vitest';
import { validateCoupon, coupons } from '@/data/coupons';

describe('Coupon Validation', () => {
    describe('validateCoupon', () => {
        it('should return valid for a correct coupon code with sufficient cart total', () => {
            const result = validateCoupon('FLAT50', 500, false);
            expect(result.isValid).toBe(true);
            expect(result.discount).toBe(50);
            expect(result.coupon?.code).toBe('FLAT50');
        });

        it('should be case-insensitive for coupon codes', () => {
            const result1 = validateCoupon('flat50', 500, false);
            const result2 = validateCoupon('FLAT50', 500, false);
            const result3 = validateCoupon('Flat50', 500, false);

            expect(result1.isValid).toBe(true);
            expect(result2.isValid).toBe(true);
            expect(result3.isValid).toBe(true);
        });

        it('should return invalid for non-existent coupon code', () => {
            const result = validateCoupon('INVALIDCODE', 1000, false);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toContain('Invalid coupon code');
        });

        it('should return invalid when cart total is below minimum order amount', () => {
            // FLAT50 requires minimum ₹300
            const result = validateCoupon('FLAT50', 200, false);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toContain('Minimum order amount');
        });

        it('should calculate percentage discount correctly', () => {
            // HEALTH20 gives 20% off on orders above ₹500, max ₹200
            const result = validateCoupon('HEALTH20', 600, false);
            expect(result.isValid).toBe(true);
            expect(result.discount).toBe(120); // 20% of 600
        });

        it('should cap percentage discount at maxDiscount', () => {
            // HEALTH20 gives 20% off, max ₹200
            const result = validateCoupon('HEALTH20', 2000, false);
            expect(result.isValid).toBe(true);
            expect(result.discount).toBe(200); // Capped at max
        });

        it('should reject first-time user coupons for returning users', () => {
            const result = validateCoupon('WELCOME10', 500, false);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toContain('first-time users');
        });

        it('should accept first-time user coupons for new users', () => {
            const result = validateCoupon('WELCOME10', 500, true);
            expect(result.isValid).toBe(true);
            expect(result.discount).toBe(50); // 10% of 500
        });

        it('should reject expired coupons', () => {
            const result = validateCoupon('EXPIRED50', 500, false);
            expect(result.isValid).toBe(false);
            expect(result.errorMessage).toContain('expired');
        });

        it('should not allow discount to exceed cart total', () => {
            // SEHAT100 gives ₹100 flat off, but if cart is ₹800 minimum
            // Testing with exactly minimum amount
            const result = validateCoupon('SEHAT100', 800, false);
            expect(result.isValid).toBe(true);
            expect(result.discount).toBeLessThanOrEqual(800);
        });
    });

    describe('coupons data', () => {
        it('should have valid coupon data structure', () => {
            coupons.forEach((coupon) => {
                expect(coupon.code).toBeDefined();
                expect(coupon.description).toBeDefined();
                expect(coupon.descriptionHi).toBeDefined();
                expect(['percentage', 'flat']).toContain(coupon.discountType);
                expect(coupon.discountValue).toBeGreaterThan(0);
                expect(coupon.minOrderAmount).toBeGreaterThanOrEqual(0);
                expect(coupon.validFrom).toBeInstanceOf(Date);
                expect(coupon.validUntil).toBeInstanceOf(Date);
            });
        });

        it('should have Hindi descriptions for all coupons', () => {
            coupons.forEach((coupon) => {
                expect(coupon.descriptionHi.length).toBeGreaterThan(0);
            });
        });
    });
});
