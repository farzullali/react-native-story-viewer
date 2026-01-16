import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

interface PreloadImageProps {
  source: { uri: string };
  style?: any;
  loader?: React.ReactNode;
  height?: number;
  width?: number;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function PreloadImage({
  source,
  style,
  height,
  width,
  loader,
  onLoadingChange,
}: PreloadImageProps) {
  const [prefetched, setPrefetched] = useState(false);
  const [imageRendered, setImageRendered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Notify parent that loading has started
    onLoadingChange?.(true);
    setPrefetched(false);
    setImageRendered(false);

    Image.prefetch(source.uri)
      .then(() => {
        if (isMounted) {
          setPrefetched(true);
          // Don't notify parent yet - wait for actual render
        }
      })
      .catch(() => {
        if (isMounted) {
          setPrefetched(true);
          // On error, still try to show the image
        }
      });

    return () => {
      isMounted = false;
    };
  }, [source.uri, onLoadingChange]);

  const handleImageLoad = () => {
    setImageRendered(true);
    onLoadingChange?.(false);
  };

  return (
    <View style={styles.container}>
      {/* Show loader while either prefetching or rendering */}
      {(!prefetched || !imageRendered) &&
        (loader || (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ))}

      {/* Always render image once prefetched, but keep loader until it's actually rendered */}
      {prefetched && (
        <Image
          source={source}
          style={[style, { opacity: imageRendered ? 1 : 0 }]}
          onLoad={handleImageLoad}
          width={width}
          height={height}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
});
