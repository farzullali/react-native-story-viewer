import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, StatusBar, Dimensions, FlatList } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { StoryViewerProps, StoryUser } from './types';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import { useStoryTimer } from './hooks/useStoryTimer';
import { useStoryScroll } from './hooks/useStoryScroll';
import { useVerticalCloseGesture } from './hooks/useVerticalCloseGesture';
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
    goToNextStory,
    goToPrevStory,
    goToUser,
  } = useStoryNavigation({
    users,
    initialUserIndex,
    visible,
    onClose,
  });

  // Timer logic
  const { progress, reset } = useStoryTimer({
    duration: currentStory?.duration || 5000,
    isPaused,
    onComplete: goToNextStory,
    key: currentStory?.id,
  });

  // FlatList scroll management
  const {
    flatListRef,
    handleScrollBeginDrag,
    handleMomentumScrollEnd,
    handleScrollToIndexFailed,
  } = useStoryScroll({
    currentUserIndex,
    visible,
    onUserChange: goToUser,
    onScrollStart: () => setIsPaused(true),
    onScrollEnd: () => setIsPaused(false),
  });

  // Vertical close gesture
  const { verticalPanGesture, animatedStyle } = useVerticalCloseGesture({
    onClose,
    onPause: () => setIsPaused(true),
    onResume: () => setIsPaused(false),
    visible,
  });

  // Reset timer and trigger view callback when story changes
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

  // Render each user's story page
  const renderUserStory = ({ item: user, index }: { item: StoryUser; index: number }) => {
    const isCurrentUser = index === currentUserIndex;
    const story = user.stories[isCurrentUser ? currentStoryIndex : 0];

    return (
      <View style={styles.userPage}>
        {/* Progress bars */}
        <View style={styles.progressContainer}>
          <StoryProgress
            totalStories={user.stories.length}
            currentIndex={isCurrentUser ? currentStoryIndex : 0}
            progress={isCurrentUser ? progress : 0}
          />
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <StoryHeader user={user} onClose={onClose} />
        </View>

        {/* Content */}
        {story && (
          <StoryContent
            story={story}
            onTapLeft={goToPrevStory}
            onTapRight={goToNextStory}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          />
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        <GestureDetector gesture={verticalPanGesture}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <FlatList
              ref={flatListRef}
              data={users}
              renderItem={renderUserStory}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              onScrollBeginDrag={handleScrollBeginDrag}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              getItemLayout={(data, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              initialScrollIndex={initialUserIndex}
              removeClippedSubviews={false}
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
  userPage: {
    width: SCREEN_WIDTH,
    height: '100%',
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
