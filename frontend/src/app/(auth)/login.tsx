import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AuthTextField } from '../../components/AuthTextField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);
    const { error } = await signIn(email, password);
    if (error) {
      // Supabase returns "Email not confirmed" for unverified accounts —
      // route them back into verification instead of showing a raw error.
      if (error.message.toLowerCase().includes('not confirmed')) {
        router.push({ pathname: '/(auth)/verify-email', params: { email } });
        return;
      }
      setFormError('Incorrect email or password.');
      return;
    }
    // useProtectedRoute will also catch this, but redirecting explicitly
    // avoids a one-frame flash of the wrong screen.
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#EDEBE4]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 px-6 pt-16" keyboardShouldPersistTaps="handled">
        <Text className="mb-1 text-[26px] font-bold text-[#22301F]">Welcome back</Text>
        <Text className="mb-8 text-[15px] text-[#84937E]">Log in to see your dashboard.</Text>

        <AuthTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />
        <AuthTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          placeholder="Your password"
        />

        {formError ? (
          <Text className="mb-4 text-[13px] text-[#E4573D]">{formError}</Text>
        ) : null}

        <View className="mt-2">
          <PrimaryButton label="Log in" onPress={handleSubmit} loading={loading} />
        </View>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-[14px] text-[#84937E]">New here? </Text>
          <Text
            className="text-[14px] font-semibold text-[#1F6F4A]"
            onPress={() => router.replace('/(auth)/signup')}
          >
            Create an account
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
