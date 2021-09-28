import React, { useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  Alert
} from 'react-native';
import {color} from '../misc/color';
import Screen from '../components/Screen';
import firebase from 'firebase';
import { firebaseConfig } from '../misc/config';
import { MaterialIcons, FontAwesome, Entypo  } from '@expo/vector-icons';

const Registration = ({navigation}) => {
    const [RegInProgress, setRegInProgress] = useState(false);
    const [regForm, setRegForm] = useState({fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    isValidFullName: true,
    isValidEmail: true,
    isValidPassword: true,
    isValidConfirmPassword: true
  });
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
          };
          if(regForm.password === regForm.confirmPassword) {
              setRegInProgress(true);
            try {
              dbRef.add(userDetails).then((res) => {
                setRegInProgress(false);
                Alert.alert("Alert", "Registration Successfull");
                navigation.navigate('Login')
              }) 
            } catch(err) {
              setRegInProgress(false);
              Alert.alert("Alert", "Registration Failed!");
            }
          } else {
            Alert.alert("Alert", "Password and Confirm password should be same.!");
          } 
    }

    const handleValidFullName = (val) => {
      if(val === '') {
        setRegForm({...regForm, isValidFullName: false})
      } else {
        setRegForm({...regForm, isValidFullName: true})
      }
    }

    const handleValidEmail = (val) => {
      if(val === '') {
        setRegForm({...regForm, isValidEmail: false})
      } else {
        setRegForm({...regForm, isValidEmail: true})
      }
    }

    const handleValidPassword = (val) => {
      if(val === '') {
        setRegForm({...regForm, isValidPassword: false})
      } else {
        setRegForm({...regForm, isValidPassword: true})
      }
    }

    const handleValidConfirmPassword = (val) => {
      if(val === '') {
        setRegForm({...regForm, isValidConfirmPassword: false})
      } else {
        setRegForm({...regForm, isValidConfirmPassword: true})
      }
    }

    return (
        <Screen>
            <View style={styles.container}>
            <FontAwesome style={styles.banner} name="user-circle" size={120} color={color} />
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Full Name"
                        underlineColorAndroid='transparent'
                        onChangeText={(fullName) => setRegForm({...regForm, fullName: fullName})}
                        onEndEditing ={(e) => handleValidFullName(e.nativeEvent.text)} 
                         />
                </View>
                {regForm.isValidFullName ? null : <Text style={styles.errMsg}>Please Enter the Full Name.</Text>}
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Email"
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={(email) => setRegForm({...regForm, email: email})}
                        onEndEditing ={(e) => handleValidEmail(e.nativeEvent.text)} 
                         />
                </View>
                {regForm.isValidEmail ? null : <Text style={styles.errMsg}>Please Enter the Email ID.</Text>}
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(password) => setRegForm({...regForm, password: password})}
                        onEndEditing ={(e) => handleValidPassword(e.nativeEvent.text)} 
                         />
                </View>
                {regForm.isValidPassword ? null : <Text style={styles.errMsg}>Please Enter the Password.</Text>}
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputs}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        underlineColorAndroid='transparent'
                        onChangeText={(confirmPassword) => setRegForm({...regForm, confirmPassword: confirmPassword})}
                        onEndEditing ={(e) => handleValidConfirmPassword(e.nativeEvent.text)} 
                         />
                </View>
                {regForm.isValidConfirmPassword ? null : <Text style={styles.errMsg}>Please Enter the Confirm Password.</Text>}
                <TouchableHighlight disabled={regForm.fullName == '' || regForm.email == '' || regForm.password == '' || regForm.confirmPassword == '' ? true : false} style={[styles.buttonContainer, styles.signupButton]} onPress={() => onRegister()}>
                    {RegInProgress ? <ActivityIndicator style={styles.spinner} size={30} color="#ffffff" /> 
                    : <Text style={styles.signupText}>Sign Up</Text>}
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
    banner : {
      marginTop: -80,
      marginBottom: 80
    },
    errMsg: {
      color: 'red',
      marginTop: -20,
      marginBottom: 20
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