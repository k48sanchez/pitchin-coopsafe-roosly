/**
 * Color tokens for the (auth) screens only — pulled from the Claude Design
 * prototype export (see claude/design-reference.md, "Visual language"
 * section). Kept separate from constants/theme.ts (which drives the rest
 * of the app's light/dark Colors) so the two don't collide.
 */

export const colors = {
    bg: '#EDEBE4',
    card: '#FFFFFF',
    text: '#22301F',
    muted: '#84937E',
    brand: '#1F6F4A',
    brandLight: '#2F8F5E',
    brandDark: '#153B29',
    warning: '#E4573D',
    success: '#2F9E5B',
    border: 'rgba(34, 48, 31, 0.12)',
  } as const;
  
  export const radii = {
    card: 16,
    input: 12,
    button: 12,
    pill: 999,
  } as const;
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  } as const;
  
  export type AuthThemeColors = typeof colors;