import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

interface StoryProgressProps {
  currentIndex: number;
  totalStories: number;
  progress: number;
}

export const StoryProgress: React.FC<StoryProgressProps> = ({
  currentIndex,
  totalStories,
  progress,
}) => {
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
};

interface ProgressBarProps {
  index: number;
  currentIndex: number;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  index,
  currentIndex,
  progress,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const seen = useRef(100);
  const unseen = useRef(0);

  // TODO: Optimize this hook, because it is checking the index and currentIndex on every render. if u can
  useEffect(() => {
    let targetWidth = 0;
    if (index < currentIndex) {
      // console.log(`${index} < ${currentIndex}`);
      targetWidth = 100; // Completed
      animatedWidth.setValue(seen.current);
    } else if (index === currentIndex) {
      targetWidth = progress * 100; // Current
    } else {
      targetWidth = 0; // Not started
      animatedWidth.setValue(unseen.current);
    }

    Animated.timing(animatedWidth, {
      toValue: targetWidth,
      duration: 100,
      useNativeDriver: false, // Width animation requires false
    }).start();
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
};

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
