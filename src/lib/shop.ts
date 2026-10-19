export type CartLine = {
  productId: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "phongmach-cart";
export const CART_UPDATED_EVENT = "phongmach:cart-updated";

export function parseCart(value: string | null): CartLine[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (line): line is CartLine =>
        typeof line === "object" &&
        line !== null &&
        typeof line.productId === "string" &&
        Number.isInteger(line.quantity) &&
        line.quantity > 0 &&
        line.quantity <= 20,
    );
  } catch {
    return [];
  }
}

export const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});
