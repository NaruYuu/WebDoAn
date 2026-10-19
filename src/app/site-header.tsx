"use client";

import { ArrowRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CART_STORAGE_KEY, CART_UPDATED_EVENT, parseCart } from "@/lib/shop";

type SiteHeaderProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onCartClick?: () => void;
};

export default function SiteHeader({
  searchValue,
  onSearchChange,
  onCartClick,
}: SiteHeaderProps) {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(
        parseCart(window.localStorage.getItem(CART_STORAGE_KEY)).reduce(
          (total, line) => total + line.quantity,
          0,
        ),
      );
    };

    updateCartCount();
    window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <>
      <div className="announcement">
        <span>Giao hàng miễn phí cho đơn từ 1.500.000₫</span>
        <Link href="/products">
          Xem bộ sưu tập <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <header className="site-header">
        <Link
          className="brand"
          href="/"
          aria-label="Phòng Mạch Store - Trang chủ"
        >
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>Phòng Mạch Store</span>
        </Link>

        <button
          className="mobile-menu-toggle icon-button"
          type="button"
          aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={mobileMenuOpen ? "main-nav is-open" : "main-nav"}>
          <Link
            href="/products"
            aria-current={pathname === "/products" ? "page" : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sản phẩm
          </Link>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            onClick={() => setMobileMenuOpen(false)}
          >
            Về Phòng Mạch Store
          </Link>
          <Link
            href="/about#support"
            onClick={() => setMobileMenuOpen(false)}
          >
            Hỗ trợ
          </Link>
        </nav>

        <div className="header-actions">
          {onSearchChange && (
            <label className="header-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Tìm món đồ bạn cần"
                value={searchValue ?? ""}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label="Tìm sản phẩm"
              />
            </label>
          )}
          <Link
            className="order-trigger"
            href="/checkout"
            aria-label={`Đơn hàng, ${cartCount} sản phẩm trong giỏ`}
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Đơn hàng</span>
            <span className="cart-count">{cartCount}</span>
          </Link>
          {onCartClick && (
            <button
              className="cart-trigger cart-icon-trigger"
              type="button"
              onClick={onCartClick}
              aria-label={`Xem giỏ hàng, ${cartCount} sản phẩm`}
            >
              <ShoppingBag size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </header>
    </>
  );
}
