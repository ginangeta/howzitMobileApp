import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    Pressable,
    Alert,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import { useAppTheme } from '../../context/ThemeContext';
import Colors from '../../constants/Colors';
import Video from 'react-native-video';

export default function OTPScreen({ navigation, route }) {
    const { phone, isRegistering } = route.params;

    const { colors } = useAppTheme();
    const C = colors ?? Colors;

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setIsLoggedIn } = useLogin();

    const handleVerifyOTP = () => {
        if (!otp.trim() || otp.trim().length < 6) {
            Alert.alert('Missing OTP', 'Please enter the 6-digit code.');
            return;
        }

        setIsSubmitting(true);
        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert('Success', 'OTP Verified Successfully!');
            // setIsLoggedIn(true); // Assuming successful verification logs the user in

            // Always navigate to UserTypeSelection after successful OTP verification
            navigation.replace('UserTypeSelection');
        }, 900);
    };

    // OTP digit boxes helper
    const renderOtpBoxes = () => {
        const digits = otp.split('');
        const boxes = [];
        for (let i = 0; i < 6; i += 1) {
            boxes.push(
                <View key={i} style={[styles.otpBox, { backgroundColor: C.bubbleBg }]}> {/* Updated background */}
                    <Text style={[styles.otpBoxText, { color: C.textPrimary }]}>{digits[i] ?? ''}</Text>
                </View>
            );
        }
        return boxes;
    };

    return (
        <View style={[styles.container, { backgroundColor: C.background }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.contentWrapper}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.backButtonText, { color: C.textPrimary }]}>←</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={[styles.title, { color: C.textPrimary }]}>Verification code</Text>
                    <Text style={[styles.subtitle, { color: C.textSecondary + 'AA' }]}>
                        Check your SMS messages. We've sent a 6-digit PIN to {phone}.
                    </Text>
                </View>

                <View style={styles.otpForm}>
                    <Pressable style={styles.otpRow}>
                        {renderOtpBoxes()}
                    </Pressable>

                    <TextInput
                        value={otp}
                        onChangeText={(t) => {
                            const digitsOnly = t.replace(/\D/g, '').slice(0, 6);
                            setOtp(digitsOnly);
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        style={styles.hiddenOtpInput}
                        caretHidden
                        autoFocus
                    />

                    <TouchableOpacity
                        style={[styles.verifyBtn, { backgroundColor: C.primary }]}
                        onPress={handleVerifyOTP}
                        disabled={isSubmitting}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.verifyBtnText}>{isSubmitting ? 'Verifying...' : 'Verify'}</Text>
                    </TouchableOpacity>

                    <View style={styles.resendRow}>
                        <Text style={[styles.resendText, { color: C.textSecondary + '88' }]}>
                            Didn't receive the code?
                        </Text>
                        <TouchableOpacity onPress={() => { /* TODO: trigger resend */ }} activeOpacity={0.7}>
                            <Text style={[styles.resendAction, { color: '#FF7A00' }]}> Resend</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
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
        marginTop: 80, // Matches AuthFormScreen header margin
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 32, // Matches AuthFormScreen header font size
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    otpForm: {
        flex: 1,
        alignItems: 'center',
        // No explicit background or padding here, letting elements float as in AuthFormScreen
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 30,
    },
    otpBox: {
        width: 48,
        height: 60,
        borderRadius: 12,
        // Removed borderWidth and borderColor
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpBoxText: {
        fontSize: 24,
        fontWeight: '700',
    },
    hiddenOtpInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        left: -9999,
    },
    verifyBtn: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    verifyBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    resendRow: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 13,
    },
    resendAction: {
        fontSize: 13,
        fontWeight: '700',
    },
});