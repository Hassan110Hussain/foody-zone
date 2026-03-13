"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.getOrderById = exports.createOrder = exports.addFood = exports.getFoodById = exports.getAllFoods = exports.initializeDatabase = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "../food.db");
const db = new sqlite3_1.default.Database(dbPath);
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS foods (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          text TEXT NOT NULL,
          image TEXT NOT NULL,
          type TEXT NOT NULL
        )`, (err) => {
                if (err)
                    reject(err);
            });
            db.run(`CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          items TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT NOT NULL,
          createdAt INTEGER NOT NULL
        )`, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    });
};
exports.initializeDatabase = initializeDatabase;
const getAllFoods = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM foods", (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows || []);
        });
    });
};
exports.getAllFoods = getAllFoods;
const getFoodById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM foods WHERE id = ?", [id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row || null);
        });
    });
};
exports.getFoodById = getFoodById;
const addFood = (food) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO foods (id, name, price, text, image, type) VALUES (?, ?, ?, ?, ?, ?)", [food.id, food.name, food.price, food.text, food.image, food.type], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
exports.addFood = addFood;
const createOrder = (order) => {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO orders (id, items, total, status, createdAt) VALUES (?, ?, ?, ?, ?)", [order.id, JSON.stringify(order.items), order.total, order.status, order.createdAt], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
exports.createOrder = createOrder;
const getOrderById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM orders WHERE id = ?", [id], (err, row) => {
            if (err)
                reject(err);
            else if (row) {
                resolve({
                    ...row,
                    items: JSON.parse(row.items),
                });
            }
            else {
                resolve(null);
            }
        });
    });
};
exports.getOrderById = getOrderById;
const getAllOrders = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM orders", (err, rows) => {
            if (err)
                reject(err);
            else
                resolve((rows || []).map((row) => ({
                    ...row,
                    items: JSON.parse(row.items),
                })));
        });
    });
};
exports.getAllOrders = getAllOrders;
//# sourceMappingURL=db.js.map