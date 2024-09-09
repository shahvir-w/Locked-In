import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Habit from './Habit';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';
import { deleteHabit } from '../backend/FirebaseUtils';

export default function HabitsScrollView({ habits, remainingTasks, date }) {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  
  const router = useRouter();

  const today = new Date().toLocaleDateString('en-CA');
  const isPastDate = date < today;
  let deleteInProgress = false;

  const handleDelete = async (name) => {
    if (deleteInProgress) return;
    deleteInProgress = true;
  
    const user = await AsyncStorage.getItem('userUID');
    const today = new Date().toLocaleDateString('en-CA');
    await deleteHabit(user, name, today);
    deleteInProgress = false;
  }

  const onSwipeValueChange = (swipeData) => {
    if (isPastDate) return;

    const { key, value } = swipeData;

    const swipeThreshold = -Dimensions.get('window').width / 1.75;

    if (value < swipeThreshold) {
        setTimeout(() => {
            handleDelete(key);
        }, 100);
    }
};

  const renderItem = (data) => (
    <Animated.View>
      <TouchableHighlight disabled={isPastDate}
      >
        <View>
          <Habit
            key={data.item.id}
            number={data.item.importance}
            text={data.item.name}
            checked={data.item.isChecked}
            isPastDate={isPastDate}
          />
          
        </View>
      </TouchableHighlight>
    </Animated.View>
  );

  const renderHiddenItem = () => (
    <Animated.View style={styles.rowBack}
    >
        <View style={styles.deleteButton}>
            <Ionicons name="trash" size={26} color="#FFF" />
        </View>
    </Animated.View>
  );

  const ListHeader = () => (
    <View>
      <Text style={[styles.tasksText, {color: activeColors.regular}, isPastDate && styles.viewOnlyText]}>
        {isPastDate
          ? 'VIEW ONLY'
          : remainingTasks > 1
          ? `you have ${remainingTasks} tasks remaining`
          : remainingTasks === 1
          ? `you have ${remainingTasks} task remaining`
          : 'well done! all tasks completed!'}
      </Text>
    </View>
  );

  const ListFooter = () => (
    <View>
      {!isPastDate && (
        <>
          <Text style={styles.deleteText}>swipe left on task to delete</Text>
          <TouchableHighlight
            style={styles.addButton}
            onPress={() => router.push('create-habits')}
            underlayColor="transparent" 
          >
            <Ionicons name="add-circle-sharp" size={60} color="#7C81FC" />
          </TouchableHighlight>
        </>
      )}
    </View>
  );

  return (
    <SwipeListView
      disableRightSwipe={true}
      disableLeftSwipe={isPastDate}
      data={habits
        .sort((a, b) => b.importance - a.importance)
        .map(item => ({ key: item.name, ...item }))}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-Dimensions.get('window').width}
      onSwipeValueChange={onSwipeValueChange}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      useNativeDriver={false}
      contentContainerStyle={styles.items}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
    items: {
        alignItems: 'center',
        marginTop: 20,
    },
    tasksText: {
        fontFamily: 'aldrich',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
    },
    viewOnlyText: {
        color: '#FFD700',
        fontSize: 18,
    },
    deleteText: {
        fontFamily: 'aldrich',
        textAlign: 'center',
        fontSize: 15,
        color: '#808080',
        marginBottom: 5,
    },
    addButton: {
        alignItems: 'center',
        marginBottom: 100,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#781414',
        flexDirection: 'row',
        paddingRight: 15,
        height: 58,
        left: 10,
        width: 313,
        borderRadius: 12,
    },
    deleteButton: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 55,
      height: '100%',
      backgroundColor: '#781414',
      borderRadius: 15,
  },
});
