import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthTextField } from '../../components/AuthTextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupScreen() {
  const { signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (password.length < 8) errors.password = 'Use at least 8 characters.';
    if (password !== confirmPassword) errors.confirmPassword = "Passwords don't match.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setFormError(null);
    const { error } = await signUp(email, password);
    if (error) {
      setFormError(error.message);
      return;
    }
    router.push({ pathname: '/(auth)/verify-email', params: { email } });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#EDEBE4]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 px-6 pt-16" keyboardShouldPersistTaps="handled">
        <Text className="mb-1 text-[26px] font-bold text-[#22301F]">Create your account</Text>
        <Text className="mb-8 text-[15px] text-[#84937E]">
          Takes about a minute. No bank details needed yet.
        </Text>

        <AuthTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <AuthTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          secureTextEntry
          textContentType="newPassword"
          placeholder="At least 8 characters"
        />
        <AuthTextField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          secureTextEntry
          textContentType="newPassword"
          placeholder="Re-enter your password"
        />

        {formError ? (
          <Text className="mb-4 text-[13px] text-[#E4573D]">{formError}</Text>
        ) : null}

        <View className="mt-2">
          <PrimaryButton label="Continue" onPress={handleSubmit} loading={loading} />
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-[14px] text-[#84937E]">Already have an account? </Text>
          <Text
            className="text-[14px] font-semibold text-[#1F6F4A]"
            onPress={() => router.replace('/(auth)/login')}
          >
            Log in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
