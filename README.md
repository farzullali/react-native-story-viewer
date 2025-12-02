# React Native Story Viewer

A fully customizable Instagram-like story viewer component for React Native with gesture support, animations, and flexible rendering options.

## Features

- 📱 Instagram-style story viewer with swipe gestures
- ⏸️ Tap and hold to pause stories
- 🎨 Fully customizable components (header, progress, content, footer)
- 🔄 Horizontal swipe between users
- ⬇️ Vertical swipe to close
- ⚡ Smooth animations with Reanimated 4
- 🎯 TypeScript support
- 📦 Zero external UI dependencies

## Requirements

| Package                      | Version  |
| ---------------------------- | -------- |
| React Native                 | >=0.70.0 |
| React                        | >=18.0.0 |
| react-native-gesture-handler | >=2.0.0  |
| react-native-reanimated      | >=4.0.0  |

### Tested With

- React Native: `0.82.1`
- React: `19.1.1`
- react-native-gesture-handler: `^2.29.1`
- react-native-reanimated: `^4.1.5`
- react-native-worklets: `0.6.1`

### New Architecture

This component is compatible with React Native's New Architecture but does not require it.

## Installation

```bash
# Using npm
npm install react-native-gesture-handler react-native-reanimated

# Using yarn
yarn add react-native-gesture-handler react-native-reanimated

# Using pnpm
pnpm add react-native-gesture-handler react-native-reanimated
```

### iOS Setup

```bash
cd ios && pod install
```

### Babel Configuration

Add Reanimated's babel plugin to your `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin', // Must be last!
  ],
};
```

### Android Setup

Make sure gesture handler is properly set up in `MainActivity.java`:

```java
package com.yourapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle; // Add this
import com.facebook.react.ReactRootView; // Add this

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null); // Add this for gesture handler
  }

  // ... rest of your code
}
```

## Basic Usage

```typescript
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { StoryViewer } from './src/StoryViewer';
import type { StoryUser } from './src/StoryViewer';

