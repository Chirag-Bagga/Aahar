import { prisma } from "../config/prisma.js";

export async function listProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function ensureCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });
  return cart;
}

export async function upsertCartItem(userId: string, productId: string, qty: number) {
  const cart = await ensureCart(userId);
  const item = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { qty },
    create: { cartId: cart.id, productId, qty }
  });
  return item;
}

export async function getCart(userId: string) {
  const cart = await ensureCart(userId);
  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true }
  });
  const total = items.reduce((sum, it) => sum + it.qty * it.product.priceInINR, 0);
  return { cartId: cart.id, items, total };
}

export async function removeItem(userId: string, itemId: string) {
  const cart = await ensureCart(userId);
  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.cartId !== cart.id) throw new Error("Item not in your cart");
  await prisma.cartItem.delete({ where: { id: itemId } });
}
