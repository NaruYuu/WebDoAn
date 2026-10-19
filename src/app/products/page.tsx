import Storefront from "@/app/storefront";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sản phẩm — Phòng Mạch Store",
  description:
    "Tìm và lọc các thiết bị công nghệ được Phòng Mạch Store chọn lọc cho mỗi ngày.",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <Storefront
      view="products"
      products={products.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
      }))}
    />
  );
}
