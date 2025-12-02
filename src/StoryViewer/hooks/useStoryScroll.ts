import { useEffect, useRef } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UseStoryScrollProps {
  currentUserIndex: number;
  visible: boolean;
  onUserChange: (index: number) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
}

export const useStoryScroll = ({
  currentUserIndex,
  visible,
  onUserChange,
  onScrollStart,
  onScrollEnd,
}: UseStoryScrollProps) => {
  const flatListRef = useRef<FlatList>(null);
  const isScrollingRef = useRef(false);

  // Handle scroll begin
  const handleScrollBeginDrag = () => {
    isScrollingRef.current = true;
    onScrollStart?.();
  };

  // Handle scroll end and update current user
  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );
    isScrollingRef.current = false;

    if (newIndex !== currentUserIndex) {
      onUserChange(newIndex);
    }
    onScrollEnd?.();
  };

  // Handle initial scroll index failure
  const handleScrollToIndexFailed = (info: {
    index: number;
    averageItemLength: number;
  }) => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
      });
    }, 100);
  };

  // Programmatically scroll when currentUserIndex changes
  useEffect(() => {
    if (visible && flatListRef.current && !isScrollingRef.current) {
      // Small delay to ensure FlatList is mounted and ready
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: currentUserIndex,
          animated: true,
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentUserIndex, visible]);

  return {
    flatListRef,
    handleScrollBeginDrag,
    handleMomentumScrollEnd,
    handleScrollToIndexFailed,
  };
};
