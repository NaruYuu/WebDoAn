"use client";

import { ArrowLeft, ArrowRight, Check, Minus, Plus, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  CartLine,
  money,
  parseCart,
} from "@/lib/shop";

export type CheckoutProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

type CheckoutFormProps = {
  products: CheckoutProduct[];
};

export default function CheckoutForm({ products }: CheckoutFormProps) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [sendingOrder, setSendingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    setCart(
      parseCart(window.localStorage.getItem(CART_STORAGE_KEY)).filter((line) =>
        products.some((product) => product.id === line.productId),
      ),
    );
    setCartReady(true);
  }, [products]);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, [cart, cartReady]);

  const cartLines = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = products.find((item) => item.id === line.productId);
        return product ? [{ ...line, product }] : [];
      }),
    [cart, products],
  );

  const total = cartLines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );
  const hasUnavailableItem = cartLines.some(
    (line) => line.quantity > line.product.stock,
  );

  function changeQuantity(productId: string, quantity: number) {
    setCart((current) =>
      quantity < 1
        ? current.filter((line) => line.productId !== productId)
        : current.map((line) =>
            line.productId === productId ? { ...line, quantity } : line,
          ),
    );
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cartLines.length === 0) {
      setOrderError("Giỏ hàng đang trống. Hãy chọn sản phẩm trước khi đặt hàng.");
      return;
    }
    if (hasUnavailableItem) {
      setOrderError("Hãy điều chỉnh số lượng sản phẩm theo tồn kho hiện tại.");
      return;
    }

    setSendingOrder(true);
    setOrderError("");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: String(formData.get("customerName") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          address: String(formData.get("address") ?? ""),
          items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      });
      const result = (await response.json()) as {
        orderId?: string;
        error?: string;
      };

      if (!response.ok) {
        setOrderError(result.error ?? "Chưa thể tạo đơn hàng. Vui lòng thử lại.");
        return;
      }
      if (!result.orderId) {
        setOrderError("Đơn hàng chưa được xác nhận. Vui lòng thử lại.");
        return;
      }

      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      window.location.assign(`/order-confirmation/${result.orderId}`);
    } catch {
      setOrderError("Không thể kết nối để gửi đơn. Hãy kiểm tra mạng và thử lại.");
    } finally {
      setSendingOrder(false);
    }
  }

  if (!cartReady) {
    return (
      <section className="checkout-page checkout-loading" aria-live="polite">
        Đang tải giỏ hàng…
      </section>
    );
  }

  if (cartLines.length === 0) {
    return (
      <section className="checkout-page">
        <div className="checkout-empty glass-panel">
          <span className="empty-bag"><X size={24} /></span>
          <p className="section-kicker">Đơn hàng</p>
          <h1>Chưa có món nào trong giỏ.</h1>
          <p>Chọn sản phẩm bạn cần, sau đó quay lại đây để đặt hàng nhanh.</p>
          <Link className="checkout-submit" href="/products">
            Xem sản phẩm <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-page-heading">
        <Link className="back-to-products" href="/products">
          <ArrowLeft size={15} /> Tiếp tục chọn đồ
        </Link>
        <p className="section-kicker">Hoàn tất đơn hàng</p>
        <h1>Một bước nữa là xong.</h1>
        <p>Kiểm tra món hàng và nhập thông tin nhận hàng bên dưới.</p>
      </div>

      <form
        className="checkout-layout"
        id="checkout-order-form"
        onSubmit={submitOrder}
      >
        <section className="checkout-card glass-panel">
          <div className="checkout-card-heading">
            <span className="checkout-step">01</span>
            <div>
              <h2>Thông tin nhận hàng</h2>
              <p>Chúng tôi dùng thông tin này để xác nhận và giao đơn.</p>
            </div>
          </div>
          <div className="checkout-fields">
            <label>
              Họ và tên
              <input
                name="customerName"
                type="text"
                minLength={2}
                maxLength={100}
                autoComplete="name"
                placeholder="Nguyễn Minh Anh"
                required
              />
            </label>
            <div className="checkout-field-row">
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  placeholder="ban@email.com"
                  required
                />
              </label>
              <label>
                Số điện thoại
                <input
                  name="phone"
                  type="tel"
                  minLength={8}
                  maxLength={20}
                  autoComplete="tel"
                  placeholder="09xx xxx xxx"
                  required
                />
              </label>
            </div>
            <label>
              Địa chỉ nhận hàng
              <textarea
                name="address"
                minLength={8}
                maxLength={300}
                autoComplete="street-address"
                placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"
                required
              />
            </label>
          </div>

          <div className="payment-choice">
            <span className="payment-choice-icon"><Check size={17} /></span>
            <span>
              <strong>Thanh toán khi nhận hàng</strong>
              <small>Trả tiền trực tiếp cho đơn vị giao hàng.</small>
            </span>
            <span className="payment-selected">Đã chọn</span>
          </div>
          <p className="payment-disclaimer">
            Thanh toán trực tuyến chưa được tích hợp. Phòng Mạch Store sẽ liên
            hệ xác nhận đơn trước khi giao.
          </p>

          {orderError && (
            <p className="order-error checkout-error" role="alert">
              {orderError}
            </p>
          )}

          <button
            className="checkout-submit checkout-submit-mobile"
            type="submit"
            disabled={sendingOrder || hasUnavailableItem}
          >
            {sendingOrder ? "Đang xác nhận..." : "Xác nhận đơn hàng"}
            {!sendingOrder && <ArrowRight size={17} />}
          </button>
        </section>

        <aside className="order-summary glass-panel" aria-label="Tóm tắt đơn hàng">
          <div className="checkout-card-heading">
            <span className="checkout-step">02</span>
            <div>
              <h2>Đơn hàng của bạn</h2>
              <p>{cartLines.length} sản phẩm</p>
            </div>
          </div>
          <div className="order-summary-lines">
            {cartLines.map(({ product, quantity }) => (
              <article className="summary-line" key={product.id}>
                <img src={product.image} alt="" />
                <div className="summary-line-info">
                  <strong>{product.name}</strong>
                  <span>{money.format(product.price)}</span>
                  {quantity > product.stock && (
                    <small className="stock-warning">
                      Chỉ còn {product.stock} sản phẩm
                    </small>
                  )}
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, quantity - 1)}
                      aria-label={`Giảm số lượng ${product.name}`}
                    >
                      <Minus size={13} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(product.id, quantity + 1)}
                      disabled={quantity >= Math.min(product.stock, 20)}
                      aria-label={`Tăng số lượng ${product.name}`}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <button
                  className="summary-remove"
                  type="button"
                  onClick={() => changeQuantity(product.id, 0)}
                  aria-label={`Xóa ${product.name} khỏi đơn`}
                >
                  <X size={15} />
                </button>
              </article>
            ))}
          </div>

          <div className="summary-calculation">
            <div>
              <span>Tạm tính</span>
              <strong>{money.format(total)}</strong>
            </div>
            <div>
              <span>Giao hàng</span>
              <strong>{total >= 1_500_000 ? "Miễn phí" : "Xác nhận sau"}</strong>
            </div>
            {total < 1_500_000 && (
              <p>
                Đơn từ 1.500.000₫ được miễn phí giao hàng.
              </p>
            )}
            <div className="summary-grand-total">
              <span>Tổng đơn hàng</span>
              <strong>{money.format(total)}</strong>
            </div>
          </div>
          <button
            className="checkout-submit checkout-submit-desktop"
            type="submit"
            disabled={sendingOrder || hasUnavailableItem}
          >
            {sendingOrder ? "Đang xác nhận..." : "Xác nhận đơn hàng"}
            {!sendingOrder && <ArrowRight size={17} />}
          </button>
          <div className="checkout-safe-note">
            <ShieldCheck size={15} />
            <span>Đơn hàng được lưu an toàn và có mã xác nhận riêng.</span>
          </div>
        </aside>
      </form>
    </section>
  );
}
