"use client";

import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Headphones,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/app/site-header";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  CartLine,
  money,
  parseCart,
} from "@/lib/shop";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  image: string;
  badge: string | null;
  stock: number;
  featured: boolean;
  createdAt: string;
};

type StorefrontProps = {
  products: Product[];
  view?: "home" | "products";
};

export default function Storefront({
  products,
  view = "home",
}: StorefrontProps) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const isProductsPage = view === "products";

  useEffect(() => {
    setCart(parseCart(window.localStorage.getItem(CART_STORAGE_KEY)));
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }, [cart, cartReady]);

  const categories = useMemo(
    () => ["Tất cả", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi");
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Tất cả" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.description} ${product.category}`
          .toLocaleLowerCase("vi")
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, search]);

  const cartLines = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const cartTotal = cartLines.reduce(
    (total, line) => total + line.product.price * line.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (!existing) return [...current, { productId: product.id, quantity: 1 }];
      if (existing.quantity >= product.stock) return current;
      return current.map((line) =>
        line.productId === product.id
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      );
    });
  }

  function updateQuantity(product: Product, quantity: number) {
    if (quantity < 1) {
      setCart((current) =>
        current.filter((line) => line.productId !== product.id),
      );
      return;
    }
    if (quantity > product.stock) return;
    setCart((current) =>
      current.map((line) =>
        line.productId === product.id ? { ...line, quantity } : line,
      ),
    );
  }

  return (
    <main className={isProductsPage ? "storefront products-page" : "storefront"}>
      <SiteHeader
        searchValue={search}
        onSearchChange={
          isProductsPage ? (value) => setSearch(value) : undefined
        }
        onCartClick={() => setCartOpen(true)}
      />

      {!isProductsPage && (
        <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="kicker-dot" />
            Đồ công nghệ, chọn bằng sự thấu hiểu
          </p>
          <h1 id="hero-title">
            Thiết bị tốt,
            <br />
            ngày dài <span>nhẹ hơn.</span>
          </h1>
          <p className="hero-description">
            Những món đồ nhỏ tạo nên khác biệt lớn — được chọn kỹ cho công việc,
            giải trí và góc riêng của bạn.
          </p>
          <a className="hero-link" href="#products">
            Tìm món đồ hợp với bạn <ArrowDown size={16} aria-hidden="true" />
          </a>
          <div className="hero-note">
            <span className="note-icon">
              <Headphones size={17} aria-hidden="true" />
            </span>
            <span>
              <strong>Chọn kỹ, dùng lâu</strong>
              <small>Chỉ giữ lại thứ thật sự đáng dùng</small>
            </span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-art-orbit" />
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1100&q=90"
              alt="Tai nghe chụp tai màu cam nổi bật trên nền xanh"
              fetchPriority="high"
            />
          </div>
          <div className="hero-product-note">
            <span className="sound-wave" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              <small>Nghe trọn từng nhịp</small>
              <strong>Studio H7</strong>
            </span>
            <span className="hero-product-price">2.490.000₫</span>
          </div>
          <span className="hero-spark" aria-hidden="true">
            ✳
          </span>
          <span className="hero-side-caption">ÂM THANH / 01</span>
        </div>
      </section>

      <section className="benefits" aria-label="Cam kết của Phòng Mạch Store">
        <div>
          <span className="benefit-number">01</span>
          <p>
            <strong>Đã qua chọn lọc</strong>
            <small>Ít lựa chọn hơn, đúng thứ bạn cần hơn.</small>
          </p>
        </div>
        <div>
          <span className="benefit-number">02</span>
          <p>
            <strong>Bảo hành rõ ràng</strong>
            <small>An tâm sử dụng, có người hỗ trợ khi cần.</small>
          </p>
        </div>
        <div>
          <span className="benefit-number">03</span>
          <p>
            <strong>Giao hàng tận tay</strong>
            <small>Miễn phí đơn hàng từ 1.500.000₫.</small>
          </p>
        </div>
      </section>
        </>
      )}

      <section className="catalog" id="products">
        <div className="catalog-heading">
          <div>
            <p className="section-kicker">
              {isProductsPage
                ? "Cửa hàng Phòng Mạch Store"
                : "Bộ sưu tập hiện tại"}
            </p>
            <h2>
              {isProductsPage ? "Tìm món đồ của bạn." : "Đồ tốt cho mỗi ngày."}
            </h2>
          </div>
          <p className="catalog-intro">
            {isProductsPage
              ? "Lọc theo danh mục hoặc tìm kiếm để chọn món phù hợp."
              : "Từ góc làm việc đến lúc thư giãn — bắt đầu với món bạn đang tìm."}
          </p>
        </div>

        <div className="catalog-controls">
          <div className="category-list" aria-label="Lọc theo danh mục">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  activeCategory === category
                    ? "category-chip is-active"
                    : "category-chip"
                }
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <span className="product-count">
            {visibleProducts.length} sản phẩm
          </span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  <button
                    className="quick-add"
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock < 1}
                    aria-label={`Thêm ${product.name} vào giỏ`}
                  >
                    {product.stock > 0 ? <Plus size={18} /> : "Hết hàng"}
                  </button>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-buy-row">
                    <div className="price-stack">
                      <strong>{money.format(product.price)}</strong>
                      {product.compareAtPrice && (
                        <del>{money.format(product.compareAtPrice)}</del>
                      )}
                    </div>
                    <button
                      className="text-add"
                      type="button"
                      onClick={() => addToCart(product)}
                      disabled={product.stock < 1}
                    >
                      {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <Search size={25} aria-hidden="true" />
            <h3>Chưa tìm thấy món phù hợp.</h3>
            <p>Thử một từ khóa khác hoặc chọn danh mục khác nhé.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("Tất cả");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </section>

      {!isProductsPage && <section className="closing-note">
        <div className="closing-mark" aria-hidden="true">
          ✳
        </div>
        <p>
          “Công nghệ tốt không cần gây chú ý.
          <br />
          Chỉ cần khiến mọi thứ <em>trôi chảy hơn.</em>”
        </p>
        <Link href="/products">
          Khám phá sản phẩm <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>}

      <footer className="site-footer" id="footer">
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

      {cartOpen && (
        <div
          className="drawer-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false);
          }}
        >
          <section
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="drawer-header">
              <div>
                <p className="section-kicker">Phòng Mạch Store</p>
                <h2 id="drawer-title">Giỏ hàng</h2>
              </div>
              <button
                className="icon-button close-drawer"
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Đóng giỏ hàng"
              >
                <X size={22} />
              </button>
            </div>

            {cartLines.length > 0 ? (
              <>
                <div className="cart-lines">
                  {cartLines.map(({ product, quantity }) => (
                    <article className="cart-line" key={product.id}>
                      <img src={product.image} alt="" />
                      <div className="cart-line-copy">
                        <span className="product-category">
                          {product.category}
                        </span>
                        <h3>{product.name}</h3>
                        <strong>{money.format(product.price)}</strong>
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product, quantity - 1)
                            }
                            aria-label={`Giảm số lượng ${product.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(product, quantity + 1)
                            }
                            disabled={quantity >= product.stock}
                            aria-label={`Tăng số lượng ${product.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove-line"
                        type="button"
                        onClick={() => updateQuantity(product, 0)}
                        aria-label={`Xóa ${product.name} khỏi giỏ`}
                      >
                        <X size={17} />
                      </button>
                    </article>
                  ))}
                </div>
                <div className="drawer-summary">
                  <div className="shipping-note">
                    <span>
                      <Check size={14} />{" "}
                      {cartTotal >= 1_500_000
                        ? "Đơn hàng được miễn phí giao"
                        : `Mua thêm ${money.format(1_500_000 - cartTotal)} để miễn phí giao`}
                    </span>
                    <ChevronDown size={15} aria-hidden="true" />
                  </div>
                  <div className="drawer-total">
                    <span>Tạm tính</span>
                    <strong>{money.format(cartTotal)}</strong>
                  </div>
                  <Link
                    className="checkout-button"
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                  >
                    Đến trang đơn hàng <ArrowRight size={17} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span className="empty-bag">
                  <ShoppingBag size={25} />
                </span>
                <h3>Giỏ hàng đang trống.</h3>
                <p>Món đồ tiếp theo giúp ngày của bạn nhẹ hơn đang ở đây.</p>
                <Link
                  className="checkout-button"
                  href="/products"
                  onClick={() => setCartOpen(false)}
                >
                  Tiếp tục xem hàng <ArrowRight size={17} />
                </Link>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
