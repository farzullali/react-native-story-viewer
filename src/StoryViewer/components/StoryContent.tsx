import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { Story } from '../types';
import PreloadImage from './PreloadImage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StoryContentProps {
  story: Story;
  onTapLeft: () => void;
  onTapRight: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const StoryContent: React.FC<StoryContentProps> = ({
  story,
  onTapLeft,
  onTapRight,
  onPressIn,
  onPressOut,
}) => {
  const [imageError, setImageError] = useState(false);

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

      <PreloadImage source={{ uri: story.url }} style={styles.image} />

      {/* Tap zones - invisible overlay */}
      <View style={styles.tapZonesContainer}>
        {/* Left tap zone - previous story */}
        <TouchableOpacity
          style={styles.tapZoneLeft}
          activeOpacity={1}
          onPress={onTapLeft}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
        
        {/* Right tap zone - next story */}
        <TouchableOpacity
          style={styles.tapZoneRight}
          activeOpacity={1}
          onPress={onTapRight}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 100,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
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