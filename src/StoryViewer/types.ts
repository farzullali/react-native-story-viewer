import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface Story {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number; // milliseconds, default 5000
  [key: string]: any; // Allow additional custom properties
}

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  stories: Story[];
  [key: string]: any; // Allow additional custom properties
}

export interface StoryRenderProps {
  user: StoryUser;
  story: Story;
  currentStoryIndex: number;
  totalStories: number;
  progress: number;
  isCurrentUser: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPause: () => void;
  onResume: () => void;
}

export type SwipeAnimationType =
  | 'default'
  | 'fade'
  | 'scale'
  | 'cube'
  | 'custom';

export interface SwipeAnimationConfig {
  type?: SwipeAnimationType;
  duration?: number; // Animation duration in milliseconds (default: 250)
  customAnimation?: (
    index: number,
    scrollOffset: number,
    itemWidth: number,
  ) => Record<string, any>;
}

export type ImageAspectRatio = '16:9' | '4:5' | '1:1' | 'full' | string; // Supports '16:9', '4:5', '1:1', 'full', or custom like '1080:1350' or '9:16'

export interface StoryViewerProps {
  users: StoryUser[];
  initialUserIndex?: number;
  visible: boolean;
  onClose: () => void;
  onStoryView?: (userId: string, storyId: string) => void;

  // Custom render props
  renderHeader?: (props: StoryRenderProps) => ReactNode;
  renderProgress?: (props: StoryRenderProps) => ReactNode;
  renderContent?: (props: StoryRenderProps) => ReactNode;
  renderFooter?: (props: StoryRenderProps) => ReactNode;
  renderItem?: (props: StoryRenderProps & { index: number }) => ReactNode;

  // Style props
  containerStyle?: ViewStyle;
  progressContainerStyle?: ViewStyle;
  headerContainerStyle?: ViewStyle;
  footerContainerStyle?: ViewStyle;

  // Duration settings (in milliseconds)
  defaultStoryDuration?: number; // Default duration for each story (default: 5000ms)

  // Swipe animation configuration
  swipeAnimationConfig?: SwipeAnimationConfig;

  // Image aspect ratio (default: '4:5')
  imageAspectRatio?: ImageAspectRatio;
}
