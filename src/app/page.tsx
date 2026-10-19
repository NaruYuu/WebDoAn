import Storefront from "@/app/storefront";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <Storefront
      products={products.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
      }))}
    />
  );
}
