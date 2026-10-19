import SiteHeader from "@/app/site-header";
import CheckoutForm, { type CheckoutProduct } from "@/app/checkout/checkout-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Đơn hàng — Phòng Mạch Store",
  description: "Kiểm tra giỏ hàng và nhập thông tin nhận hàng.",
};

export default async function CheckoutPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      stock: true,
    },
  });
  const checkoutProducts: CheckoutProduct[] = products;

  return (
    <main>
      <SiteHeader />
      <CheckoutForm products={checkoutProducts} />
      <footer className="site-footer checkout-footer">
        <a className="brand footer-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Phòng Mạch Store</span>
        </a>
        <p>Thông tin của bạn chỉ được dùng để xử lý đơn hàng.</p>
        <div className="footer-contact">
          <a href="mailto:xinchao@phongmach.vn">xinchao@phongmach.vn</a>
        </div>
      </footer>
    </main>
  );
}
