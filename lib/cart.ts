export type CartItem = {
  id: string;
  slug: string;
  title: string;
  variantId: string;
  variantLabel: string;
  price: number;
  quantity: number;
  imageSrc?: string;
  description?: string;
};

export type CartItemInput = Omit<CartItem, "id"> & {
  quantity?: number;
};

const CART_STORAGE_KEY = "bds_cart";

function makeId(slug: string, variantId: string): string {
  return `${slug}:${variantId}`;
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function normalizeCartItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;

  const value = raw as Partial<CartItem> & {
    title?: string;
    id?: string;
    slug?: string;
    variantId?: string;
    variantLabel?: string;
    price?: number | string;
    quantity?: number | string;
    imageSrc?: string;
    description?: string;
  };

  const title = (value.title || value.id || "").toString().trim();
  if (!title) return null;

  const slug = (value.slug || value.id || title)
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const variantId = (value.variantId || "default").toString().trim() || "default";
  const variantLabel = (value.variantLabel || "Standard").toString().trim() || "Standard";

  return {
    id: value.id?.toString().trim() || makeId(slug, variantId),
    slug,
    title,
    variantId,
    variantLabel,
    price: toFiniteNumber(value.price, 0),
    quantity: Math.max(1, Math.round(toFiniteNumber(value.quantity, 1))),
    imageSrc: value.imageSrc,
    description: value.description,
  };
}

export function readCart(storage?: Storage): CartItem[] {
  const cartStorage =
    storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!cartStorage) return [];

  try {
    const parsed = JSON.parse(cartStorage.getItem(CART_STORAGE_KEY) || "[]") as unknown[];
    return parsed.map(normalizeCartItem).filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[], storage?: Storage) {
  const cartStorage =
    storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!cartStorage) return;
  cartStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function emitCartChange(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("bds:cart:change", { detail: { cart } }));
}

export function addToCart(cart: CartItem[], item: CartItemInput): CartItem[] {
  const normalized: CartItem = {
    id: makeId(item.slug, item.variantId),
    slug: item.slug,
    title: item.title,
    variantId: item.variantId,
    variantLabel: item.variantLabel,
    price: item.price,
    quantity: Math.max(1, Math.round(item.quantity ?? 1)),
    imageSrc: item.imageSrc,
    description: item.description,
  };

  const index = cart.findIndex((entry) => entry.id === normalized.id);
  if (index === -1) return [...cart, normalized];

  const next = [...cart];
  next[index] = {
    ...next[index],
    quantity: next[index].quantity + normalized.quantity,
    price: normalized.price,
    imageSrc: normalized.imageSrc || next[index].imageSrc,
    description: normalized.description || next[index].description,
  };
  return next;
}

export function updateCartItemQuantity(
  cart: CartItem[],
  id: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) return cart.filter((item) => item.id !== id);
  return cart.map((item) => (item.id === id ? { ...item, quantity } : item));
}
