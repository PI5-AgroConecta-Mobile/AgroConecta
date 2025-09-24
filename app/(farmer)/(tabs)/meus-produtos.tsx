import { View, Text, StyleSheet } from 'react-native';

export default function FarmerProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Produtos</Text>
      <Text style={styles.subtitle}>adicione, edite e remova seus produtos.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'gray', marginTop: 10 },
});