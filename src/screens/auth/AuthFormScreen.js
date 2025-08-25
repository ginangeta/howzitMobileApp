import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Pressable,
    Switch,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import { useAppTheme } from '../../context/ThemeContext';
import Colors from '../../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Video from 'react-native-video';

// Reusable Phone Number Input with Flag Component
const PhoneNumberInput = ({ value, onChangeText, placeholder, placeholderTextColor, style, textStyle }) => (
    <View style={[styles.inputContainer, style]}>
        {/* Flag and dropdown */}
        <View style={styles.phonePrefix}>
            {/* Assuming you have a Zimbabwean flag asset */}
            <Text style={[textStyle, { marginRight: 8 }]}>🇿🇼</Text>
            <Text style={[textStyle, { color: placeholderTextColor }]}>▼</Text>
        </View>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChangeText}
            style={[styles.phoneTextInput, textStyle]}
            maxLength={15}
        />
    </View>
);

// Reusable Date of Birth Input Component
const DateOfBirthInput = ({ value, onChange, placeholder, placeholderTextColor, style, textStyle }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || value;
        setShowPicker(Platform.OS === 'ios');
        onChange(currentDate);
    };

    const formattedDate = value ? value.toISOString().split('T')[0] : '';

    return (
        <View style={[styles.inputContainer, style]}>
            <Pressable onPress={() => setShowPicker(true)} style={styles.dobPressable}>
                <Text style={[textStyle, { color: formattedDate ? textStyle.color : placeholderTextColor }]}>
                    {formattedDate || placeholder}
                </Text>
                <Text style={[textStyle, { color: placeholderTextColor }]}>▼</Text>
            </Pressable>
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    textColor={textStyle.color}
                />
            )}
        </View>
    );
};

export default function AuthFormScreen({ navigation, route }) {
    const { isRegistering: isInitialRegistering } = route.params;

    const { colors } = useAppTheme();
    const C = colors ?? Colors;

    const [isRegistering, setIsRegistering] = useState(isInitialRegistering);
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState(null);
    const [wantsEmails, setWantsEmails] = useState(true);

    const { setUserData } = useLogin();

    const handleContinue = () => {
        if (!phone.trim()) {
            Alert.alert('Missing Info', 'Please enter your phone number.');
            return;
        }
        if (isRegistering && !username.trim()) {
            Alert.alert('Missing Info', 'Please enter a username.');
            return;
        }
        if (isRegistering && !dob) {
            Alert.alert('Missing Info', 'Please select your date of birth.');
            return;
        }

        const userDataPayload = {
            phone: phone.trim(),
            username: isRegistering ? username.trim() : null,
            dob: isRegistering && dob ? dob.toISOString().split('T')[0] : null,
            wantsEmails,
            isRegistering: isRegistering,
        };

        setUserData(userDataPayload);

        navigation.navigate('OTP', { phone: phone.trim(), isRegistering });
    };

    return (
        <View style={[styles.container, { backgroundColor: C.background }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.formWrapper}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.backButtonText, { color: C.textPrimary }]}>←</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={[styles.formHeader, { color: C.textPrimary }]}>
                        {isRegistering ? 'Signup' : 'Login'}
                    </Text>
                    <Text style={[styles.formSubtitle, { color: C.textSecondary + '99' }]}>
                        {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
                        {' '}
                        <Text
                            style={[styles.linkText, { color: C.primary }]}
                            onPress={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? 'Login' : 'Sign up'}
                        </Text>
                    </Text>
                </View>

                <View style={styles.formCard}>
                    {isRegistering ? (
                        <>
                            <PhoneNumberInput
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Phone number"
                                placeholderTextColor={C.textSecondary + '99'}
                                style={[styles.input, { backgroundColor: C.bubbleBg, color: C.textPrimary }]}
                                textStyle={{ color: C.textPrimary, fontSize: 16 }}
                            />
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor={C.textSecondary + '99'}
                                value={username}
                                onChangeText={setUsername}
                                style={[styles.input, { paddingVertical: 16, backgroundColor: C.bubbleBg, color: C.textPrimary }]}
                            />
                            <DateOfBirthInput
                                value={dob}
                                onChange={setDob}
                                placeholder="Date of birth"
                                placeholderTextColor={C.textSecondary + '99'}
                                style={[styles.input, { backgroundColor: C.bubbleBg, color: C.textPrimary }]}
                                textStyle={{ color: C.textPrimary, fontSize: 16 }}
                            />
                            <View style={styles.emailRow}>
                                <Switch
                                    value={wantsEmails}
                                    onValueChange={setWantsEmails}
                                    trackColor={{ false: '#767577', true: C.primary }}
                                    thumbColor={wantsEmails ? '#fff' : '#fff'}
                                />
                                <Text style={[styles.emailText, { color: C.textPrimary }]}>
                                    Yes, email me offers and information about content creators and events on howzit.
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <PhoneNumberInput
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Phone number"
                                placeholderTextColor={C.textSecondary + '99'}
                                style={[styles.input, { backgroundColor: C.bubbleBg, color: C.textPrimary }]}
                                textStyle={{ color: C.textPrimary, fontSize: 16 }}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={C.textSecondary + '99'}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                style={[styles.input, { paddingVertical: 16, backgroundColor: C.bubbleBg, color: C.textPrimary }]}
                            />
                        </>
                    )}

                    <TouchableOpacity
                        style={[
                            styles.primaryButton,
                            { backgroundColor: C.primary }, // Change button color to blue as per some mockups
                            !phone.trim() && styles.buttonDisabled,
                        ]}
                        onPress={handleContinue}
                        disabled={!phone.trim()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Sign up for free</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                    <Text style={[styles.orText, { color: C.textSecondary + '99' }]}>or</Text>
                    <View style={styles.orLine} />
                </View>

                <TouchableOpacity style={styles.facebookButton} activeOpacity={0.8}>
                    <Image source={require('../../../assets/images/facebook_logo.png')} style={styles.facebookLogo} />
                    <Text style={styles.facebookButtonText}>Sign up with Facebook</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundVideo: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(6, 6, 8, 0.56)',
    },
    formWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        // REMOVED: justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? 36 : 56,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 40 : 60,
        left: 20,
        padding: 10,
        zIndex: 10,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: '700',
    },
    header: {
        marginTop: 80, // ADDED: Margin to push header down
        marginBottom: 24,
        // REMOVED: flex: 1,
        alignItems: 'center', // Keep this to center the text
    },
    formHeader: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    formSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    linkText: {
        fontWeight: '700',
    },
    formCard: {
        paddingTop: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        height: 54, // Fixed height for consistency
    },
    phonePrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    flagIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    phoneTextInput: {
        flex: 1,
        height: '100%',
    },
    dobPressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    input: {
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    emailText: {
        marginLeft: 10,
        flexShrink: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    primaryButton: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.45,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#fff',
        opacity: 0.1,
    },
    orText: {
        marginHorizontal: 10,
        fontSize: 14,
    },
    facebookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 12,
        backgroundColor: '#3b5998',
    },
    facebookLogo: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    facebookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});