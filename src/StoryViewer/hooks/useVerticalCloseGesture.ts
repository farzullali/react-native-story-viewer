import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_DOWN_THRESHOLD = 100;

interface UseVerticalCloseGestureProps {
  onClose: () => void;
  onPause: () => void;
  onResume: () => void;
  visible: boolean;
}

export const useVerticalCloseGesture = ({
  onClose,
  onPause,
  onResume,
  visible,
}: UseVerticalCloseGestureProps) => {
  const translateY = useSharedValue(0);

  // Reset position when modal opens
  useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [visible, translateY]);

  // Vertical pan gesture for closing (swipe down)
  const verticalPanGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      runOnJS(onPause)();
    })
    .onUpdate(event => {
      'worklet';
      const { translationY } = event;

      // Only allow downward swipes
      if (translationY > 0) {
        translateY.value = translationY;
      }
    })
    .onEnd(event => {
      'worklet';
      const { translationY, velocityY } = event;

      const shouldClose =
        translationY > SWIPE_DOWN_THRESHOLD || velocityY > 500;

      if (shouldClose) {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0);
        runOnJS(onResume)();
      }
    })
    .activeOffsetY([-15, 15]) // Activate only when vertical movement is significant
    .failOffsetX([-20, 20]); // Fail if horizontal movement is too large (let FlatList handle it)

  // Animated styles for vertical gesture
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return {
    verticalPanGesture,
    animatedStyle,
    translateY,
  };
};
