import { View, Text, StyleSheet } from 'react-native';

export default function FarmerSchedulesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos Recebidos</Text>
      <Text style={styles.subtitle}> veja e gira os agendamentos dos clientes.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'gray', marginTop: 10 },
});