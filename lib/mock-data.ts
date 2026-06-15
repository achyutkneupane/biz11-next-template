export type Category = {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  emoji: string;
  specs: Record<string, string>;
};

export const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    children: [
      { id: 4, name: "Smartphones", slug: "smartphones" },
      { id: 5, name: "Laptops", slug: "laptops" },
      {
        id: 6,
        name: "Accessories",
        slug: "accessories",
        children: [
          { id: 10, name: "Audio", slug: "audio" },
          { id: 11, name: "Chargers", slug: "chargers" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    children: [
      { id: 7, name: "Men", slug: "men" },
      { id: 8, name: "Women", slug: "women" },
    ],
  },
  {
    id: 3,
    name: "Home & Garden",
    slug: "home-garden",
    children: [
      { id: 9, name: "Kitchen", slug: "kitchen" },
      { id: 12, name: "Decor", slug: "decor" },
    ],
  },
];

export const brands: Brand[] = [
  { id: 1, name: "TechPro", slug: "techpro" },
  { id: 2, name: "GreenLeaf", slug: "greenleaf" },
  { id: 3, name: "UrbanStyle", slug: "urbanstyle" },
  { id: 4, name: "NatureHome", slug: "naturehome" },
  { id: 5, name: "Luxora", slug: "luxora" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    slug: "wireless-headphones-pro",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio.",
    price: 129.99,
    brand: "TechPro",
    brandSlug: "techpro",
    category: "Audio",
    categorySlug: "audio",
    emoji: "\uD83C\uDFA7",
    specs: { Battery: "30 hours", Driver: "40mm", Bluetooth: "5.3", "Noise Cancelling": "Active" },
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    slug: "smart-watch-series-5",
    description: "Advanced fitness tracking, heart rate monitor, and seamless smartphone integration.",
    price: 249.99,
    brand: "TechPro",
    brandSlug: "techpro",
    category: "Accessories",
    categorySlug: "accessories",
    emoji: "\u231A\uFE0F",
    specs: { Display: "1.5\" AMOLED", Battery: "7 days", Water: "5 ATM", Sensors: "HR, SpO2, GPS" },
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-tshirt",
    description: "Soft, breathable organic cotton tee. Ethically sourced and available in multiple colors.",
    price: 34.99,
    brand: "GreenLeaf",
    brandSlug: "greenleaf",
    category: "Men",
    categorySlug: "men",
    emoji: "\uD83D\uDC55",
    specs: { Material: "100% Organic Cotton", Fit: "Regular", Sizes: "S-3XL", Care: "Machine washable" },
  },
  {
    id: 4,
    name: "Bamboo Cutting Board Set",
    slug: "bamboo-cutting-board-set",
    description: "Set of 3 organic bamboo cutting boards in assorted sizes. Knife-friendly and sustainable.",
    price: 42.99,
    brand: "NatureHome",
    brandSlug: "naturehome",
    category: "Kitchen",
    categorySlug: "kitchen",
    emoji: "\uD83E\uDDFA",
    specs: { Material: "Organic Bamboo", Pieces: "3", Sizes: "Small, Medium, Large", Care: "Hand wash" },
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description: "Genuine leather crossbody bag with adjustable strap and multiple compartments.",
    price: 89.99,
    brand: "Luxora",
    brandSlug: "luxora",
    category: "Women",
    categorySlug: "women",
    emoji: "\uD83D\uDC5C",
    specs: { Material: "Genuine Leather", Dimensions: "10\" x 7\" x 3\"", Strap: "Adjustable", Pockets: "5" },
  },
  {
    id: 6,
    name: "Ultrabook 15 Pro",
    slug: "ultrabook-15-pro",
    description: "Lightweight ultrabook with 15.6\" 4K display, Intel Core i7, and 16GB RAM for professionals.",
    price: 1299.99,
    brand: "TechPro",
    brandSlug: "techpro",
    category: "Laptops",
    categorySlug: "laptops",
    emoji: "\uD83D\uDCBB",
    specs: { Processor: "Intel Core i7-13700H", RAM: "16GB DDR5", Storage: "512GB SSD", Display: "15.6\" 4K OLED" },
  },
  {
    id: 7,
    name: "Floral Print Dress",
    slug: "floral-print-dress",
    description: "Elegant midi dress with a vibrant floral pattern. Perfect for spring and summer occasions.",
    price: 59.99,
    brand: "UrbanStyle",
    brandSlug: "urbanstyle",
    category: "Women",
    categorySlug: "women",
    emoji: "\uD83D\uDC57",
    specs: { Material: "Polyester Blend", Length: "Midi", Sizes: "XS-XL", Care: "Gentle cycle" },
  },
  {
    id: 8,
    name: "Ceramic Plant Pot Set",
    slug: "ceramic-plant-pot-set",
    description: "Minimalist ceramic plant pots with drainage holes. Set of 3 in matte earth tones.",
    price: 34.99,
    brand: "NatureHome",
    brandSlug: "naturehome",
    category: "Decor",
    categorySlug: "decor",
    emoji: "\uD83E\uDEB4",
    specs: { Material: "Glazed Ceramic", Pieces: "3", Diameters: "4\", 5\", 6\"", Drainage: "Yes" },
  },
  {
    id: 9,
    name: "Noise-Cancelling Earbuds",
    slug: "noise-cancelling-earbuds",
    description: "Compact true wireless earbuds with adaptive noise cancelling and IPX5 water resistance.",
    price: 79.99,
    brand: "TechPro",
    brandSlug: "techpro",
    category: "Audio",
    categorySlug: "audio",
    emoji: "\uD83C\uDFA7",
    specs: { Battery: "8h (32h case)", Driver: "10mm", Bluetooth: "5.3", Water: "IPX5" },
  },
  {
    id: 10,
    name: "Merino Wool Sweater",
    slug: "merino-wool-sweater",
    description: "Luxuriously soft merino wool crew neck sweater. Temperature regulating and odor resistant.",
    price: 89.99,
    brand: "GreenLeaf",
    brandSlug: "greenleaf",
    category: "Men",
    categorySlug: "men",
    emoji: "\uD83E\uDDE5",
    specs: { Material: "100% Merino Wool", Weight: "195 g/m\u00B2", Sizes: "S-3XL", Care: "Hand wash cold" },
  },
  {
    id: 11,
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "Rugged portable speaker with 360-degree sound, 20-hour battery, and built-in power bank.",
    price: 59.99,
    brand: "TechPro",
    brandSlug: "techpro",
    category: "Audio",
    categorySlug: "audio",
    emoji: "\uD83D\uDD0A",
    specs: { Battery: "20 hours", Output: "30W", Bluetooth: "5.2", Water: "IP67" },
  },
  {
    id: 12,
    name: "Linen Tablecloth",
    slug: "linen-tablecloth",
    description: "Stonewashed linen tablecloth with a relaxed, lived-in feel. Available in natural earth tones.",
    price: 44.99,
    brand: "NatureHome",
    brandSlug: "naturehome",
    category: "Kitchen",
    categorySlug: "kitchen",
    emoji: "\uD83E\uDEAA",
    specs: { Material: "100% Linen", Size: "60\" x 84\"", Colors: "4 earth tones", Care: "Machine washable" },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const categorySlugs = new Set<string>();
  function collectSlugs(cats: Category[]) {
    for (const cat of cats) {
      categorySlugs.add(cat.slug);
      if (cat.children) collectSlugs(cat.children);
    }
  }
  collectSlugs(categories);
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brandSlug === brandSlug);
}

export function getTopProducts(): Product[] {
  return products.slice(0, 6);
}
