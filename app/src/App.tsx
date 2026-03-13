import { useEffect, useState } from "react";
import styled from "styled-components";
import SearchResult from "./components/SearchResults/SearchResult";
import Cart from "./components/Cart/Cart";
import { CartProvider } from "./context/CartContext";
import { foodApi, ApiError } from "./services/api";
import { Food } from "./types";

export const BASE_URL = "http://localhost:9000";

const App = () => {
  const [data, setData] = useState<Food[] | null>(null);
  const [filterData, setFilterData] = useState<Food[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectBtn, setSelectBtn] = useState("all");
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      setError(null);

      try {
        const foods = await foodApi.getAllFoods();
        setFilterData(foods);
        setData(foods);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unable to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFoodData();
  }, []);

  const searchFood = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;

    if (searchValue === "") {
      setFilterData(data);
      return;
    }

    const filter = data?.filter((food) =>
      food.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilterData(filter || null);
  };

  const filterFood = (type: string) => {
    if (type === "all") {
      setFilterData(data);
      setSelectBtn("all");
      return;
    }

    const filter = data?.filter((food) =>
      food.type.toLowerCase().includes(type.toLowerCase())
    );
    setFilterData(filter || null);
    setSelectBtn(type);
  };

  const filterBtns = [
    { name: "All", type: "all" },
    { name: "Breakfast", type: "breakfast" },
    { name: "Lunch", type: "lunch" },
    { name: "Dinner", type: "dinner" },
  ];

  if (error && !data) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </ErrorContainer>
    );
  }

  if (loading && !data) {
    return (
      <LoadingContainer>
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <CartProvider>
      <Container>
        <TopContainer>
          <div className="logo">
            <img src="/logo.svg" alt="logo" />
          </div>
          <div className="search">
            <input onChange={searchFood} placeholder="Search Food" />
          </div>
          <CartToggle onClick={() => setShowCart(!showCart)}>
            🛒 Cart
          </CartToggle>
        </TopContainer>

        {showCart ? (
          <Cart onBack={() => setShowCart(false)} />
        ) : (
          <>
            <FilterContainer>
              {filterBtns.map((value) => (
                <Button
                  $isSelected={selectBtn === value.type}
                  key={value.name}
                  onClick={() => filterFood(value.type)}
                >
                  {value.name}
                </Button>
              ))}
            </FilterContainer>
            <SearchResult data={filterData} />
          </>
        )}
      </Container>
    </CartProvider>
  );
};

export default App;

const Container = styled.div`
  background-color: #111010;
  max-width: 1200px;
  margin: 0 auto;
`;

const TopContainer = styled.section`
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  gap: 20px;

  .logo {
    flex-shrink: 0;
  }

  .search {
    flex: 1;
    input {
      width: 100%;
      background-color: transparent;
      border: 1px solid red;
      color: white;
      border-radius: 5px;
      height: 40px;
      font-size: 16px;
      padding: 0 10px;

      &::placeholder {
        color: #999;
      }
    }
  }
`;

const FilterContainer = styled.section`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

interface ButtonProps {
  $isSelected?: boolean;
}

export const Button = styled.button<ButtonProps>`
  background: ${(props) => (props.$isSelected ? "#ff4343" : "#890606")};
  outline: 1px solid ${(props) => (props.$isSelected ? "white" : "#890606")};
  border-radius: 5px;
  padding: 6px 12px;
  border: none;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #890606;
  }
`;

const CartToggle = styled.button`
  background-color: #ff4343;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.3s;

  &:hover {
    background-color: #890606;
  }
`;

const ErrorContainer = styled.div`
  background-color: #111010;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  background-color: #f44336;
  color: white;
  padding: 20px;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
`;

const LoadingContainer = styled.div`
  background-color: #111010;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 24px;
`;
