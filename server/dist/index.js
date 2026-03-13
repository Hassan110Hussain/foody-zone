"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../public/images")));
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        error: "Internal server error",
        message: err.message,
    });
};
const seedDatabase = async () => {
    try {
        const foods = await (0, db_1.getAllFoods)();
        if (foods.length === 0) {
            const seedData = [
                {
                    id: (0, uuid_1.v4)(),
                    name: "Boilded Egg",
                    price: 10,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
                    image: "/images/egg.png",
                    type: "breakfast",
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "RAMEN",
                    price: 25,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
                    image: "/images/ramen.png",
                    type: "lunch",
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "GRILLED CHICKEN",
                    price: 45,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
                    image: "/images/chicken.png",
                    type: "dinner",
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "CAKE",
                    price: 18,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
                    image: "/images/cake.png",
                    type: "breakfast",
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "BURGER",
                    price: 23,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
                    image: "/images/burger.png",
                    type: "lunch",
                },
                {
                    id: (0, uuid_1.v4)(),
                    name: "PANCAKE",
                    price: 25,
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
                    image: "/images/pancake.png",
                    type: "dinner",
                },
            ];
            for (const food of seedData) {
                await (0, db_1.addFood)(food);
            }
            console.log("Database seeded with food data");
        }
    }
    catch (err) {
        console.error("Error seeding database:", err);
    }
};
app.get("/api/foods", async (req, res) => {
    try {
        const foods = await (0, db_1.getAllFoods)();
        res.json(foods);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch foods" });
    }
});
app.get("/api/foods/:id", async (req, res) => {
    try {
        const food = await (0, db_1.getFoodById)(req.params.id);
        if (!food) {
            return res.status(404).json({ error: "Food not found" });
        }
        res.json(food);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch food" });
    }
});
app.post("/api/orders", async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Invalid order items" });
        }
        let total = 0;
        for (const item of items) {
            const food = await (0, db_1.getFoodById)(item.foodId);
            if (!food) {
                return res.status(404).json({ error: `Food ${item.foodId} not found` });
            }
            total += food.price * item.quantity;
        }
        const order = {
            id: (0, uuid_1.v4)(),
            items,
            total,
            status: "pending",
            createdAt: Date.now(),
        };
        await (0, db_1.createOrder)(order);
        res.status(201).json(order);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
});
app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await (0, db_1.getOrderById)(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json(order);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
});
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await (0, db_1.getAllOrders)();
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});
app.get("/", async (req, res) => {
    try {
        const foods = await (0, db_1.getAllFoods)();
        res.json(foods);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch foods" });
    }
});
app.use(errorHandler);
const startServer = async () => {
    try {
        await (0, db_1.initializeDatabase)();
        await seedDatabase();
        app.listen(9000, () => {
            console.log("Server is running on port 9000");
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map