import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

export default function EscolhaScreen() {
  return (
    <View style={styles.container}>
      {/* Painel para Vender */}
      <Link href="/loginAgricultor" asChild style={styles.panel}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/simbolo-agricultor.png')}
            style={styles.icon}
          />
          <Text style={styles.textVender}>QUERO VENDER</Text>
        </TouchableOpacity>
      </Link>

      {/* Painel para Comprar */}
      <Link href="/loginCliente" asChild style={styles.panel}>
        <TouchableOpacity style={styles.panelComprar}>
          <Image
            source={require('../../assets/images/simbolo-cliente.png')}
            style={styles.icon}
          />
          <Text style={styles.textComprar}>QUERO COMPRAR</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FEFAE0',
  },
  panel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelComprar: {
    flex: 1,
    width: '100%',
    backgroundColor: '#283618',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textVender: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283618',
  },
  textComprar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEFAE0',
  },
});