import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StoryUser, StoryViewer } from './src/StoryViewer';

[
  {
    id: '019ba231-fb9e-786c-82a7-cca35c279602',
    name: 'Səbətləriniz Sürətlə Dolsun!',
    coverBlobName: '500x500 veb_20260109_095831_9818bb3d.png',
    items: [
      {
        id: '019bc089-3e4a-7db9-ac96-f6ccbafaecdc',
        title: 'Səbətləriniz Sürətlə Dolsun!',
        coverBlobName: 'ariel 23_20260115_072202_c3f76215.png',
        mainBlobName:
          'https://obafiles.blob.core.windows.net/oba-plus/ariel 23_20260115_072209_ac9d19c3.png',
        link: 'https://oba.az/site/assets/files/3186/endirim-jurnali.pdf',
        isSeen: false,
        seenAt: null,
      },
      {
        id: '019bc56d-8c02-70a0-a7a5-a311d9b7499e',
        title: 'Səbətləriniz Sürətlə Dolsun!',
        coverBlobName: 'nescafe_20260116_060935_7d903e9b.png',
        mainBlobName:
          'https://obafiles.blob.core.windows.net/oba-plus/nescafe_20260116_060935_90efac42.png',
        link: 'https://oba.az/site/assets/files/3186/endirim-jurnali.pdf',
        isSeen: false,
        seenAt: null,
      },
      {
        id: '019bc5ae-bdd0-7abf-bbdd-cbb5b9b320c7',
        title: 'Səbətləriniz Sürətlə Dolsun!',
        coverBlobName: 'tamdad sosis_20260116_071947_f7f760bc.png',
        mainBlobName:
          'https://obafiles.blob.core.windows.net/oba-plus/tamdad sosis_20260116_072000_4e882210.png',
        link: 'https://oba.az/site/assets/files/3186/endirim-jurnali.pdf',
        isSeen: false,
        seenAt: null,
      },
    ],
  },
];

const DUMMY_USERS: StoryUser[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    customUserProp: 'User level custom data', // Example custom property at user level
    stories: [
      {
        id: 'as23231cd',
        type: 'image',
        url: 'https://obafiles.blob.core.windows.net/oba-plus/nescafe_20260116_060935_90efac42.png',
        duration: 15000,
        test: 'Custom test property', // Example custom property
        customData: { foo: 'bar', value: 123 }, // Example nested custom data
      },
      {
        id: 'as23231cd12',
        type: 'image',
        url: 'https://obafiles.blob.core.windows.net/oba-plus/ariel 23_20260115_072209_ac9d19c3.png',
        duration: 15000,
        test: 'Another test value',
      },
      {
        id: 'as23231cd2',
        type: 'image',
        url: 'https://obafiles.blob.core.windows.net/oba-plus/tamdad sosis_20260116_072000_4e882210.png',
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
        imageAspectRatio="1080:1350"
        swipeAnimationConfig={{
          type: 'default',
        }}
        // Example: Custom footer to demonstrate accessing custom props
        renderFooter={({ story, user }) => {
          // Access custom properties from story and user objects
          const testProp = story.test;
          const customData = story.customData;
          const userCustomProp = user.customUserProp;

          // Only render if custom props exist
          if (!testProp && !customData && !userCustomProp) {
            return null;
          }

          return (
            <View style={styles.customFooter}>
              {testProp && (
                <Text style={styles.customText}>Test: {testProp}</Text>
              )}
              {customData && (
                <Text style={styles.customText}>
                  Custom Data: {JSON.stringify(customData)}
                </Text>
              )}
              {userCustomProp && (
                <Text style={styles.customText}>User: {userCustomProp}</Text>
              )}
            </View>
          );
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
  customFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  customText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 3,
  },
});
