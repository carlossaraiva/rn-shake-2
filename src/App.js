import React from "react";
import styled from "styled-components/native";

const App = () => {
  return (
    <>
      <Header>
        <H1>Hello React Native</H1>
      </Header>
    </>
  );
};
export default App;

const Header = styled.View`
  background-color: black;
`;
const H1 = styled.Text`
  color: white;
`;
