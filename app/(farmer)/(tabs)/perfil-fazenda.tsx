import { View, Text, StyleSheet } from 'react-native';

export default function FarmProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil da Fazenda</Text>
      <Text style={styles.subtitle}> edite as informações da sua fazenda.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'gray', marginTop: 10 },
});