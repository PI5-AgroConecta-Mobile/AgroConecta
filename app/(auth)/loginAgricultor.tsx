import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function LoginAgricultor() {
  const router = useRouter();

  const handleLogin = () => {
    // Depois do login bem-sucedido, manda para as tabs
    router.push("/(app)/(tabs)");
  };

  return (
    <View>
      <Text>Login Agricultor</Text>
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
