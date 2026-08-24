export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  discountPrice: number | null;
  stock: number;
  categoryId: string;
  category?: Category;
  mainImage: string;
  galleryImages: string | null; // JSON string
  description: string;
  caliber: string | null;
  tubeCapacity: string | null;
  maxPressure: string | null;
  barrelLength: string | null;
  stockMaterial: string | null;
  isFeatured: boolean;
  isActive: boolean;
  views: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string | null;
  subtotal: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  whatsappSent: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreSetting {
  id: string;
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  address: string;
  city: string;
  operationalHours: string;
  googleMapsUrl: string;
}

export interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingOrdersCount: number;
  totalProducts: number;
  lowStockProductsCount: number;
  recentOrders: Order[];
  dailySales: { date: string; day: string; count: number; total: number }[];
  orderStatusCounts: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}
