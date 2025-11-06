import { Link } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ActionButtonProps = { href: any; icon: React.ComponentProps<typeof Ionicons>['name']; label: string; };
export const ActionButton = ({ href, icon, label }: ActionButtonProps) => (
    <Link href={href} asChild>
        <TouchableOpacity style={styles.actionButton}>
            <Ionicons name={icon} size={28} color="#1B5E20" />
            <Text style={styles.actionButtonText}>{label}</Text>
        </TouchableOpacity>
    </Link>
);
const styles = StyleSheet.create({
    actionButton: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#1B5E20',
        textAlign: 'center',
    },

})

