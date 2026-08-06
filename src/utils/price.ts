export function parsePrice(price: string): number {
  const cleaned = price.replace(/[^\d,.-]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

export function formatPrice(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function applyDiscountToPrice(price: string, discountPercent: number): string {
  const discounted = parsePrice(price) * (1 - discountPercent / 100);
  return formatPrice(discounted);
}

type PromotionLike = { discount_percent: number } | null | undefined;

export function withPromotionalPrice<T extends { price: string }>(item: T, promotion: PromotionLike) {
  return {
    ...item,
    promotionalPrice: promotion ? applyDiscountToPrice(item.price, promotion.discount_percent) : null,
  };
}
