import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ImageAspectRatio, Story } from '../types';
import PreloadImage from './PreloadImage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryContentProps {
  story: Story;
  onTapLeft: () => void;
  onTapRight: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  imageAspectRatio?: ImageAspectRatio;
}

// Helper function to calculate image height based on aspect ratio
const calculateImageHeight = (
  aspectRatio: ImageAspectRatio,
  width: number,
): number => {
  switch (aspectRatio) {
    case '16:9':
      return (width * 9) / 16;
    case '4:5':
      return (width * 5) / 4;
    case '1:1':
      return width;
    case 'full':
      return SCREEN_HEIGHT;
    default: {
      const parts = aspectRatio.split(':');
      if (parts.length === 2) {
        const widthRatio = parseFloat(parts[0]);
        const heightRatio = parseFloat(parts[1]);
        if (!isNaN(widthRatio) && !isNaN(heightRatio) && widthRatio > 0) {
          return (width * heightRatio) / widthRatio;
        }
      }
      return (width * 5) / 4; // Fallback to 4:5
    }
  }
};

export const StoryContent: React.FC<StoryContentProps> = React.memo(
  ({
    story,
    onTapLeft,
    onTapRight,
    onPressIn,
    onPressOut,
    imageAspectRatio = '4:5',
  }) => {
    const pressStartTime = React.useRef<number>(0);
    const imageHeight = calculateImageHeight(imageAspectRatio, SCREEN_WIDTH);

    const handlePressIn = () => {
      pressStartTime.current = Date.now();
      onPressIn();
    };

    const handlePressOut = () => {
      onPressOut();
    };

    const handleTapLeft = () => {
      const pressDuration = Date.now() - pressStartTime.current;
      // Only navigate if it was a quick tap (less than 200ms)
      if (pressDuration < 200) {
        onTapLeft();
      }
    };

    const handleTapRight = () => {
      const pressDuration = Date.now() - pressStartTime.current;
      // Only navigate if it was a quick tap (less than 200ms)
      if (pressDuration < 200) {
        onTapRight();
      }
    };

    return (
      <View style={styles.container}>
        {/* Image */}
        {/* {!imageError ? (
        <Image
          source={{ uri: story.url }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )} */}

        <PreloadImage
          source={{ uri: story.url }}
          height={imageHeight}
          width={SCREEN_WIDTH}
        />

        {/* Tap zones - invisible overlay */}
        <View style={styles.tapZonesContainer}>
          {/* Left tap zone - previous story */}
          <TouchableOpacity
            style={styles.tapZoneLeft}
            activeOpacity={1}
            onPress={handleTapLeft}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          />

          {/* Right tap zone - next story */}
          <TouchableOpacity
            style={styles.tapZoneRight}
            activeOpacity={1}
            onPress={handleTapRight}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 100,
  },
  image: {
    width: SCREEN_WIDTH,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  tapZonesContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tapZoneLeft: {
    flex: 1,
  },
  tapZoneRight: {
    flex: 2,
  },
});
