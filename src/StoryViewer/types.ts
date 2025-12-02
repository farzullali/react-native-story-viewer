import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface Story {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration?: number; // milliseconds, default 5000
}

export interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  stories: Story[];
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
}