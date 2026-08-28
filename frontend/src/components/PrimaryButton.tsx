import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { colors } from '../constants/authColors';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'ghost';
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid',
}: Props) {
  const isDisabled = disabled || loading;
  const isSolid = variant === 'solid';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center justify-center rounded-xl py-3.5 ${
        isSolid ? 'bg-[#1F6F4A]' : 'bg-transparent'
      } ${isDisabled ? 'opacity-50' : ''}`}
      style={({ pressed }) => [
        isSolid && pressed ? { backgroundColor: colors.brandDark } : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? '#FFFFFF' : colors.brand} />
      ) : (
        <Text
          className={`text-[15px] font-semibold ${
            isSolid ? 'text-white' : 'text-[#1F6F4A]'
          }`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
