import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import {
  initializeDatabase,
  getAllFoods,
  getFoodById,
  addFood,
  createOrder,
  getOrderById,
  getAllOrders,
  Food,
  Order,
  CartItem,
} from "./db";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Error handling middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: any
) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
};

// Initialize database and seed data
const seedDatabase = async () => {
  try {
    const foods = await getAllFoods();
    if (foods.length === 0) {
      const seedData: Food[] = [
        {
          id: uuidv4(),
          name: "Boilded Egg",
          price: 10,
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          image: "/images/egg.png",
          type: "breakfast",
        },
        {
          id: uuidv4(),
          name: "RAMEN",
          price: 25,
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          image: "/images/ramen.png",
          type: "lunch",
        },
        {
          id: uuidv4(),
          name: "GRILLED CHICKEN",
          price: 45,
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          image: "/images/chicken.png",
          type: "dinner",
        },
        {
          id: uuidv4(),
          name: "CAKE",
          price: 18,
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          image: "/images/cake.png",
          type: "breakfast",
        },
        {
          id: uuidv4(),
          name: "BURGER",
          price: 23,
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          image: "/images/burger.png",
          type: "lunch",
        },
        {
          id: uuidv4(),
          name: "PANCAKE",
          price: 25,
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
          image: "/images/pancake.png",
          type: "dinner",
        },
      ];

      for (const food of seedData) {
        await addFood(food);
      }
      console.log("Database seeded with food data");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

// Routes
app.get("/api/foods", async (req: Request, res: Response) => {
  try {
    const foods = await getAllFoods();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch foods" });
  }
});

app.get("/api/foods/:id", async (req: Request, res: Response) => {
  try {
    const food = await getFoodById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch food" });
  }
});

app.post("/api/orders", async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order items" });
    }

    let total = 0;
    for (const item of items) {
      const food = await getFoodById(item.foodId);
      if (!food) {
        return res.status(404).json({ error: `Food ${item.foodId} not found` });
      }
      total += food.price * item.quantity;
    }

    const order: Order = {
      id: uuidv4(),
      items,
      total,
      status: "pending",
      createdAt: Date.now(),
    };

    await createOrder(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/api/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.get("/api/orders", async (req: Request, res: Response) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Legacy endpoint for backward compatibility
app.get("/", async (req: Request, res: Response) => {
  try {
    const foods = await getAllFoods();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch foods" });
  }
});

app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    await seedDatabase();
    app.listen(9000, () => {
      console.log("Server is running on port 9000");
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
