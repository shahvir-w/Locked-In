import { View, StyleSheet} from 'react-native';
import { colors } from '@/constants/colors';
import TabBarButton from './TabBarButton';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';

export function TabBar({ state, descriptors, navigation }) {
  const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode]

    const [dimensions, setDimensions] = useState({height: 20, width:100})
    const buttonWidth = dimensions.width / state.routes.length;

    const onTabberLayout = (e) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width,
        });
    }

    const tabPositionX = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: tabPositionX.value}]
        }
    });


    return (
    <View onLayout={onTabberLayout} style={[styles.tabbar, {backgroundColor: activeColors.backgroundSecondary}]}>
        <Animated.View style={[animatedStyle, {
            position: 'absolute',
            backgroundColor: '#7C81FC',
            borderRadius: 30,
            marginHorizontal: 12,
            left: -5,
            height: dimensions.height - 15,
            width: buttonWidth - 15
        }]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {duration: 1500});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,

          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <TabBarButton 
                key={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                isFocused={isFocused}
                routeName={route.name}
                color={ isFocused ? "#fff" : "#222"}
                label={label}
            />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 80,
        paddingVertical: 10,
        borderRadius: 35,
    }
})