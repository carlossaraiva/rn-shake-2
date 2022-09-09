import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { Animated, View, Text, Button } from 'react-native';

const animations = {
  label: "shake",
  shake: {
    label: "shake",
    style: (animationValue) => {
      return {
        transform: [
          {
            translateX: animationValue.interpolate({
              inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
              outputRange: [0, -20, 20, -20, 20, -20, 20, -20, 20, -20, 0]
            })
          }
        ]
      }
    },
    animation: (animationValue) => {
      return Animated.timing(
        animationValue,
        {
          fromValue: 0,
          toValue: 1,
          duration: 500,
        }
      )
    }
  },
  fadeInUp: {
    label: "fade in up",
    animation: (animationValue) => {
      return Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
      }
      )
    },
    style: (animationValue) => {
      return {
        opacity: animationValue,
        transform: [
          {
            translateY: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0]
            })
          }
        ]
      }
    }
  }
}


let ShakeView = (props, ref) => {
  const animationValue = useRef(new Animated.Value(0)).current
  const [currentAnimation, setCurrentAnimation] = useState()

  useImperativeHandle(ref, () => ({
    shake: () => {
      animationValue.setValue(0);
      setCurrentAnimation("shake");
      return new Promise((resolve) => {
        animations.shake.animation(animationValue).start((result) => resolve({
          ...result,
          ...animations.shake
        }));
      })
    },
    fadeInUp: () => {
      animationValue.setValue(0);
      setCurrentAnimation("fadeInUp");
      return new Promise((resolve) => {
        animations.fadeInUp.animation(animationValue).start((result) => resolve({
          ...result,
          ...animations.fadeInUp
        }));
      })
    }
  }))

  return (
    <Animated.View
      style={{
        ...props.style,
        ...animations[currentAnimation]?.style(animationValue),

      }}
    >
      {props.children}
    </Animated.View>
  );
};

ShakeView = forwardRef(ShakeView)

const App = () => {
  const [currentAnimation, setCurrentAnimation] = useState()
  const [animationStatus, setAnimationStatus] = useState("idle")
  const shakeViewRef = useRef()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Animation status: {animationStatus}</Text>
      <ShakeView ref={shakeViewRef} style={{ width: 250, height: 50, backgroundColor: 'powderblue' }}>
        <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>{currentAnimation}</Text>
      </ShakeView>
      <View style={{ marginTop: 100 }}>
        <Button title="shake" onPress={async () => {
          setCurrentAnimation("shake")
          setAnimationStatus("animating")
          await shakeViewRef.current.shake()
          setAnimationStatus("finished")
        }} />
        <Button title="fadeInUp" onPress={async () => {
          setCurrentAnimation("fadeInUp")
          setAnimationStatus("animating")
          await shakeViewRef.current.fadeInUp()
          setAnimationStatus("finished")
        }} />
      </View>
    </View>
  )
}



export default App;
