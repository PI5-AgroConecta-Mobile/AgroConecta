
import {
    Text,
    View,
    StyleSheet
  } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from './ActionButton';

export function QuickActions(){
    return(
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
            <View style={styles.actionsContainer}>
                <ActionButton href="/(farmer)/gerenciar-produto" icon="add-circle-outline" label="Adicionar Produto" />
                <ActionButton href="/(farmer)/(tabs)/agendamentos" icon="eye-outline" label="Ver Agendamentos" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    section: {
        marginTop: 25,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1B5E20',
        marginBottom: 15,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
    },
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
