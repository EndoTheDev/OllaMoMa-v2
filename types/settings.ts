export const themeColorMap = {
	red: 'red',
	blue: 'blue',
	green: 'green',
	yellow: 'yellow',
	purple: 'purple',
	pink: 'pink',
	indigo: 'indigo',
} as const;

export const neutralColorMap = {
	slate: 'slate',
	gray: 'gray',
	zinc: 'zinc',
	neutral: 'neutral',
	stone: 'stone',
} as const;

export const radiusMap = {
	none: '0',
	xs: '0.125',
	sm: '0.25',
	md: '0.375',
	lg: '0.5',
} as const;

export interface ThemeColors {
	primary: string;
	neutral: string;
	error: string;
	warning: string;
	success: string;
	info: string;
	secondary: string;
}

export interface SettingsState {
	sidebarOpen: boolean;
	colorMode: 'light' | 'dark';
	theme: keyof typeof themeColorMap;
	neutral: keyof typeof neutralColorMap;
	radius: keyof typeof radiusMap;
	ollamaHost: string;
	ollamaPort: number;
}

export type ThemeOption = keyof typeof themeColorMap;
export type NeutralOption = keyof typeof neutralColorMap;
export type RadiusOption = keyof typeof radiusMap;
