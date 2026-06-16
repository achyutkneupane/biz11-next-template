import type {
  BrandResource,
  CategoryResource,
  ProductResource,
} from "@biz11/Types/Api";

export const brands: BrandResource[] = [
  {
    nanoId: "br_techpro",
    name: "TechPro",
    slug: "techpro",
    description: "Premium consumer electronics and accessories.",
    logoUrl: "",
    productsCount: 5,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    nanoId: "br_greenleaf",
    name: "GreenLeaf",
    slug: "greenleaf",
    description: "Sustainable and eco-friendly lifestyle products.",
    logoUrl: "",
    productsCount: 2,
    createdAt: "2025-02-10T00:00:00Z",
  },
  {
    nanoId: "br_urbanstyle",
    name: "UrbanStyle",
    slug: "urbanstyle",
    description: "Contemporary fashion for the modern individual.",
    logoUrl: "",
    productsCount: 1,
    createdAt: "2025-03-05T00:00:00Z",
  },
  {
    nanoId: "br_naturehome",
    name: "NatureHome",
    slug: "naturehome",
    description: "Bringing natural elegance into your living space.",
    logoUrl: "",
    productsCount: 3,
    createdAt: "2025-01-20T00:00:00Z",
  },
  {
    nanoId: "br_luxora",
    name: "Luxora",
    slug: "luxora",
    description: "Handcrafted luxury goods for discerning tastes.",
    logoUrl: "",
    productsCount: 1,
    createdAt: "2025-04-01T00:00:00Z",
  },
];

export const categories: CategoryResource[] = [
  {
    nanoId: "cat_elec",
    name: "Electronics",
    slug: "electronics",
    description: "Cutting-edge gadgets and devices.",
    depth: 0,
    parentId: null,
    coverUrl: "",
    productsCount: 5,
    children: [
      {
        nanoId: "cat_phones",
        name: "Smartphones",
        slug: "smartphones",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 0,
        children: [],
        createdAt: null,
      },
      {
        nanoId: "cat_laptops",
        name: "Laptops",
        slug: "laptops",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 1,
        children: [],
        createdAt: null,
      },
      {
        nanoId: "cat_accessories",
        name: "Accessories",
        slug: "accessories",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 4,
        children: [
          {
            nanoId: "cat_audio",
            name: "Audio",
            slug: "audio",
            description: null,
            depth: 2,
            parentId: null,
            coverUrl: "",
            productsCount: 3,
            children: [],
            createdAt: null,
          },
          {
            nanoId: "cat_chargers",
            name: "Chargers",
            slug: "chargers",
            description: null,
            depth: 2,
            parentId: null,
            coverUrl: "",
            productsCount: 0,
            children: [],
            createdAt: null,
          },
        ],
        createdAt: null,
      },
    ],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    nanoId: "cat_clothing",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel for every occasion.",
    depth: 0,
    parentId: null,
    coverUrl: "",
    productsCount: 3,
    children: [
      {
        nanoId: "cat_men",
        name: "Men",
        slug: "men",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 2,
        children: [],
        createdAt: null,
      },
      {
        nanoId: "cat_women",
        name: "Women",
        slug: "women",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 1,
        children: [],
        createdAt: null,
      },
    ],
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    nanoId: "cat_home",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything to make your home beautiful.",
    depth: 0,
    parentId: null,
    coverUrl: "",
    productsCount: 3,
    children: [
      {
        nanoId: "cat_kitchen",
        name: "Kitchen",
        slug: "kitchen",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 2,
        children: [],
        createdAt: null,
      },
      {
        nanoId: "cat_decor",
        name: "Decor",
        slug: "decor",
        description: null,
        depth: 1,
        parentId: null,
        coverUrl: "",
        productsCount: 1,
        children: [],
        createdAt: null,
      },
    ],
    createdAt: "2025-01-01T00:00:00Z",
  },
];

const techpro = brands[0];
const greenleaf = brands[1];
const urbanstyle = brands[2];
const naturehome = brands[3];
const luxora = brands[4];

const catAudio = categories[0].children[2].children[0];
const catLaptops = categories[0].children[1];
const catMen = categories[1].children[0];
const catKitchen = categories[2].children[0];
const catWomen = categories[1].children[1];
const catDecor = categories[2].children[1];

