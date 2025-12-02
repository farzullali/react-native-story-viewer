import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { AnimatedStoryItem } from './components/AnimatedStoryItem';
import { StoryContent } from './components/StoryContent';
import { StoryHeader } from './components/StoryHeader';
import { StoryProgress } from './components/StoryProgress';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import { useStoryScroll } from './hooks/useStoryScroll';
import { useStoryTimer } from './hooks/useStoryTimer';
import { useVerticalCloseGesture } from './hooks/useVerticalCloseGesture';
import { StoryUser, StoryViewerProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StoryViewer: React.FC<StoryViewerProps> = ({
  users,
  initialUserIndex = 0,
  visible,
  onClose,
  onStoryView,
  renderHeader,
  renderProgress,
  renderContent,
  renderFooter,
  renderItem,
  containerStyle,
  progressContainerStyle,
  headerContainerStyle,
  footerContainerStyle,
  defaultStoryDuration = 5000,
  swipeAnimationConfig,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollOffset = useSharedValue(0);

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
    duration: currentStory?.duration || defaultStoryDuration,
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

  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
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
  const handlePressIn = useCallback(() => setIsPaused(true), []);
  const handlePressOut = useCallback(() => setIsPaused(false), []);

  // Render each user's story page
  const renderUserStory = useCallback(
    ({ item: user, index }: { item: StoryUser; index: number }) => {
      const isCurrentUser = index === currentUserIndex;
      const story = user.stories[isCurrentUser ? currentStoryIndex : 0];

      if (!story) return null;

      const renderProps = {
        user,
        story,
        currentStoryIndex: isCurrentUser ? currentStoryIndex : 0,
        totalStories: user.stories.length,
        progress: isCurrentUser ? progress : 0,
        isCurrentUser,
        onClose,
        onNext: goToNextStory,
        onPrev: goToPrevStory,
        onPause: handlePressIn,
        onResume: handlePressOut,
      };

      const content = (
        <>
          {!renderItem && (
            <>
              {/* Progress bars */}
              <View style={[styles.progressContainer, progressContainerStyle]}>
                {renderProgress ? (
                  renderProgress(renderProps)
                ) : (
                  <StoryProgress
                    totalStories={user.stories.length}
                    currentIndex={isCurrentUser ? currentStoryIndex : 0}
                    progress={isCurrentUser ? progress : 0}
                  />
                )}
              </View>

              {/* Header */}
              <View style={[styles.headerContainer, headerContainerStyle]}>
                {renderHeader ? (
                  renderHeader(renderProps)
                ) : (
                  <StoryHeader user={user} onClose={onClose} />
                )}
              </View>

              {/* Content */}
              {renderContent ? (
                renderContent(renderProps)
              ) : (
                <StoryContent
                  story={story}
                  onTapLeft={goToPrevStory}
                  onTapRight={goToNextStory}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                />
              )}

              {/* Footer */}
              {renderFooter && (
                <View style={[styles.footerContainer, footerContainerStyle]}>
                  {renderFooter(renderProps)}
                </View>
              )}
            </>
          )}
          {renderItem && renderItem({ ...renderProps, index })}
        </>
      );

      return (
        <AnimatedStoryItem
          index={index}
          scrollOffset={scrollOffset}
          animationConfig={swipeAnimationConfig}
          width={SCREEN_WIDTH}
        >
          {content}
        </AnimatedStoryItem>
      );
    },
    [
      currentUserIndex,
      currentStoryIndex,
      progress,
      onClose,
      goToPrevStory,
      goToNextStory,
      handlePressIn,
      handlePressOut,
      renderItem,
      renderHeader,
      renderProgress,
      renderContent,
      renderFooter,
      progressContainerStyle,
      headerContainerStyle,
      footerContainerStyle,
      swipeAnimationConfig,
      scrollOffset,
    ],
  );

  if (!visible || !currentUser || !currentStory) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <GestureDetector gesture={verticalPanGesture}>
          <Animated.View
            style={[styles.container, containerStyle, animatedStyle]}
          >
            <Animated.FlatList
              ref={flatListRef}
              data={users}
              renderItem={renderUserStory}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              onScrollBeginDrag={handleScrollBeginDrag}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              getItemLayout={(_data, index) => ({
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
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
