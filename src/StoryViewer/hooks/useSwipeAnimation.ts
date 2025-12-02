import { useCallback } from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { SwipeAnimationConfig } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UseSwipeAnimationProps {
  config?: SwipeAnimationConfig;
}

export const useSwipeAnimation = ({ config }: UseSwipeAnimationProps) => {
  const animationType = config?.type || 'default';
  const duration = config?.duration || 250;

  const getAnimatedStyle = useCallback(
    (index: number, scrollOffset: number): ViewStyle => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];

      // Calculate position relative to screen
      const position = scrollOffset - index * SCREEN_WIDTH;
      const progress = position / SCREEN_WIDTH;

      // Custom animation provided by user
      if (animationType === 'custom' && config?.customAnimation) {
        const customStyle = config.customAnimation(index, scrollOffset, SCREEN_WIDTH);
        return customStyle as ViewStyle;
      }

      // Built-in animations
      switch (animationType) {
        case 'fade': {
          const opacity = 1 - Math.abs(progress) * 0.5;
          return {
            opacity: Math.max(0.5, Math.min(1, opacity)),
          };
        }

        case 'scale': {
          const scale = 1 - Math.abs(progress) * 0.2;
          return {
            transform: [{ scale: Math.max(0.8, Math.min(1, scale)) }],
          };
        }

        case 'cube': {
          const rotateY = progress * -90;
          const translateX = position;
          return {
            transform: [
              { perspective: 1000 },
              { translateX },
              { rotateY: `${rotateY}deg` },
            ],
          };
        }

        case 'default':
        default:
          return {};
      }
    },
    [animationType, config],
  );

  return {
    getAnimatedStyle,
    duration,
  };
};
