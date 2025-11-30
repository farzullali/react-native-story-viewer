import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, StatusBar, Dimensions } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { StoryViewerProps } from './types';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import { useStoryTimer } from './hooks/useStoryTimer';
import { useStoryGestures } from './hooks/useStoryGestures';
import { StoryProgress } from './components/StoryProgress';
import { StoryHeader } from './components/StoryHeader';
import { StoryContent } from './components/StoryContent';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StoryViewer: React.FC<StoryViewerProps> = ({
  users,
  initialUserIndex = 0,
  visible,
  onClose,
  onStoryView,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // Navigation logic
  const {
    currentUserIndex,
    currentStoryIndex,
    currentUser,
    currentStory,
    totalStories,
    isFirstUser,
    isLastUser,
    goToNextStory,
    goToPrevStory,
    goToUser,
  } = useStoryNavigation({
    users,
    initialUserIndex,
    visible,
    onClose,
  });

  // Navigation for gestures
  const handleNextUser = () => {
    if (!isLastUser) {
      goToUser(currentUserIndex + 1);
    }
  };

  const handlePrevUser = () => {
    if (!isFirstUser) {
      goToUser(currentUserIndex - 1);
    }
  };

  // Timer logic
  const { progress, reset } = useStoryTimer({
    duration: currentStory?.duration || 5000,
    isPaused,
    onComplete: goToNextStory,
  });

  // Gesture logic
  const { panGesture, translateX, translateY } = useStoryGestures({
    onClose,
    onNextUser: handleNextUser,
    onPrevUser: handlePrevUser,
    onPause: () => setIsPaused(true),
    onResume: () => setIsPaused(false),
    canGoNext: !isLastUser,
    canGoPrev: !isFirstUser,
  });

  // Animated styles for gesture
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // Reset timer when story changes
  useEffect(() => {
    if (visible && currentStory) {
      reset();
      setIsPaused(false);
      onStoryView?.(currentUser.id, currentStory.id);
    } else {
      setIsPaused(true);
      reset();
    }
  }, [currentStory?.id, visible]);

  // Pause/resume handlers for tap
  const handlePressIn = () => setIsPaused(true);
  const handlePressOut = () => setIsPaused(false);

  if (!visible || !currentUser || !currentStory) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, animatedStyle]}>
            {/* Progress bars */}
            <View style={styles.progressContainer}>
              <StoryProgress
                totalStories={totalStories}
                currentIndex={currentStoryIndex}
                progress={progress}
              />
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <StoryHeader user={currentUser} onClose={onClose} />
            </View>

            {/* Content */}
            <StoryContent
              story={currentStory}
              onTapLeft={goToPrevStory}
              onTapRight={goToNextStory}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
