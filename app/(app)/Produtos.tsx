import { StyleSheet, Text, View } from 'react-native';

export default function ProdutosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Todos os Produtos</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});