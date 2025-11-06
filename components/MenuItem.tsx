import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
  } from 'react-native';

type MenuItemProps = {
    href: any;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    isLogout?: boolean;
  };

export const MenuItem = ({ href, icon, label, isLogout = false }: MenuItemProps) => (
    <Link href={href} asChild>
        <TouchableOpacity style={styles.menuItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={24} color={isLogout ? '#C70039' : '#283618'} />
                <Text style={[styles.menuItemText, isLogout && { color: '#C70039' }]}>{label}</Text>
            </View>
            {!isLogout && <Ionicons name="chevron-forward-outline" size={22} color="#A9A9A9" />}
        </TouchableOpacity>
    </Link>
);

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    menuItemText: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },

})
