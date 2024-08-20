import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';

export const TabIcons = {
    habits: (props: any) => (
        <FontAwesome6 name="list-check" size={24} {...props} />
    ),
    stats: (props: any) => (
        <Ionicons name="stats-chart-sharp" size={24} {...props} />
    ),
    info: (props: any) => (
        <AntDesign name="infocirlceo" size={24} {...props} />
    ),
};