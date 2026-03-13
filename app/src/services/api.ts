import { Food, Order, CartItem } from "../types";

const BASE_URL = "http://localhost:9000";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
};

export const foodApi = {
  async getAllFoods(): Promise<Food[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/foods`);
      return handleResponse<Food[]>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Failed to fetch foods");
    }
  },

  async getFoodById(id: string): Promise<Food> {
    try {
      const response = await fetch(`${BASE_URL}/api/foods/${id}`);
      return handleResponse<Food>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Failed to fetch food");
    }
  },
};

export const orderApi = {
  async createOrder(items: CartItem[]): Promise<Order> {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
      return handleResponse<Order>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Failed to create order");
    }
  },

  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/${id}`);
      return handleResponse<Order>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Failed to fetch order");
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`);
      return handleResponse<Order[]>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, "Failed to fetch orders");
    }
  },
};

export { ApiError };
