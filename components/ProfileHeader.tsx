import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';

export function ProfileHeader(){
    return(
        <View style={styles.profileHeader}>
            <Image
            source={require('../assets/images/Perfil-Cliente.jpeg')}
            style={styles.profileImage}
            />
            <Text style={styles.profileName}>Samer Halat</Text>
            <Text style={styles.profileJoined}>Membro desde Setembro, 2025</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#283618',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#283618',
        marginTop: 15,
    },
    profileJoined: {
        fontSize: 14,
        color: '#606C38',
        marginTop: 5,
    },
})

