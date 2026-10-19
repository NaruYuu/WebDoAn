import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderRequest = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: Array<{ productId: string; quantity: number }>;
};

class OrderValidationError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function isOrderRequest(value: unknown): value is OrderRequest {
  if (typeof value !== "object" || value === null) return false;

  const order = value as Record<string, unknown>;
  return (
    typeof order.customerName === "string" &&
    typeof order.email === "string" &&
    typeof order.phone === "string" &&
    typeof order.address === "string" &&
    Array.isArray(order.items) &&
    order.items.length > 0 &&
    order.items.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.productId === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    )
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nội dung đơn hàng không hợp lệ." }, { status: 400 });
  }

  if (!isOrderRequest(body)) {
    return NextResponse.json({ error: "Vui lòng kiểm tra thông tin đơn hàng." }, { status: 400 });
  }

  const customerName = body.customerName.trim();
  const email = body.email.trim();
  const phone = body.phone.trim();
  const address = body.address.trim();

  if (
    customerName.length < 2 ||
    customerName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    phone.length < 8 ||
    phone.length > 20 ||
    address.length < 8 ||
    address.length > 300
  ) {
    return NextResponse.json({ error: "Vui lòng kiểm tra lại thông tin giao hàng." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const item of body.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  if (Array.from(quantities.values()).some((quantity) => quantity > 20)) {
    return NextResponse.json({ error: "Mỗi sản phẩm chỉ được đặt tối đa 20 chiếc." }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (transaction) => {
      const products = await transaction.product.findMany({
        where: { id: { in: Array.from(quantities.keys()) } },
      });

      if (products.length !== quantities.size) {
        throw new OrderValidationError("Một số sản phẩm không còn tồn tại.", 400);
      }

      let total = 0;
      const items = products.map((product) => {
        const quantity = quantities.get(product.id)!;
        if (product.stock < quantity) {
          throw new OrderValidationError(
            `${product.name} hiện chỉ còn ${product.stock} sản phẩm.`,
            409,
          );
        }
        total += product.price * quantity;
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
        };
      });

      for (const item of items) {
        const inventoryUpdate = await transaction.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (inventoryUpdate.count !== 1) {
          throw new OrderValidationError("Số lượng hàng vừa thay đổi. Vui lòng thử lại.", 409);
        }
      }

      return transaction.order.create({
        data: {
          customerName,
          email,
          phone,
          address,
          total,
          paymentMethod: "COD",
          items: { create: items },
        },
        select: { id: true, total: true },
      });
    });

    return NextResponse.json({ orderId: order.id, total: order.total }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Không thể tạo đơn hàng:", error);
    return NextResponse.json(
      { error: "Chưa thể tạo đơn hàng lúc này. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
