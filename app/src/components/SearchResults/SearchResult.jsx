import styled from "styled-components";
import { BASE_URL } from "../../App";
import { Button } from "../../App";

const SearchResult = ({data}) => {
  return (
    <FoodCardContainer>
        <FoodCards>
          {
            data?.map(({name,image,text,price})=><FoodCard key={name}>
              <div className="food_image">
                <img src={BASE_URL + image} alt="img" />
              </div>
              <div className="food_info">
                <div className="info">
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
                <Button>{price.toFixed(2)}</Button>
              </div>
            </FoodCard>)
          }
        </FoodCards>
      </FoodCardContainer>
  )
}

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
  rgba(135,38,183,0) 100%
 ),
 radial-gradient(
  80% 222% at -14% -12%,
  #98f9ff 0%,
  rgba(255,255,255,0) 100%
 );

 background: url(.png),
 radial-gradient(
   98% 143% at 15% 21%,
   rgba(165,239,255,0.2),
   rgba(110,191,244,0.04) 77%,
   rgba(70,144,213,0) 100%
 );
  background-blend-mode: overlay, normal;
  backdrop-filter: blur(13);
  border-radius: 20px;
  padding: 8px;

  .food_info{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: end;

    h3 {
      margin-top: 8px;
      font-size: 16px;
      font-weight: 500;
    }
    p {
      margin-top: 4px;
      font-size: 12px;
    }
  }
`