export const products: ProductResource[] = [
  {
    nanoId: "prod_1",
    name: "Wireless Headphones Pro",
    slug: "wireless-headphones-pro",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life, spatial audio, and cloud-soft ear cushions for all-day comfort.",
    specifications: [
      { key: "Battery", value: "30 hours" },
      { key: "Driver", value: "40mm neodymium" },
      { key: "Bluetooth", value: "5.3" },
      { key: "Noise Cancelling", value: "Adaptive ANC" },
      { key: "Weight", value: "250g" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    brand: techpro,
    categories: [catAudio, categories[0]],
    defaultSku: {
      nanoId: "sku_hp_1",
      skuCode: "TECH-HP-BLK-001",
      price: "129.99",
      quantity: 45,
    },
    createdAt: "2025-05-01T00:00:00Z",
  },
  {
    nanoId: "prod_2",
    name: "Smart Watch Series 5",
    slug: "smart-watch-series-5",
    description:
      "Advanced fitness tracking with heart rate monitor, SpO2 sensor, built-in GPS, and a vibrant always-on AMOLED display.",
    specifications: [
      { key: "Display", value: '1.5" AMOLED' },
      { key: "Battery", value: "7 days" },
      { key: "Water Resistance", value: "5 ATM" },
      { key: "Sensors", value: "HR, SpO2, GPS" },
      { key: "Compatibility", value: "iOS & Android" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    brand: techpro,
    categories: [categories[0].children[2], categories[0]],
    defaultSku: {
      nanoId: "sku_sw_1",
      skuCode: "TECH-SW-S5-001",
      price: "249.99",
      quantity: 30,
    },
    createdAt: "2025-05-10T00:00:00Z",
  },
  {
    nanoId: "prod_3",
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-tshirt",
    description:
      "Sustainably sourced 100% organic cotton tee. Pre-shrunk, enzyme-washed for incredible softness from the first wear.",
    specifications: [
      { key: "Material", value: "100% Organic Cotton" },
      { key: "Fit", value: "Regular" },
      { key: "Sizes", value: "S — 3XL" },
      { key: "Weight", value: "180 gsm" },
      { key: "Care", value: "Machine washable" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    brand: greenleaf,
    categories: [catMen, categories[1]],
    defaultSku: {
      nanoId: "sku_ts_1",
      skuCode: "GL-TEE-ORG-001",
      price: "34.99",
      quantity: 120,
    },
    createdAt: "2025-04-15T00:00:00Z",
  },
  {
    nanoId: "prod_4",
    name: "Bamboo Cutting Board Set",
    slug: "bamboo-cutting-board-set",
    description:
      "Set of three organic bamboo cutting boards in graduated sizes. Naturally antimicrobial and gentle on knife blades.",
    specifications: [
      { key: "Material", value: "Organic Bamboo" },
      { key: "Pieces", value: "3" },
      { key: "Sizes", value: "Small, Medium, Large" },
      { key: "Care", value: "Hand wash recommended" },
      { key: "Eco Rating", value: "Plastic-free" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1594226801341-41427b4e5c3e?w=600&q=80",
    brand: naturehome,
    categories: [catKitchen, categories[2]],
    defaultSku: {
      nanoId: "sku_cb_1",
      skuCode: "NH-BAM-CB-001",
      price: "42.99",
      quantity: 65,
    },
    createdAt: "2025-03-20T00:00:00Z",
  },
  {
    nanoId: "prod_5",
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description:
      "Full-grain leather crossbody bag with adjustable strap, magnetic closure, and thoughtfully organized interior pockets.",
    specifications: [
      { key: "Material", value: "Full-grain leather" },
      { key: "Dimensions", value: '10" × 7" × 3"' },
      { key: "Strap", value: "Adjustable, 45—55 inches" },
      { key: "Closure", value: "Magnetic snap" },
      { key: "Pockets", value: "5 interior + 2 exterior" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    brand: luxora,
    categories: [catWomen, categories[1]],
    defaultSku: {
      nanoId: "sku_cb_2",
      skuCode: "LUX-LTH-CB-001",
      price: "89.99",
      quantity: 20,
    },
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    nanoId: "prod_6",
    name: "Ultrabook 15 Pro",
    slug: "ultrabook-15-pro",
    description:
      "Featherlight ultrabook with a stunning 15.6-inch 4K OLED display, Intel Core i7, and all-day battery life.",
    specifications: [
      { key: "Processor", value: "Intel Core i7-13700H" },
      { key: "RAM", value: "16 GB DDR5" },
      { key: "Storage", value: "512 GB NVMe SSD" },
      { key: "Display", value: '15.6" 4K OLED' },
      { key: "Battery", value: "Up to 14 hours" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    brand: techpro,
    categories: [catLaptops, categories[0]],
    defaultSku: {
      nanoId: "sku_ub_1",
      skuCode: "TECH-UB-PRO-001",
      price: "1299.99",
      quantity: 15,
    },
    createdAt: "2025-06-10T00:00:00Z",
  },
  {
    nanoId: "prod_7",
    name: "Floral Print Dress",
    slug: "floral-print-dress",
    description:
      "Elegant midi dress with a hand-drawn floral pattern. Lightweight viscose fabric drapes beautifully for any occasion.",
    specifications: [
      { key: "Material", value: "Viscose blend" },
      { key: "Length", value: "Midi" },
      { key: "Sizes", value: "XS — XL" },
      { key: "Pattern", value: "Hand-drawn floral" },
      { key: "Care", value: "Gentle cold wash" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    brand: urbanstyle,
    categories: [catWomen, categories[1]],
    defaultSku: {
      nanoId: "sku_fd_1",
      skuCode: "US-FLO-DR-001",
      price: "59.99",
      quantity: 40,
    },
    createdAt: "2025-05-20T00:00:00Z",
  },
  {
    nanoId: "prod_8",
    name: "Ceramic Plant Pot Set",
    slug: "ceramic-plant-pot-set",
    description:
      "Matte-glazed ceramic pots with drainage holes and bamboo trays. Set of three in warm earth tones.",
    specifications: [
      { key: "Material", value: "Glazed ceramic" },
      { key: "Pieces", value: "3 pots + 3 trays" },
      { key: "Diameters", value: '4", 5", 6"' },
      { key: "Finish", value: "Matte earth tones" },
      { key: "Drainage", value: "Pre-drilled holes" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80",
    brand: naturehome,
    categories: [catDecor, categories[2]],
    defaultSku: {
      nanoId: "sku_pp_1",
      skuCode: "NH-CER-PP-001",
      price: "34.99",
      quantity: 50,
    },
    createdAt: "2025-04-01T00:00:00Z",
  },
  {
    nanoId: "prod_9",
    name: "Noise-Cancelling Earbuds",
    slug: "noise-cancelling-earbuds",
    description:
      "Compact true wireless earbuds with adaptive noise cancelling, IPX5 water resistance, and a pocket-sized charging case.",
    specifications: [
      { key: "Battery", value: "8 h (32 h with case)" },
      { key: "Driver", value: "10 mm custom" },
      { key: "Bluetooth", value: "5.3" },
      { key: "Water Resistance", value: "IPX5" },
      { key: "Case", value: "Wireless charging" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
    brand: techpro,
    categories: [catAudio, categories[0]],
    defaultSku: {
      nanoId: "sku_eb_1",
      skuCode: "TECH-EB-NC-001",
      price: "79.99",
      quantity: 80,
    },
    createdAt: "2025-05-25T00:00:00Z",
  },
  {
    nanoId: "prod_10",
    name: "Merino Wool Sweater",
    slug: "merino-wool-sweater",
    description:
      "Luxuriously fine 100% merino wool crew neck. Naturally temperature-regulating, odor-resistant, and impossibly soft.",
    specifications: [
      { key: "Material", value: "100% Merino wool" },
      { key: "Weight", value: "195 g/m²" },
      { key: "Sizes", value: "S — 3XL" },
      { key: "Fit", value: "Regular" },
      { key: "Care", value: "Hand wash cold" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    brand: greenleaf,
    categories: [catMen, categories[1]],
    defaultSku: {
      nanoId: "sku_sw_2",
      skuCode: "GL-MER-SW-001",
      price: "89.99",
      quantity: 35,
    },
    createdAt: "2025-04-20T00:00:00Z",
  },
  {
    nanoId: "prod_11",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Rugged portable speaker delivering room-filling 360-degree sound. Doubles as a power bank for your devices.",
    specifications: [
      { key: "Battery", value: "20 hours" },
      { key: "Output", value: "30 W" },
      { key: "Bluetooth", value: "5.2" },
      { key: "Water Resistance", value: "IP67" },
      { key: "Features", value: "Power bank built-in" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    brand: techpro,
    categories: [catAudio, categories[0]],
    defaultSku: {
      nanoId: "sku_sp_1",
      skuCode: "TECH-SP-PT-001",
      price: "59.99",
      quantity: 55,
    },
    createdAt: "2025-06-05T00:00:00Z",
  },
  {
    nanoId: "prod_12",
    name: "Linen Tablecloth",
    slug: "linen-tablecloth",
    description:
      "Stonewashed 100% French linen tablecloth. Gets softer with every wash. Available in four natural earth tones.",
    specifications: [
      { key: "Material", value: "100% French linen" },
      { key: "Size", value: '60" × 84"' },
      { key: "Colors", value: "4 earth tones" },
      { key: "Weight", value: "Medium, 190 gsm" },
      { key: "Care", value: "Machine washable" },
    ],
    coverUrl:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&q=80",
    brand: naturehome,
    categories: [catKitchen, categories[2]],
    defaultSku: {
      nanoId: "sku_lt_1",
      skuCode: "NH-LIN-LT-001",
      price: "44.99",
      quantity: 40,
    },
    createdAt: "2025-03-25T00:00:00Z",
  },
];

export function getProductBySlug(
  slug: string,
): ProductResource | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): ProductResource[] {
  return products.filter((p) => ["prod_1", "prod_6", "prod_7", "prod_4", "prod_10", "prod_2"].includes(p.nanoId!));
}

export function getLatestProducts(): ProductResource[] {
  return [...products].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
}

export function getPopularProducts(): ProductResource[] {
  return [...products].sort(
    (a, b) => a.defaultSku.quantity - b.defaultSku.quantity,
  );
}

export function getProductsByBrand(
  brandNanoId: string | null,
): ProductResource[] {
  if (!brandNanoId) return products;
  return products.filter((p) => p.brand.nanoId === brandNanoId);
}

export function getProductsByCategory(
  categoryNanoId: string | null,
): ProductResource[] {
  if (!categoryNanoId) return products;
  const ids = new Set<string>();
  function collectIds(cats: CategoryResource[]) {
    for (const cat of cats) {
      ids.add(cat.nanoId);
      if (cat.children) collectIds(cat.children);
    }
  }
  collectIds(categories);
  return products.filter((p) =>
    p.categories.some((c) => c.nanoId === categoryNanoId),
  );
}
