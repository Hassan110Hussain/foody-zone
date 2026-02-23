import { isValidElement, useEffect, useState } from "react";
import styled from "styled-components";
import SearchResult from "./components/SearchResults/SearchResult";

export const BASE_URL = "http://localhost:9000";

const App = () => {
  const [data, setData] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectBtn,setSelectBtn] = useState('all');

  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);

      try {
        const response = await fetch(BASE_URL);
        const json = await response.json();

        setLoading(false);
        setFilterData(json);
        setData(json);
      } catch (error) {
        setError("unable to fetch data");
      }
    };
    fetchFoodData()
  }, []);

  const searchFood = (e) => {
    const searchValue = e.target.value;

    if(searchValue == '') {
      setFilterData(null);
    }

    const filter = data?.filter((food) => food.name.toLowerCase().includes(searchValue.toLowerCase()))
    setFilterData(filter)
  };
   const filterFood = (type) => {
    if(type == 'all') {
      setFilterData(data);
      setSelectBtn('all')
      return;
  }

  const filter = data?.filter((food) => food.type.toLowerCase().includes(type.toLowerCase()))
    setFilterData(filter)
    setSelectBtn(type)
};

  const filterBtns = [
    {
      name: 'All',
      type: 'all',
    },
    {
      name: 'Breakfast',
      type: 'breakfast',
    },
    {
      name: 'Lunch',
      type: 'lunch',
    },
    {
      name: 'Dinner',
      type: 'dinner',
    }
  ]

  if (error) return <div>{error}</div>;
  if (loading) return <div>loaing...</div>;

  return (
    <Container>
      <TopContainer>
        <div className="logo">
          <img src="/logo.svg" alt="logo" />
        </div>
        <div className="search">
          <input onChange={searchFood} placeholder="Search Food" />
        </div>
      </TopContainer>
      <FilterContainer>
        {filterBtns.map((value) => (<Button isSelected={selectBtn == value.type}
        key={value.name} onClick={() => filterFood(value.type)}>{value.name}</Button>))}
      </FilterContainer>
      <SearchResult data={filterData} />
    </Container>
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

  .search {
    input {
      background-color: transparent;
      border: 1px solid red;
      color: white;
      border-radius: 5px;
      height: 40px;
      font-size: 16px;
      padding: 0 10px;
    }
  }
`;

const FilterContainer = styled.section`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const Button = styled.button`
  background: ${(isSelected)=> (isSelected?'#ff4343':'#890606')};
  outline: 1px solid ${(isSelected)=> (isSelected?'white':'#890606')};
  border-radius: 5px;
  padding: 6px 12px;
  border: none;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover{
    background-color: #890606;
  }
`;
