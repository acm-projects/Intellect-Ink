import { Text, View, Image, ImageBackground, TouchableOpacity, StyleSheet } from "react-native";
import { textStyles } from "./stylesheets/textStyles";
import { useRouter } from "expo-router";
import Buttons from "./components/buttons";

export default function Index() {
  const router = useRouter();

  return (
        <View style={styles.container}>

          <Image source={require('../assets/images/backgroundWaves.png')}
          style={styles.imagebg}/>

          <Image
              source={require('../assets/images/logoCircled.png')}
              style={styles.image}/>
           
          {/* <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
              <Text style={[textStyles.heading2, { lineHeight: 25 }]}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push("/signup")}>
            <Text style={[textStyles.heading2, { lineHeight: 25 }]}>Sign Up</Text>
          </TouchableOpacity> */}
          
          <Buttons
            title=' Login '
            variant='whiteOutline'
            onPress={() => router.push('/login')}
          />
            <Buttons
            title='Sign up'
            variant='white'
            onPress={() => router.push('/signup')}
          />
        </View>

     
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    backgroundColor: "#9F88AA",
  },
  image: {
    width: 250,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  imagebg: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
    position: 'absolute',
  },
//   button: {
//     backgroundColor: '#D9D9D9',
//     borderRadius: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//     textAlign: 'center',
//     height: 50,
//     width: 200,
//     marginTop: 10,
//     marginBottom: 10,
// },
});