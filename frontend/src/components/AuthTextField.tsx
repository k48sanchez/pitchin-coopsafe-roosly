import React from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '../constants/authColors';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
};

export function AuthTextField({ label, error, ...inputProps }: Props) {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-[13px] font-medium text-[#22301F]">{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        className={`rounded-xl border bg-white px-4 py-3 text-[15px] text-[#22301F] ${
          error ? 'border-[#E4573D]' : 'border-[#22301F1F]'
        }`}
        autoCapitalize="none"
        autoCorrect={false}
        {...inputProps}
      />
      {error ? <Text className="mt-1 text-[12px] text-[#E4573D]">{error}</Text> : null}
    </View>
  );
}
