import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';

const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Uses Supabase's default confirmation LINK (not an OTP code) — this works
 * out of the box with Supabase's built-in email sender, no SMTP setup
 * required. When the user taps the link in their email, Supabase confirms
 * the email server-side immediately, before any redirect happens — so the
 * app doesn't need to handle the link at all. The user just needs to come
 * back here and log in afterward.
 */
export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { resendVerificationEmail, loading } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResendMessage(null);
    const { error } = await resendVerificationEmail(email);
    if (error) {
      setResendMessage("Couldn't resend right now — try again in a moment.");
      return;
    }
    setResendMessage('Sent! Check your inbox.');
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const timer = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#EDEBE4] px-6 pt-16">
      <Text className="mb-1 text-[26px] font-bold text-[#22301F]">Check your email</Text>
      <Text className="mb-8 text-[15px] leading-5 text-[#84937E]">
        We sent a confirmation link to{' '}
        <Text className="font-semibold text-[#22301F]">{email}</Text>. Tap it, then come
        back here and log in.
      </Text>

      <PrimaryButton label="I've confirmed — log in" onPress={() => router.replace('/(auth)/login')} />

      <View className="mt-6 items-center">
        {resendMessage ? (
          <Text className="mb-2 text-[13px] text-[#84937E]">{resendMessage}</Text>
        ) : null}
        <Text
          className={`text-[14px] font-semibold ${
            cooldown > 0 || loading ? 'text-[#84937E]' : 'text-[#1F6F4A]'
          }`}
          onPress={handleResend}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Didn't get it? Resend"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
