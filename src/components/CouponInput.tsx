import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tag, X, CheckCircle2, Loader2 } from 'lucide-react';

const CouponInput: React.FC = () => {
    const { language } = useLanguage();
    const { appliedCoupon, applyCoupon, removeCoupon, total } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error(
                language === 'hi'
                    ? 'कृपया कूपन कोड दर्ज करें'
                    : 'Please enter a coupon code'
            );
            return;
        }

        setIsApplying(true);

        // Simulate slight delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 300));

        const result = applyCoupon(couponCode.trim());

        if (result.success) {
            toast.success(language === 'hi' ? result.messageHi : result.message);
            setCouponCode('');
        } else {
            toast.error(language === 'hi' ? result.messageHi : result.message);
        }

        setIsApplying(false);
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        toast.info(
            language === 'hi'
                ? 'कूपन हटा दिया गया'
                : 'Coupon removed'
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isApplying && !appliedCoupon) {
            handleApplyCoupon();
        }
    };

    // Don't show if cart is empty
    if (total === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Tag className="w-4 h-4" />
                {language === 'hi' ? 'कूपन कोड लागू करें' : 'Apply Coupon Code'}
            </div>

            {appliedCoupon ? (
                // Applied coupon display
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <div>
                            <Badge variant="secondary" className="font-mono text-sm">
                                {appliedCoupon.code}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                                {language === 'hi'
                                    ? `बचत: ₹${appliedCoupon.discount}`
                                    : `Saving: ₹${appliedCoupon.discount}`}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        aria-label={language === 'hi' ? 'कूपन हटाएं' : 'Remove coupon'}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                // Coupon input form
                <div className="flex gap-2">
                    <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={handleKeyDown}
                        placeholder={language === 'hi' ? 'कूपन कोड दर्ज करें' : 'Enter coupon code'}
                        className="font-mono uppercase border-2"
                        disabled={isApplying}
                        aria-label={language === 'hi' ? 'कूपन कोड' : 'Coupon code'}
                    />
                    <Button
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponCode.trim()}
                        variant="outline"
                        className="border-2 shrink-0"
                    >
                        {isApplying ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            language === 'hi' ? 'लागू करें' : 'Apply'
                        )}
                    </Button>
                </div>
            )}

            {/* Hint text */}
            {!appliedCoupon && (
                <p className="text-xs text-muted-foreground">
                    {language === 'hi'
                        ? 'उदाहरण: WELCOME10, FLAT50, HEALTH20'
                        : 'Try: WELCOME10, FLAT50, HEALTH20'}
                </p>
            )}
        </div>
    );
};

export default CouponInput;
