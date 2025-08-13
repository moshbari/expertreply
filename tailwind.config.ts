import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--outline))',
				input: 'hsl(var(--outline))',
				ring: 'hsl(var(--primary))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: {
					DEFAULT: 'hsl(var(--surface))',
					variant: 'hsl(var(--surface-variant))',
					container: 'hsl(var(--surface-container))',
				},
				'on-surface': {
					DEFAULT: 'hsl(var(--on-surface))',
					variant: 'hsl(var(--on-surface-variant))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					container: 'hsl(var(--primary-container))',
					foreground: 'hsl(var(--on-primary))',
					'container-foreground': 'hsl(var(--on-primary-container))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--on-surface-variant))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					container: 'hsl(var(--accent-container))',
					foreground: 'hsl(var(--on-accent))',
					'container-foreground': 'hsl(var(--on-accent-container))',
				},
				popover: {
					DEFAULT: 'hsl(var(--surface))',
					foreground: 'hsl(var(--on-surface))'
				},
				card: {
					DEFAULT: 'hsl(var(--surface))',
					foreground: 'hsl(var(--on-surface))'
				},
				outline: {
					DEFAULT: 'hsl(var(--outline))',
					variant: 'hsl(var(--outline-variant))',
				},
			},
			boxShadow: {
				'elevation-1': 'var(--elevation-1)',
				'elevation-2': 'var(--elevation-2)',
				'elevation-3': 'var(--elevation-3)',
				'elevation-4': 'var(--elevation-4)',
				'elevation-5': 'var(--elevation-5)',
			},
			animation: {
				'scale-in': 'scale-in var(--duration-medium2) var(--motion-standard)',
				'scale-out': 'scale-out var(--duration-short4) var(--motion-standard)',
				'slide-up': 'slide-up var(--duration-medium2) var(--motion-decelerated)',
				'slide-down': 'slide-down var(--duration-medium2) var(--motion-decelerated)',
				'fade-in': 'fade-in var(--duration-medium1) var(--motion-standard)',
				'shimmer': 'shimmer 2s infinite linear',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'scale-in': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.8)', opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
