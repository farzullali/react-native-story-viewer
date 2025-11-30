import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { StoryUser } from '../types';

interface UseStoryNavigationProps {
  users: StoryUser[];
  initialUserIndex: number;
  visible: boolean;
  onClose: () => void;
}

export const useStoryNavigation = ({
  users,
  initialUserIndex,
  visible,
  onClose,
}: UseStoryNavigationProps) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // ✅ FIX: Use refs to hold current values without causing re-renders
  const currentUserIndexRef = useRef(currentUserIndex);
  const currentStoryIndexRef = useRef(currentStoryIndex);

  // Keep refs synced
  useEffect(() => {
    currentUserIndexRef.current = currentUserIndex;
    currentStoryIndexRef.current = currentStoryIndex;
  }, [currentUserIndex, currentStoryIndex]);

  // Reset when modal becomes visible or initialUserIndex changes
  const prevInitialUserIndex = useRef(initialUserIndex);
  const prevVisible = useRef(visible);

  useEffect(() => {
    // Reset to initialUserIndex when:
    // 1. initialUserIndex changes
    // 2. Modal becomes visible (transitions from false to true)
    const shouldReset =
      prevInitialUserIndex.current !== initialUserIndex ||
      (!prevVisible.current && visible);

    if (shouldReset) {
      setCurrentUserIndex(initialUserIndex);
      currentUserIndexRef.current = initialUserIndex;
      setCurrentStoryIndex(0);
      currentStoryIndexRef.current = 0;
      prevInitialUserIndex.current = initialUserIndex;
    }

    prevVisible.current = visible;
  }, [initialUserIndex, visible]);

  const currentUser = useMemo(
    () => users[currentUserIndex],
    [users, currentUserIndex],
  );

  const currentStory = useMemo(
    () => currentUser?.stories[currentStoryIndex],
    [currentUser, currentStoryIndex],
  );

  const totalStories = useMemo(
    () => currentUser?.stories.length || 0,
    [currentUser],
  );

  // ✅ FIX: Stable callbacks using refs - dependencies don't change
  const goToNextStory = useCallback(() => {
    const userIndex = currentUserIndexRef.current;
    const storyIndex = currentStoryIndexRef.current;
    const user = users[userIndex];
    const storiesCount = user?.stories.length || 0;

    if (storyIndex < storiesCount - 1) {
      // Next story in same user
      setCurrentStoryIndex(storyIndex + 1);
    } else if (userIndex < users.length - 1) {
      // Next user, first story
      setCurrentUserIndex(userIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      // End of all stories
      onClose();
    }
  }, [users, onClose]);

  const goToPrevStory = useCallback(() => {
    const userIndex = currentUserIndexRef.current;
    const storyIndex = currentStoryIndexRef.current;

    if (storyIndex > 0) {
      // Previous story in same user
      setCurrentStoryIndex(storyIndex - 1);
    } else if (userIndex > 0) {
      // Previous user, last story
      const prevUser = users[userIndex - 1];
      setCurrentUserIndex(userIndex - 1);
      setCurrentStoryIndex(prevUser.stories.length - 1);
    }
  }, [users]);

  const goToUser = useCallback((userIndex: number) => {
    setCurrentUserIndex(userIndex);
    setCurrentStoryIndex(0);
  }, []);

  return {
    currentUserIndex,
    currentStoryIndex,
    currentUser,
    currentStory,
    totalStories,
    isFirstUser: currentUserIndex === 0,
    isLastUser: currentUserIndex === users.length - 1,
    goToNextStory,
    goToPrevStory,
    goToUser,
  };
};
