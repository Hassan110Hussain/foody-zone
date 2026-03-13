# Food Zone - Full Stack Food Ordering App

A modern food ordering application built with React, Express, TypeScript, and SQLite.

## Features

✅ **Database Integration** - SQLite database for persistent food and order storage
✅ **Shopping Cart** - Add/remove items, adjust quantities, real-time total calculation
✅ **Order Management** - Create and track orders with status tracking
✅ **TypeScript Support** - Full type safety across frontend and backend
✅ **Error Handling** - Comprehensive error handling with user-friendly messages
✅ **Responsive UI** - Modern styled-components design
✅ **REST API** - Clean API endpoints for foods and orders

## Project Structure

```
├── app/                    # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Cart context for state management
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── tsconfig.json       # TypeScript config
│
└── server/                 # Express Backend
    ├── src/
    │   ├── db.ts           # Database initialization & queries
    │   └── index.ts        # Express server & routes
    ├── public/images/      # Static food images
    ├── package.json
    └── tsconfig.json
```

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Backend Setup

```bash
cd server
npm install
npm run server
```

The server will:
- Initialize SQLite database at `server/food.db`
- Seed initial food data
- Run on `http://localhost:9000`

### Frontend Setup

```bash
cd app
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## API Endpoints

### Foods
- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders

### Legacy
- `GET /` - Get all foods (backward compatibility)

## Usage

1. **Browse Foods** - View all available foods with search and category filters
2. **Add to Cart** - Click "Add to Cart" on any food item
3. **Manage Cart** - Click the cart button to view, adjust quantities, or remove items
4. **Checkout** - Click "Checkout" to place your order
5. **Order Confirmation** - See success message when order is placed

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- styled-components
- Context API for state management

### Backend
- Express.js
- TypeScript
- SQLite3
- CORS
- UUID for unique IDs

## Error Handling

The app includes comprehensive error handling:
- Network error messages
- Invalid order validation
- Database error handling
- User-friendly error displays

## Future Enhancements

- User authentication & accounts
- Order history per user
- Payment integration
- Admin dashboard
- Real-time order tracking
- Email notifications
