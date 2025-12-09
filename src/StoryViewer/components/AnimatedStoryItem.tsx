import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { SwipeAnimationConfig } from '../types';

interface AnimatedStoryItemProps {
  index: number;
  scrollOffset: SharedValue<number>;
  animationConfig?: SwipeAnimationConfig;
  children: React.ReactNode;
  width: number;
}

export const AnimatedStoryItem: React.FC<AnimatedStoryItemProps> = ({
  index,
  scrollOffset,
  animationConfig,
  children,
  width,
}) => {
  const animationType = animationConfig?.type || 'default';
  const customAnimation = animationConfig?.customAnimation;

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const position = scrollOffset.value - index * width;
    const progress = position / width;

    // Custom animation provided by user
    if (animationType === 'custom' && customAnimation) {
      const customStyle = customAnimation(index, scrollOffset.value, width);
      return customStyle as any;
    }

    // Built-in animations
    switch (animationType) {
      case 'fade': {
        const opacity = 1 - Math.abs(progress) * 0.5;
        return {
          opacity: Math.max(0.5, Math.min(1, opacity)),
        } as any;
      }

      case 'scale': {
        const scale = 1 - Math.abs(progress) * 0.2;
        const clampedScale = Math.max(0.8, Math.min(1, scale));
        return {
          transform: [{ scale: clampedScale }],
        } as any;
      }

      case 'cube': {
        const rotateY = progress * -90;
        const translateX = position;
        return {
          transform: [
            { perspective: 1000 },
            { translateX: translateX },
            { rotateY: `${rotateY}deg` },
          ],
        } as any;
      }

      case 'default':
      default:
        return {} as any;
    }
  }, [index, width, animationType, customAnimation]);

  return (
    <Animated.View style={[styles.itemContainer, { width }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: '100%',
    backgroundColor: '#000',
  },
});
