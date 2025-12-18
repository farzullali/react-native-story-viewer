import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

interface PreloadImageProps {
  source: { uri: string };
  style?: any;
  loader?: React.ReactNode;
  height?: number;
  width?: number;
}

export default function PreloadImage({
  source,
  style,
  height,
  width,
  loader,
}: PreloadImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Image.prefetch(source.uri)
      .then(() => {
        if (isMounted) setLoaded(true);
      })
      .catch(() => {
        if (isMounted) setLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, [source.uri]);

  return (
    <View style={styles.container}>
      {!loaded &&
        (loader || (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        ))}

      {loaded && (
        <Image
          source={source}
          style={[style]}
          onLoad={() => setLoaded(true)}
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
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
});
