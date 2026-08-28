import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

/**
 * Renders `length` single-character boxes but is backed by one hidden-ish
 * logical value — simpler and less state-juggling than `length` fully
 * independent inputs, while still giving the expected "boxes" look.
 */
export function OtpInput({ length = 6, value, onChange, error = false }: Props) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  return (
    <View className="mb-2">
      <View className="flex-row justify-between">
        {digits.map((digit, i) => (
          <View
            key={i}
            className={`h-14 w-12 items-center justify-center rounded-xl border bg-white ${
              error
                ? 'border-[#E4573D]'
                : value.length === i
                ? 'border-[#1F6F4A]'
                : 'border-[#22301F1F]'
            }`}
          >
            <TextInput
              editable={false}
              value={digit.trim()}
              className="text-center text-[20px] font-semibold text-[#22301F]"
              pointerEvents="none"
            />
          </View>
        ))}
      </View>
      {/* Invisible input capturing real keystrokes; boxes above are pure display */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/[^0-9]/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        className="absolute h-14 w-full opacity-0"
      />
    </View>
  );
}
