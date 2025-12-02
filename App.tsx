import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StoryUser, StoryViewer } from './src/StoryViewer';

const DUMMY_USERS: StoryUser[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    stories: [
      {
        id: 'as23231cd',
        type: 'image',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfFhlQEw6PSx3BF6SapgxqFZsxLB0HUyk5pg&s',
        duration: 15000,
      },
      {
        id: 'as23231cd12',
        type: 'image',
        url: 'https://img.freepik.com/free-psd/number-illustration-isolated_23-2151463626.jpg?semt=ais_hybrid&w=740&q=80',
        duration: 15000,
      },
      {
        id: 'as23231cd2',
        type: 'image',
        url: 'https://img.freepik.com/free-psd/number-illustration-isolated_23-2151463628.jpg',
        duration: 15000,
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    stories: [
      {
        id: 'as23231cd3',
        type: 'image',
        url: 'https://picsum.photos/1080/1920?random=4',
        duration: 15000,
      },
      {
        id: 'as23231cd4',
        type: 'image',
        url: 'https://picsum.photos/1080/1920?random=5',
        duration: 15000,
      },
    ],
  },
  {
    id: '3',
    name: 'Bob Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    stories: [
      {
        id: 'as23231cd5',
        type: 'image',
        url: 'https://picsum.photos/1080/1920?random=6',
        duration: 5000,
      },
      {
        id: 'as23231cd6',
        type: 'image',
        url: 'https://picsum.photos/1080/1920?random=7',
        duration: 5000,
      },
      {
        id: 'as23231cd7',
        type: 'image',
        url: 'https://picsum.photos/1080/1920?random=8',
        duration: 5000,
      },
      {
        id: 'as23231cd8',
        type: 'image',
        url: 'https://picsum.photos/1080/1920?random=9',
        duration: 5000,
      },
    ],
  },
];

export default function App() {
  const [visible, setVisible] = useState(false);
  const [initialUserIndex, setInitialUserIndex] = useState(0);

  const openStories = (userIndex: number) => {
    setInitialUserIndex(userIndex);
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Story Viewer Package Demo</Text>

      {DUMMY_USERS.map((user, index) => (
        <TouchableOpacity
          key={user.id}
          style={styles.button}
          onPress={() => openStories(index)}
        >
          <Text style={styles.buttonText}>
            Open {user.name}'s Stories ({user.stories.length} stories)
          </Text>
        </TouchableOpacity>
      ))}

      {/* {visible && ( */}
      <StoryViewer
        users={DUMMY_USERS}
        initialUserIndex={initialUserIndex}
        visible={visible}
        onClose={() => setVisible(false)}
        onStoryView={(userId, storyId) => {
          console.log(`Viewing story ${storyId} from user ${userId}`);
        }}
      />
      {/* )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
