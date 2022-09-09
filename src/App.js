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
            translateX: animationValue
          }
        ]
      }
    },
    animation: (animationValue) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(
            animationValue,
            {
              toValue: -10,
              duration: 30,
            }
          ),
          Animated.timing(
            animationValue,
            {
              toValue: 0,
              duration: 30,
            }
          ),
          Animated.timing(
            animationValue,
            {
              toValue: 10,
              duration: 30,
            }
          ),
          Animated.timing(
            animationValue,
            {
              toValue: 0,
              duration: 30,
            }
          ),
        ]), {
        iterations: 2
      })
    }
  },
  fadeInUp: {
    label: "fade in up",
    animation: (animationValue) => {
      return Animated.loop(Animated.timing(animationValue, {
        toValue: 1,
        duration: 1000,
      }
      ), {
        iterations: 1
      })
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
      setCurrentAnimation("shake");
      return new Promise((resolve) => {
        animations.shake.animation(animationValue).start((result) => resolve({
          ...result,
          ...animations.shake
        }));
      })
    },
    fadeInUp: () => {
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
