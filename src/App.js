import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import styled from "styled-components/native";
import { Animated, View, Text, Button } from 'react-native';

const shake = {
  from: 0,
  to: 10
}


let ShakeView = (props, ref) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  const shake = () => {
    Animated.loop(
    Animated.sequence([
      Animated.timing(
        fadeAnim,
        {
          toValue: -10,
          duration: 30,
        }
      ),
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 30,
        }
      ),
      Animated.timing(
        fadeAnim,
        {
          toValue: 10,
          duration: 30,
        }
      ),
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 30,
        }
      ),
    ]), {
      iterations: 2
    }).start()
  }

  useImperativeHandle(ref, () => ({
    shake: () => {
      shake()
    }
  }))

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{
          translateX: fadeAnim
        }]
      }}
    >
      {props.children}
    </Animated.View>
  );
};

ShakeView = forwardRef(ShakeView)

const App = () => {
  const shakeViewRef = useRef()

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ShakeView ref={shakeViewRef} style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
        <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Shake</Text>
      </ShakeView>
      <Button title="animate" onPress={() => {
        shakeViewRef.current.shake()
      }}/>
    </View>
  )
}



export default App;

const Header = styled.View`
  background-color: black;
`;
const H1 = styled.Text`
  color: white;
`;
