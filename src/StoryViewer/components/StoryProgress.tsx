import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface StoryProgressProps {
  currentIndex: number;
  totalStories: number;
  progress: number;
}

export const StoryProgress: React.FC<StoryProgressProps> = React.memo(
  ({ currentIndex, totalStories, progress }) => {
    return (
      <View style={styles.container}>
        {Array.from({ length: totalStories }).map((_, index) => (
          <ProgressBar
            key={index}
            index={index}
            currentIndex={currentIndex}
            progress={progress}
          />
        ))}
      </View>
    );
  },
);

interface ProgressBarProps {
  index: number;
  currentIndex: number;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({ index, currentIndex, progress }) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const prevIndexRef = useRef(currentIndex);

    useEffect(() => {
      let targetWidth = 0;

      if (index < currentIndex) {
        targetWidth = 100;
      } else if (index === currentIndex) {
        targetWidth = progress * 100;
      }

      const isMovingForward = currentIndex > prevIndexRef.current;

      if (prevIndexRef.current !== currentIndex) {
        animatedWidth.stopAnimation();
        prevIndexRef.current = currentIndex;
      }

      if (index === currentIndex && isMovingForward) {
        // Reset to 0 on story change, then animate
        if (progress === 0) {
          animatedWidth.setValue(0);
        }
        Animated.timing(animatedWidth, {
          toValue: targetWidth,
          duration: 100,
          useNativeDriver: false,
        }).start();
      } else {
        animatedWidth.setValue(targetWidth);
      }
    }, [index, currentIndex, progress, animatedWidth]);

    return (
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
});