export default function App() {
  const [visible, setVisible] = useState(false);

  const users: StoryUser[] = [
    {
      id: '1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar1.jpg',
      stories: [
        {
          id: 's1',
          type: 'image',
          url: 'https://example.com/story1.jpg',
          duration: 5000, // Optional: 5 seconds
        },
        {
          id: 's2',
          type: 'image',
          url: 'https://example.com/story2.jpg',
        },
      ],
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://example.com/avatar2.jpg',
      stories: [
        {
          id: 's3',
          type: 'image',
          url: 'https://example.com/story3.jpg',
        },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show Stories" onPress={() => setVisible(true)} />

      <StoryViewer
        users={users}
        visible={visible}
        onClose={() => setVisible(false)}
        onStoryView={(userId, storyId) => {
          console.log(`Viewed story ${storyId} from user ${userId}`);
        }}
      />
    </View>
  );
}
```

## Props

### StoryViewerProps

| Prop                     | Type                                                       | Required | Default | Description                       |
| ------------------------ | ---------------------------------------------------------- | -------- | ------- | --------------------------------- |
| `users`                  | `StoryUser[]`                                              | Yes      | -       | Array of users with their stories |
| `visible`                | `boolean`                                                  | Yes      | -       | Controls modal visibility         |
| `onClose`                | `() => void`                                               | Yes      | -       | Callback when viewer closes       |
| `initialUserIndex`       | `number`                                                   | No       | `0`     | Index of user to start with       |
| `onStoryView`            | `(userId: string, storyId: string) => void`                | No       | -       | Callback when a story is viewed   |
| `defaultStoryDuration`   | `number`                                                   | No       | `5000`  | Default duration for stories (ms) |
| `renderHeader`           | `(props: StoryRenderProps) => ReactNode`                   | No       | -       | Custom header component           |
| `renderProgress`         | `(props: StoryRenderProps) => ReactNode`                   | No       | -       | Custom progress bar               |
| `renderContent`          | `(props: StoryRenderProps) => ReactNode`                   | No       | -       | Custom story content              |
| `renderFooter`           | `(props: StoryRenderProps) => ReactNode`                   | No       | -       | Custom footer component           |
| `renderItem`             | `(props: StoryRenderProps & {index: number}) => ReactNode` | No       | -       | Complete custom rendering         |
| `containerStyle`         | `ViewStyle`                                                | No       | -       | Style for main container          |
| `progressContainerStyle` | `ViewStyle`                                                | No       | -       | Style for progress container      |
| `headerContainerStyle`   | `ViewStyle`                                                | No       | -       | Style for header container        |
| `footerContainerStyle`   | `ViewStyle`                                                | No       | -       | Style for footer container        |
| `swipeAnimationConfig`   | `SwipeAnimationConfig`                                     | No       | -       | Custom swipe animation config     |

### StoryUser Type

```typescript
interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  stories: Story[];
}
```

### Story Type

```typescript
interface Story {
  id: string;
  type: 'image' | 'video'; // Video support coming soon
  url: string;
  duration?: number; // Duration in milliseconds
}
```

### StoryRenderProps Type

```typescript
interface StoryRenderProps {
  user: StoryUser;
  story: Story;
  currentStoryIndex: number;
  totalStories: number;
  progress: number; // 0 to 1
  isCurrentUser: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPause: () => void;
  onResume: () => void;
}
```

### SwipeAnimationConfig Type

```typescript
type SwipeAnimationType = 'default' | 'fade' | 'scale' | 'cube' | 'custom';

interface SwipeAnimationConfig {
  type?: SwipeAnimationType;
  duration?: number; // Animation duration in milliseconds (default: 250)
  customAnimation?: (
    index: number,
    scrollOffset: number,
    itemWidth: number,
  ) => {
    opacity?: number;
    transform?: Array<{ scale?: number; translateX?: number; rotateY?: string }>;
  };
}
```

## Advanced Usage

### Custom Duration

```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  defaultStoryDuration={3000} // 3 seconds per story
/>
```

### Custom Header

```typescript
import { Text, View, TouchableOpacity } from 'react-native';

const CustomHeader = ({ user, onClose }) => (
  <View style={{ flexDirection: 'row', padding: 16 }}>
    <Text style={{ color: '#fff', fontSize: 18 }}>{user.name}</Text>
    <TouchableOpacity onPress={onClose} style={{ marginLeft: 'auto' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>×</Text>
    </TouchableOpacity>
  </View>
);

<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  renderHeader={CustomHeader}
/>;
```

### Custom Progress Bar

```typescript
const CustomProgress = ({ totalStories, currentStoryIndex, progress }) => (
  <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 16 }}>
    {Array.from({ length: totalStories }).map((_, index) => (
      <View
        key={index}
        style={{
          flex: 1,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: 2,
        }}
      >
        <View
          style={{
            width:
              index < currentStoryIndex
                ? '100%'
                : index === currentStoryIndex
                ? `${progress * 100}%`
                : '0%',
            height: '100%',
            backgroundColor: '#fff',
            borderRadius: 2,
          }}
        />
      </View>
    ))}
  </View>
);

<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  renderProgress={CustomProgress}
/>;
```

### Custom Footer

```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  renderFooter={({ user, story }) => (
    <View style={{ padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <Text style={{ color: '#fff' }}>Posted by {user.name}</Text>
      <Text style={{ color: '#aaa', fontSize: 12 }}>2 hours ago</Text>
    </View>
  )}
/>
```

### Complete Custom Rendering

```typescript
const CustomStoryItem = ({ user, story, onClose, onNext, onPrev, index }) => (
  <View style={{ flex: 1, backgroundColor: '#1a1a1a' }}>
    {/* Your completely custom layout */}
    <Image source={{ uri: story.url }} style={{ flex: 1 }} />
    <View style={{ padding: 20 }}>
      <Text style={{ color: '#fff' }}>{user.name}</Text>
    </View>
  </View>
);

<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  renderItem={CustomStoryItem}
/>;
```

### Custom Styles

```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  containerStyle={{ backgroundColor: '#1a1a1a' }}
  headerContainerStyle={{ top: 80 }}
  progressContainerStyle={{ paddingHorizontal: 20 }}
  footerContainerStyle={{ bottom: 40 }}
/>
```

### Custom Swipe Animations

The library provides built-in swipe animation types and supports custom animations when transitioning between users.

#### Built-in Animation Types

**Default (no animation)**
```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  swipeAnimationConfig={{ type: 'default' }}
/>
```

**Fade Animation**
```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  swipeAnimationConfig={{
    type: 'fade',
    duration: 300,
  }}
/>
```

**Scale Animation**
```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  swipeAnimationConfig={{
    type: 'scale',
    duration: 250,
  }}
/>
```

**Cube Animation** (3D flip effect)
```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  swipeAnimationConfig={{
    type: 'cube',
    duration: 400,
  }}
/>
```

#### Custom Animation

Create your own animation by providing a custom function. **Important:** The custom animation function must be a worklet (add `'worklet';` directive).

```typescript
<StoryViewer
  users={users}
  visible={visible}
  onClose={() => setVisible(false)}
  swipeAnimationConfig={{
    type: 'custom',
    customAnimation: (index, scrollOffset, itemWidth) => {
      'worklet';
      // Calculate the position relative to the current view
      const position = scrollOffset - index * itemWidth;
      const progress = position / itemWidth;

      // Example: Combined fade and scale effect
      const opacity = 1 - Math.abs(progress) * 0.8;
      const scale = 1 - Math.abs(progress) * 0.3;

      return {
        opacity: Math.max(0.2, Math.min(1, opacity)),
        transform: [{ scale: Math.max(0.7, Math.min(1, scale)) }],
      };
    },
  }}
/>
```

**Custom Animation with Rotation**
```typescript
swipeAnimationConfig={{
  type: 'custom',
  customAnimation: (index, scrollOffset, itemWidth) => {
    'worklet';
    const position = scrollOffset - index * itemWidth;
    const progress = position / itemWidth;

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${progress * 45}deg` },
        { scale: 1 - Math.abs(progress) * 0.1 },
      ],
    };
  },
}}
```

## Gestures

| Gesture          | Action                 |
| ---------------- | ---------------------- |
| Tap right side   | Next story             |
| Tap left side    | Previous story         |
| Hold anywhere    | Pause story            |
| Swipe left/right | Navigate between users |
| Swipe down       | Close viewer           |

## Examples

Check out the `src/StoryViewer/examples/` directory for more examples:

- `CustomRenderExample.tsx` - Various customization examples

## Troubleshooting

### Stories not animating

Make sure you've added the Reanimated babel plugin as the **last** plugin in your `babel.config.js`.

### Gestures not working

Ensure `react-native-gesture-handler` is properly installed and configured in your `MainActivity.java` (Android) and `AppDelegate.mm` (iOS).

### TypeScript errors

Make sure you're using TypeScript 4.0 or higher and have `@types/react` and `@types/react-native` installed.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
