import React, { useEffect, useState } from "react";
import { Image, View, ActivityIndicator, StyleSheet } from "react-native";

interface PreloadImageProps {
  source: { uri: string };
  style?: any;
  loader?: React.ReactNode;
}

export default function PreloadImage({ source, style, loader }: PreloadImageProps) {
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
    <View style={style}>
      {!loaded && (
        loader || (
          <View style={styles.loader}>
            <ActivityIndicator />
          </View>
        )
      )}

      {loaded && (
        <Image
          source={source}
          style={[StyleSheet.absoluteFill, style]}
          onLoad={() => setLoaded(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
