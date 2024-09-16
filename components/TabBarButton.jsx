import { StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { TabIcons } from '@/constants/icons'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { colors } from '@/constants/colors'
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';

const TabBarButton = ({
    onPress,
    onLongPress,
    isFocused,
    routeName,
    color,
    label
}) => {
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode]

    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, {duration: 350})
    }, [scale, isFocused]);


    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0,9]);
        return {
            transform: [{
                scale: scaleValue
            }],
            top
        }
    })

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1,0])

        return {
            opacity
        }
    });


    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
        >
            <Animated.View style={animatedIconStyle}>
                {TabIcons[routeName]({
                    color: isFocused ? activeColors.regular : activeColors.regular
                })}
            </Animated.View>
            
            <Animated.Text style={[{ color: activeColors.regular, fontSize: 12 }, animatedTextStyle]}>{label}</Animated.Text>
        </Pressable>
    )
}

export default TabBarButton

const styles = StyleSheet.create({
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    }
})