import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#EDEBE4] px-6">
      <View className="flex-1 justify-center">
        <Text className="mb-2 text-[34px] font-bold text-[#22301F]">
          Keep what you love.{'\n'}Spend less doing it.
        </Text>
        <Text className="text-[16px] leading-6 text-[#84937E]">
          We find the split, the free trial, or the free alternative — so your
          subscriptions fit your budget without you giving anything up.
        </Text>
      </View>

      <View className="mb-8 gap-3">
        <PrimaryButton label="Create account" onPress={() => router.push('/(auth)/signup')} />
        <PrimaryButton
          label="I already have an account"
          variant="ghost"
          onPress={() => router.push('/(auth)/login')}
        />
      </View>
    </SafeAreaView>
  );
}
