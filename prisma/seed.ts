import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "headphone-studio-h7",
    name: "Headphone Studio H7",
    description: "Âm thanh cân bằng, chống ồn chủ động và đeo thoải mái cả ngày.",
    price: 2_490_000,
    compareAtPrice: 2_990_000,
    category: "Âm thanh",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=960&q=85",
    badge: "Được yêu thích",
    stock: 18,
    featured: true,
  },
  {
    slug: "ban-phim-co-key-75",
    name: "Bàn phím cơ Key 75",
    description: "Layout gọn 75%, switch êm và kết nối không dây linh hoạt.",
    price: 1_890_000,
    compareAtPrice: null,
    category: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=960&q=85",
    badge: "Mới về",
    stock: 12,
    featured: true,
  },
  {
    slug: "loa-bluetooth-wave",
    name: "Loa Bluetooth Wave",
    description: "Âm thanh đầy đặn trong một thiết kế nhỏ gọn, chống nước IPX7.",
    price: 1_290_000,
    compareAtPrice: 1_590_000,
    category: "Âm thanh",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=960&q=85",
    badge: null,
    stock: 24,
    featured: true,
  },
  {
    slug: "camera-webcam-c2",
    name: "Webcam Clear C2",
    description: "Hình ảnh 2K sắc nét, tự cân sáng cho những cuộc gọi rõ ràng.",
    price: 1_650_000,
    compareAtPrice: null,
    category: "Thiết bị làm việc",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=960&q=85",
    badge: null,
    stock: 9,
    featured: true,
  },
  {
    slug: "den-ban-luma",
    name: "Đèn bàn Luma",
    description: "Điều chỉnh ánh sáng dịu mắt, gọn gàng cho góc làm việc.",
    price: 890_000,
    compareAtPrice: null,
    category: "Thiết bị làm việc",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=960&q=85",
    badge: null,
    stock: 15,
    featured: false,
  },
  {
    slug: "chuot-khong-day-air",
    name: "Chuột không dây Air",
    description: "Nhẹ tay, theo dõi chính xác và dùng đến 70 ngày mỗi lần sạc.",
    price: 690_000,
    compareAtPrice: 790_000,
    category: "Phụ kiện",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=960&q=85",
    badge: null,
    stock: 30,
    featured: false,
  },
  {
    slug: "man-hinh-view-27",
    name: "Màn hình View 27",
    description: "Màn hình 2K 27 inch, màu sắc trung thực cho công việc sáng tạo.",
    price: 5_490_000,
    compareAtPrice: null,
    category: "Màn hình",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=960&q=85",
    badge: "Bán chạy",
    stock: 7,
    featured: false,
  },
  {
    slug: "tai-nghe-earbud-go",
    name: "Tai nghe Earbud Go",
    description: "Nhỏ gọn để mang theo, âm thanh trong trẻo cho mọi hành trình.",
    price: 1_090_000,
    compareAtPrice: null,
    category: "Âm thanh",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=960&q=85",
    badge: null,
    stock: 21,
    featured: false,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
