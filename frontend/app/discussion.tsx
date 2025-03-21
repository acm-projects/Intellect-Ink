import { Text, View, Image, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { textStyles } from "./stylesheets/textStyles";

export default function Discussion() {
      const router = useRouter();

      return (
        <ScrollView style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../assets/images/discussion_bg.png')}
                  style={styles.imagebg}/>
              </View>
        
              <View style={styles.textContainer}>
                <Text style={[textStyles.pageHeader, {right: 100}]}>Discussions</Text>
              </View>

              <View style={styles.boxContainer}>
                <Image
                  source={require('../assets/images/discussion_topicBox.png')}
                  style={styles.boxImage}/>
                <Image
                  source={require('../assets/images/discussion_topicBox.png')}
                  style={styles.boxImage}/>
                <Image
                  source={require('../assets/images/discussion_topicBox.png')}
                  style={styles.boxImage}/>
              </View>
        </ScrollView>
      )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    imagebg: { // Background Image
      resizeMode: 'cover',
      width: '100%',
      height: 680,
      aspectRatio: 0.6317,
    },
    imageContainer: {
      width: '100%',
      marginTop: 350,
    },
    textContainer: {
      marginTop: 50,
      position: 'absolute',
      alignSelf: 'center',
      alignItems: 'center',
    },
    boxContainer: {
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 157,
      gap: 50,
      position: 'absolute',
    },
    boxImage: {
      width: 430,
      height: 140,
      resizeMode: 'contain',
    },
    
});