import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';

export default function EscolhaScreen() {
  return (
    <View style={styles.container}>
      <Link href="/loginAgricultor" asChild style={styles.panel}>
        <TouchableOpacity style={styles.panelLeft}>
          <View style={styles.overlayLeft} />
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/simbolo-agricultor.png')}
              style={styles.icon}
            />
            <Text style={styles.textLeft}>QUERO VENDER</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <Link href="/loginCliente" asChild style={styles.panel}>
        <TouchableOpacity style={styles.panelRight}>
          <View style={styles.overlayRight} />
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/simbolo-cliente.png')}
              style={styles.icon}
            />
            <Text style={styles.textRight}>QUERO COMPRAR</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

// Estilos inspirados no seu projeto web e protótipos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  panel: {
    flex: 1,
  },
  panelLeft: {
    flex: 1,
    backgroundColor: '#FEFAE0', // Cor de fundo do agricultor
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelRight: {
    flex: 1,
    backgroundColor: '#283618', // Cor de fundo do cliente
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayLeft: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(254, 250, 224, 0.1)',
  },
  overlayRight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40, 54, 24, 0.3)',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  textLeft: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#283618',
  },
  textRight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEFAE0',
  },
});