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

export interface StoryViewerProps {
  users: StoryUser[];
  initialUserIndex?: number;
  visible: boolean;
  onClose: () => void;
  onStoryView?: (userId: string, storyId: string) => void;
}