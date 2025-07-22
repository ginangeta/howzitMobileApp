// src/screens/auth/UnifiedAuthScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ImageBackground,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';

export default function UnifiedAuthScreen({ navigation }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('birthday');
    const { userType, setUserType, setUserData } = useLogin();

    // Set default user type only once on mount
    useEffect(() => {
    setUserType('customer');
    }, [setUserType]);

    const handleContinue = () => {
        const userData = { phone, userType };
        if (isRegistering) {
            userData.name = name;
            if (userType === 'celebrity') {
                userData.specialization = specialization;
            }
        }
        setUserData(userData);
        navigation.navigate('OTPVerification');
    };

    return (
        <ImageBackground
            source={require('../../../assets/images/abstract_bg.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <View style={styles.card}>
                <Text style={styles.heading}>{isRegistering ? 'Create your account' : 'Sign in to your account'}</Text>

                <TextInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                />

                {isRegistering && (
                    <>
                        <TextInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
                        <Text style={styles.label}>User Type</Text>
                        <Picker
                            selectedValue={userType}
                            style={styles.picker}
                            onValueChange={(itemValue) => setUserType(itemValue)}
                        >
                            <Picker.Item label="Customer" value="customer" />
                            <Picker.Item label="Celebrity" value="celebrity" />
                        </Picker>

                        {userType === 'celebrity' && (
                            <>
                                <Text style={styles.label}>Specialization</Text>
                                <Picker
                                    selectedValue={specialization}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setSpecialization(itemValue)}
                                >
                                    <Picker.Item label="Birthday" value="birthday" />
                                    <Picker.Item label="Anniversary" value="anniversary" />
                                    <Picker.Item label="Pep Talk" value="pep" />
                                    <Picker.Item label="Motivational Message" value="motivation" />
                                    <Picker.Item label="Roast" value="roast" />
                                    <Picker.Item label="Custom" value="custom" />
                                </Picker>
                            </>
                        )}
                    </>
                )}

                <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.linkText}>
                        Trouble signing in? <Text style={styles.link}>Reset Password</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
                    <Text style={styles.toggleText}>
                        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 18,
        marginBottom: 20,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#fff',
        fontSize: 18,
        marginBottom: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    linkText: {
        marginTop: 12,
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
    },
    link: {
        color: Colors.accentGreen,
        fontWeight: '600',
    },
    toggleText: {
        marginTop: 20,
        textAlign: 'center',
        color: Colors.accentGreen,
        fontWeight: '500',
    },
});
