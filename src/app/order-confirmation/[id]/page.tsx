import { ArrowRight, Check, PackageCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/app/site-header";
import { prisma } from "@/lib/prisma";
import { money } from "@/lib/shop";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Xác nhận đơn hàng — Phòng Mạch Store",
  description: "Thông tin và trạng thái đơn hàng của bạn.",
};

type OrderConfirmationProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <main>
      <SiteHeader />
      <section className="confirmation-page">
        <div className="confirmation-card glass-panel">
          <span className="confirmation-large-icon">
            <Check size={27} />
          </span>
          <p className="section-kicker">Đã ghi nhận đơn hàng</p>
          <h1>Cảm ơn {order.customerName}.</h1>
          <p className="confirmation-intro">
            Đơn hàng đã được lưu thành công. Phòng Mạch Store sẽ liên hệ với
            bạn để xác nhận trước khi giao.
          </p>

          <div className="confirmation-reference">
            <span>Mã đơn hàng</span>
            <strong>{order.id.toUpperCase()}</strong>
          </div>

          <div className="confirmation-status">
            <span className="status-icon"><PackageCheck size={17} /></span>
            <span>
              <strong>Đang chờ xác nhận</strong>
              <small>
                Đặt lúc{" "}
                {order.createdAt.toLocaleString("vi-VN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "Asia/Ho_Chi_Minh",
                })}
              </small>
            </span>
          </div>

          <div className="confirmation-detail-list">
            {order.items.map((item) => (
              <div className="confirmation-item" key={item.id}>
                <span>
                  {item.name} <small>× {item.quantity}</small>
                </span>
                <strong>{money.format(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="confirmation-total">
            <span>Tổng đơn hàng</span>
            <strong>{money.format(order.total)}</strong>
          </div>

          <div className="confirmation-shipping">
            <ShieldCheck size={17} />
            <span>
              <strong>Thanh toán khi nhận hàng</strong>
              <small>
                Thanh toán trực tiếp cho đơn vị giao hàng. Chưa có thanh toán
                trực tuyến trên website.
              </small>
            </span>
          </div>

          <div className="confirmation-recipient">
            <h2>Thông tin nhận hàng</h2>
            <p>{order.customerName}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
            <p>{order.address}</p>
          </div>

          <Link className="checkout-submit confirmation-back" href="/products">
            Tiếp tục xem sản phẩm <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <footer className="site-footer checkout-footer">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Phòng Mạch Store</span>
        </Link>
        <p>Cần hỗ trợ? Chúng tôi luôn sẵn sàng.</p>
        <div className="footer-contact">
          <a href="mailto:xinchao@phongmach.vn">xinchao@phongmach.vn</a>
        </div>
      </footer>
    </main>
  );
}
