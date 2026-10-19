import { ArrowRight, Check, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import SiteHeader from "@/app/site-header";

export const metadata = {
  title: "Về Phòng Mạch Store — Chọn đúng đồ, dùng lâu",
  description:
    "Tìm hiểu cách Phòng Mạch Store chọn thiết bị, hỗ trợ bảo hành và đồng hành cùng khách hàng.",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="about-hero">
        <div className="about-copy">
          <p className="section-kicker">Về Phòng Mạch Store</p>
          <h1>
            Ít món hơn.
            <br />
            <span>Dùng hợp hơn.</span>
          </h1>
          <p>
            Phòng Mạch Store bắt đầu từ một câu hỏi giản dị: món đồ công nghệ
            nào thực sự làm một ngày của bạn dễ chịu hơn?
          </p>
          <Link className="about-primary-link" href="/products">
            Xem đồ được chọn lọc <ArrowRight size={17} />
          </Link>
        </div>
        <div className="about-visual" aria-label="Góc làm việc tối giản">
          <div className="about-orbit" />
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=85"
            alt="Góc làm việc sáng sủa với máy tính và thiết bị công nghệ"
          />
          <span className="about-visual-caption">
            Một góc nhỏ, nhiều điều trôi chảy.
          </span>
        </div>
      </section>

      <section className="about-principles">
        <div className="about-section-heading">
          <p className="section-kicker">Cách chúng tôi chọn</p>
          <h2>Không phải nhiều nhất. Là đúng nhất.</h2>
        </div>
        <div className="principle-grid">
          <article className="principle-card">
            <span><Check size={20} /></span>
            <h3>Hữu ích trong đời thật</h3>
            <p>
              Mỗi món cần giải quyết một nhu cầu cụ thể, không chỉ đẹp trên
              thông số.
            </p>
          </article>
          <article className="principle-card">
            <span><ShieldCheck size={20} /></span>
            <h3>Dễ dùng, dễ hiểu</h3>
            <p>
              Thông tin sản phẩm, giá bán và chính sách được trình bày rõ ràng
              trước khi bạn quyết định.
            </p>
          </article>
          <article className="principle-card">
            <span><Headphones size={20} /></span>
            <h3>Có người đồng hành</h3>
            <p>
              Khi cần tư vấn hay hỗ trợ sau mua, bạn có thể liên hệ trực tiếp
              với chúng tôi.
            </p>
          </article>
        </div>
      </section>

      <section className="about-support" id="support">
        <div className="support-orbit" aria-hidden="true">
          <Sparkles size={25} />
        </div>
        <div>
          <p className="section-kicker">Hỗ trợ khách hàng</p>
          <h2>Cần một lời gợi ý?</h2>
          <p>
            Gửi câu hỏi về sản phẩm, đơn hàng hoặc bảo hành. Phòng Mạch Store
            sẽ phản hồi qua email.
          </p>
        </div>
        <a className="support-email" href="mailto:xinchao@phongmach.vn">
          xinchao@phongmach.vn <ArrowRight size={16} />
        </a>
      </section>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Phòng Mạch Store</span>
        </Link>
        <p>Chọn đúng đồ, ngày tự nhiên nhẹ.</p>
        <div className="footer-contact">
          <a href="mailto:xinchao@phongmach.vn">xinchao@phongmach.vn</a>
          <span>© 2026 Phòng Mạch Store</span>
        </div>
      </footer>
    </main>
  );
}
