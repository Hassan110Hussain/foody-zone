import styled from "styled-components";
import { BASE_URL } from "../../App";
import { Food } from "../../types";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

interface SearchResultProps {
  data: Food[] | null;
}

const SearchResult = ({ data }: SearchResultProps) => {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (food: Food) => {
    addToCart(food, 1);
    setAddedItems((prev) => new Set(prev).add(food.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(food.id);
        return newSet;
      });
    }, 1500);
  };

  return (
    <FoodCardContainer>
      <FoodCards>
        {data?.map((food) => (
          <FoodCard key={food.id}>
            <div className="food_image">
              <img src={BASE_URL + food.image} alt={food.name} />
            </div>
            <div className="food_info">
              <div className="info">
                <h3>{food.name}</h3>
                <p>{food.text}</p>
              </div>
              <ButtonWrapper>
                <PriceButton>${food.price.toFixed(2)}</PriceButton>
                <AddButton
                  $isAdded={addedItems.has(food.id)}
                  onClick={() => handleAddToCart(food)}
                >
                  {addedItems.has(food.id) ? "✓ Added" : "Add to Cart"}
                </AddButton>
              </ButtonWrapper>
            </div>
          </FoodCard>
        ))}
      </FoodCards>
    </FoodCardContainer>
  );
};

export default SearchResult;

const FoodCardContainer = styled.section`
  background-image: url("/bg.png");
  background-size: cover;
  height: 100vh;
`;

const FoodCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 32px;
  column-gap: 20px;
  justify-content: center;
  align-items: center;
  padding-top: 80px;
`;

const FoodCard = styled.div`
  display: flex;
  width: 350px;
  height: 175px;
  border: 1px solid;
  border-image-source: radial-gradient(
      88% 288% at 108% 113%,
      #eabfff 0%,
      rgba(135, 38, 183, 0) 100%
    ),
    radial-gradient(80% 222% at -14% -12%, #98f9ff 0%, rgba(255, 255, 255, 0) 100%);
  border-image-slice: 1;
  background: linear-gradient(
      235.68deg,
      rgba(252, 176, 69, 0.2) 0%,
      rgba(247, 248, 247, 0.2) 100%
    )
    border-box;
  border-radius: 20px;
  overflow: hidden;

  .food_image {
    flex: 1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .food_info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    color: white;

    .info {
      h3 {
        margin: 0;
        font-size: 16px;
      }
      p {
        margin: 5px 0 0 0;
        font-size: 12px;
        color: #ccc;
      }
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const PriceButton = styled.button`
  background: #ff4343;
  outline: 1px solid #ff4343;
  border-radius: 5px;
  padding: 6px 12px;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
  font-weight: 600;

  &:hover {
    background-color: #890606;
  }
`;

interface AddButtonProps {
  $isAdded: boolean;
}

const AddButton = styled.button<AddButtonProps>`
  background: ${(props) => (props.$isAdded ? "#4caf50" : "#ff4343")};
  outline: 1px solid ${(props) => (props.$isAdded ? "#45a049" : "#ff4343")};
  border-radius: 5px;
  padding: 6px 12px;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$isAdded ? "#45a049" : "#890606")};
  }
`;