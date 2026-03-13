export interface Food {
  id: string;
  name: string;
  price: number;
  text: string;
  image: string;
  type: "breakfast" | "lunch" | "dinner";
}

export interface CartItem {
  id: string;
  foodId: string;
  quantity: number;
  addedAt: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
