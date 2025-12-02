import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StoryViewer } from '../StoryViewer';
import { StoryRenderProps } from '../types';

/**
 * Example: Custom Header
 */
export const CustomHeader = ({ user, onClose }: StoryRenderProps) => {
  return (
    <View style={styles.customHeader}>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userHandle}>@{user.name.toLowerCase()}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Text style={styles.closeText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example: Custom Progress Bar
 */
export const CustomProgress = ({
  totalStories,
  currentStoryIndex,
  progress,
}: StoryRenderProps) => {
  return (
    <View style={styles.customProgress}>
      {Array.from({ length: totalStories }).map((_, index) => (
        <View key={index} style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarInner,
              {
                width:
                  index < currentStoryIndex
                    ? '100%'
                    : index === currentStoryIndex
                    ? `${progress * 100}%`
                    : '0%',
                backgroundColor:
                  index <= currentStoryIndex ? '#00ff00' : '#fff',
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

/**
 * Example: Custom Footer
 */
const CustomFooter = ({ story, user }: StoryRenderProps) => {
  return (
    <View style={styles.customFooter}>
      <Text style={styles.footerText}>Posted by {user.name}</Text>
      <Text style={styles.footerSubtext}>Tap to see more</Text>
    </View>
  );
};

/**
 * Example: Complete Custom Render Item
 */
const CustomRenderItem = ({
  user,
  story,
  currentStoryIndex,
  totalStories,
  progress,
  onClose,
  onNext,
  onPrev,
  onPause,
  onResume,
  index,
}: StoryRenderProps & { index: number }) => {
  return (
    <View style={styles.customItem}>
      {/* Your completely custom layout */}
      <View style={styles.customHeader}>
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <View style={styles.customContent}>
        {/* Custom content rendering */}
        <Text style={styles.storyText}>Story {currentStoryIndex + 1}</Text>
      </View>

      <View style={styles.customControls}>
        <TouchableOpacity onPress={onPrev}>
          <Text style={styles.controlText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPause}>
          <Text style={styles.controlText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext}>
          <Text style={styles.controlText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Usage Examples
 */
export const RenderPropsExample = () => {
  const users = []; // Your users data

  // Example 1: Custom Header only
  return (
    <StoryViewer
      users={users}
      visible={true}
      onClose={() => {}}
      renderHeader={CustomHeader}
    />
  );

  // Example 2: Custom Header + Progress + Footer
  return (
    <StoryViewer
      users={users}
      visible={true}
      onClose={() => {}}
      renderHeader={CustomHeader}
      renderProgress={CustomProgress}
      renderFooter={CustomFooter}
    />
  );

  // Example 3: Inline custom render
  return (
    <StoryViewer
      users={users}
      visible={true}
      onClose={() => {}}
      renderFooter={({ story, user }) => (
        <View style={{ padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Text style={{ color: '#fff' }}>{user.name}'s story</Text>
        </View>
      )}
    />
  );

  // Example 4: Complete custom rendering with renderItem
  return (
    <StoryViewer
      users={users}
      visible={true}
      onClose={() => {}}
      renderItem={CustomRenderItem}
    />
  );

  // Example 5: Custom styles
  return (
    <StoryViewer
      users={users}
      visible={true}
      onClose={() => {}}
      containerStyle={{ backgroundColor: '#1a1a1a' }}
      headerContainerStyle={{ top: 80 }}
      progressContainerStyle={{ paddingHorizontal: 20 }}
      footerContainerStyle={{ bottom: 40 }}
    />
  );
};

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userHandle: {
    color: '#aaa',
    fontSize: 12,
    marginLeft: 8,
  },
  closeBtn: {
    marginLeft: 'auto',
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
  },
  customProgress: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
  },
  progressBarOuter: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderRadius: 2,
  },
  customFooter: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  customItem: {
    flex: 1,
    backgroundColor: '#000',
  },
  customContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyText: {
    color: '#fff',
    fontSize: 24,
  },
  customControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
  },
});
