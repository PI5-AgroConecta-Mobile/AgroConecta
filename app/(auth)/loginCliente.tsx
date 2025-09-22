import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function LoginCliente() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/(app)/(tabs)"); // vai para a home das tabs
  };

  return (
    <View>
      <Text>Login Cliente</Text>
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
