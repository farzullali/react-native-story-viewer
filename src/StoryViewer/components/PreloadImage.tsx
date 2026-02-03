import React, { useEffect, useRef, useState } from 'react';
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
  const isMountedRef = useRef(true);
  const onLoadingChangeRef = useRef(onLoadingChange);

  // Update the ref whenever onLoadingChange changes
  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
  }, [onLoadingChange]);

  useEffect(() => {
    isMountedRef.current = true;

    // Reset states first
    setPrefetched(false);
    setImageRendered(false);

    // Notify parent that loading has started
    onLoadingChangeRef.current?.(true);

    Image.prefetch(source.uri)
      .then(() => {
        if (isMountedRef.current) {
          setPrefetched(true);
          setImageRendered(true);
          onLoadingChangeRef.current?.(false);
        }
      })
      .catch(() => {
        // On error, still mark as complete to prevent infinite loading
        if (isMountedRef.current) {
          setPrefetched(true);
          setImageRendered(true);
          onLoadingChangeRef.current?.(false);
        }
      });

    return () => {
      isMountedRef.current = false;
    };
  }, [source.uri]);

  // Handle Image.onLoad callback (for non-cached images)
  const handleImageLoad = () => {
    if (isMountedRef.current && !imageRendered) {
      setImageRendered(true);
      // No need to call onLoadingChange(false) here as it's already called in prefetch
    }
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
