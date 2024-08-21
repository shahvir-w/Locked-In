import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const TabIcons = {
    habits: (props: any) => (
        <FontAwesome6 name="list-check" size={18} {...props} />
    ),
    stats: (props: any) => (
        <Ionicons name="stats-chart-sharp" size={18} {...props} />
    ),
    info: (props: any) => (
        <AntDesign name="infocirlceo" size={18} {...props} />
    ),
};

export const HabitIcons = {
    true: (props: any) => (
        <MaterialCommunityIcons name="checkbox-outline" size={30} color="white" />
    ),
    false: (props: any) => (
        <MaterialCommunityIcons name="checkbox-blank-outline" size={30} color="white" />
    )
}