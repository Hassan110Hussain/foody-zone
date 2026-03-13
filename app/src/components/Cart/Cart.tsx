import styled from "styled-components";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { Food } from "../../types";
import { foodApi, orderApi, ApiError } from "../../services/api";
import { BASE_URL } from "../../App";

interface CartProps {
  onBack: () => void;
}

const Cart = ({ onBack }: CartProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const [foods, setFoods] = useState<Map<string, Food>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const allFoods = await foodApi.getAllFoods();
        const foodMap = new Map(allFoods.map((f) => [f.id, f]));
        setFoods(foodMap);
      } catch (err) {
        console.error("Failed to load foods:", err);
      }
    };
    loadFoods();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const food = foods.get(item.foodId);
      return total + (food?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const order = await orderApi.createOrder(cart);
      setOrderSuccess(true);
      clearCart();
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create order");
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !orderSuccess) {
    return (
      <CartContainer>
        <EmptyCart>Your cart is empty</EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <BackButton onClick={onBack}>← Back</BackButton>
        <h2>Shopping Cart ({getCartTotal()} items)</h2>
      </CartHeader>

      {orderSuccess && (
        <SuccessMessage>✓ Order placed successfully!</SuccessMessage>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CartItems>
        {cart.map((item) => {
          const food = foods.get(item.foodId);
          if (!food) return null;

          return (
            <CartItem key={item.id}>
              <ItemImage>
                <img src={BASE_URL + food.image} alt={food.name} />
              </ItemImage>
              <ItemDetails>
                <ItemName>{food.name}</ItemName>
                <ItemPrice>${food.price.toFixed(2)}</ItemPrice>
              </ItemDetails>
              <QuantityControl>
                <QuantityBtn
                  onClick={() =>
                    updateQuantity(item.foodId, item.quantity - 1)
                  }
                >
                  −
                </QuantityBtn>
                <QuantityDisplay>{item.quantity}</QuantityDisplay>
                <QuantityBtn
                  onClick={() =>
                    updateQuantity(item.foodId, item.quantity + 1)
                  }
                >
                  +
                </QuantityBtn>
              </QuantityControl>
              <ItemTotal>
                ${(food.price * item.quantity).toFixed(2)}
              </ItemTotal>
              <RemoveBtn onClick={() => removeFromCart(item.foodId)}>
                ✕
              </RemoveBtn>
            </CartItem>
          );
        })}
      </CartItems>

      <CartFooter>
        <TotalRow>
          <span>Total:</span>
          <TotalPrice>${calculateTotal().toFixed(2)}</TotalPrice>
        </TotalRow>
        <CheckoutBtn
          onClick={handleCheckout}
          disabled={loading || cart.length === 0}
        >
          {loading ? "Processing..." : "Checkout"}
        </CheckoutBtn>
      </CartFooter>
    </CartContainer>
  );
};

export default Cart;

const CartContainer = styled.div`
  background-color: #111010;
  color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  margin: 20px auto;
`;

const CartHeader = styled.div`
  border-bottom: 2px solid #ff4343;
  padding-bottom: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;

  h2 {
    margin: 0;
    font-size: 24px;
    flex: 1;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #ff4343;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 40px 20px;
  font-size: 18px;
  color: #999;
`;

const SuccessMessage = styled.div`
  background-color: #4caf50;
  color: white;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 600;
`;

const ErrorMessage = styled.div`
  background-color: #f44336;
  color: white;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #1a1a1a;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #333;
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const ItemPrice = styled.div`
  color: #ff4343;
  font-size: 14px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #222;
  border-radius: 5px;
  padding: 5px;
`;

const QuantityBtn = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #ff4343;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 30px;
  text-align: center;
`;

const ItemTotal = styled.div`
  min-width: 80px;
  text-align: right;
  font-weight: 600;
  color: #ff4343;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;

  &:hover {
    color: #f44336;
  }
`;

const CartFooter = styled.div`
  border-top: 2px solid #ff4343;
  padding-top: 15px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
`;

const TotalPrice = styled.span`
  color: #ff4343;
  font-size: 24px;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ff4343;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: #890606;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
