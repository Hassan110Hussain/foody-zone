import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.join(__dirname, "../food.db");
const db = new sqlite3.Database(dbPath);

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

export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS foods (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          text TEXT NOT NULL,
          image TEXT NOT NULL,
          type TEXT NOT NULL
        )`,
        (err) => {
          if (err) reject(err);
        }
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          items TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT NOT NULL,
          createdAt INTEGER NOT NULL
        )`,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
};

export const getAllFoods = (): Promise<Food[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM foods", (err, rows: Food[] | undefined) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

export const getFoodById = (id: string): Promise<Food | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM foods WHERE id = ?", [id], (err, row: Food | undefined) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
};

export const addFood = (food: Food): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO foods (id, name, price, text, image, type) VALUES (?, ?, ?, ?, ?, ?)",
      [food.id, food.name, food.price, food.text, food.image, food.type],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export const createOrder = (order: Order): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO orders (id, items, total, status, createdAt) VALUES (?, ?, ?, ?, ?)",
      [order.id, JSON.stringify(order.items), order.total, order.status, order.createdAt],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

export const getOrderById = (id: string): Promise<Order | null> => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM orders WHERE id = ?", [id], (err, row: any) => {
      if (err) reject(err);
      else if (row) {
        resolve({
          ...row,
          items: JSON.parse(row.items),
        } as Order);
      } else {
        resolve(null);
      }
    });
  });
};

export const getAllOrders = (): Promise<Order[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM orders", (err, rows: any[] | undefined) => {
      if (err) reject(err);
      else
        resolve(
          (rows || []).map((row) => ({
            ...row,
            items: JSON.parse(row.items),
          } as Order))
        );
    });
  });
};
