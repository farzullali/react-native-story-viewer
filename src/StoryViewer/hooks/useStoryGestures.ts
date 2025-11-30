import { useCallback } from 'react';
import { Dimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100; // pixels

interface UseStoryGesturesProps {
  onClose: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
  onPause: () => void;
  onResume: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

export const useStoryGestures = ({
  onClose,
  onNextUser,
  onPrevUser,
  onPause,
  onResume,
  canGoNext,
  canGoPrev,
}: UseStoryGesturesProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      runOnJS(onPause)();
    })
    .onUpdate((event) => {
      'worklet';
      const { translationX, translationY } = event;

      // Determine swipe direction based on which is larger
      const isVertical = Math.abs(translationY) > Math.abs(translationX);

      if (isVertical) {
        // Vertical swipe - only allow downward for close
        if (translationY > 0) {
          translateY.value = translationY;
          translateX.value = 0; // Reset horizontal
        }
      } else {
        // Horizontal swipe - for user navigation
        translateX.value = translationX;
        translateY.value = 0; // Reset vertical
      }
    })
    .onEnd((event) => {
      'worklet';
      const { translationX, translationY, velocityX, velocityY } = event;

      // Determine primary swipe direction
      const isVertical = Math.abs(translationY) > Math.abs(translationX);

      if (isVertical) {
        // Vertical swipe - close gesture
        const shouldClose = translationY > SWIPE_THRESHOLD || velocityY > 500;

        if (shouldClose) {
          translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, () => {
            runOnJS(onClose)();
            translateY.value = 0;
          });
        } else {
          // Bounce back
          translateY.value = withSpring(0);
          runOnJS(onResume)();
        }
      } else {
        // Horizontal swipe - user navigation
        const shouldSwipe = Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500;

        if (shouldSwipe) {
          if (translationX < 0 && canGoNext) {
            // Swipe LEFT → Next user
            translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, () => {
              runOnJS(onNextUser)();
              translateX.value = 0; // Reset for next transition
            });
          } else if (translationX > 0 && canGoPrev) {
            // Swipe RIGHT → Previous user
            translateX.value = withTiming(SCREEN_WIDTH, { duration: 250 }, () => {
              runOnJS(onPrevUser)();
              translateX.value = 0; // Reset for next transition
            });
          } else {
            // Can't navigate, bounce back
            translateX.value = withSpring(0);
            runOnJS(onResume)();
          }
        } else {
          // Didn't meet threshold, bounce back
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          runOnJS(onResume)();
        }
      }
    });

  return {
    panGesture,
    translateX,
    translateY,
  };
};