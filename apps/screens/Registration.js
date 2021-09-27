import React, { useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Alert
} from 'react-native';
import Screen from '../components/Screen';
import firebase from 'firebase';
import { firebaseConfig } from '../misc/config';


const Registration = ({navigation}) => {
    const [regForm, setRegForm] = useState({fullName: '', email: '', password: '', confirmPassword: ''});
    let dbRef = firebase.firestore().collection('users');

    useEffect(() => {
      // Initialize Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
     }else {
        firebase.app(); // if already initialized, use that one
     } 
    }, []);

    const onRegister = async () => {
        const userDetails = {
            fullName: regForm.fullName,
            email: regForm.email,
            password: regForm.password
          }
          try {
            dbRef.add(userDetails).then((res) => {
              Alert.alert("Alert", "Registration Successfull");
              navigation.navigate('Login')
            }) 
          } catch(err) {
            Alert.alert("Alert", "Registration Failed!");
          }
    }

    return (
        <Screen>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Full Name"
                        underlineColorAndroid='transparent'
                        onChangeText={(fullName) => setRegForm({...regForm, fullName: fullName})} 
                         />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Email"
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={(email) => setRegForm({...regForm, email: email})} 
                         />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => setRegForm({...regForm, password: password})} 
                         />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(confirmPassword) => setRegForm({...regForm, confirmPassword: confirmPassword})} 
                         />
                </View>
                <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => onRegister()}>
                    <Text style={styles.signupText}>Sign Up</Text>
                </TouchableHighlight>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:300,
        height:50,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height:50,
        marginLeft:-50,
        textAlign: 'center',
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    
    buttonContainer: {
      height:50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      marginBottom:20,
      width:300,
      borderRadius:30,
    },
    signupButton: {
      backgroundColor: "#00b5ec",
    },
    signupText: {
      color: 'white',
    }
  });
  
  
  export default Registration;