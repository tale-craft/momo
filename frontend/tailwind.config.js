/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  			mono: [
  				'JetBrains Mono"',
  				'Fira Code',
  				'monospace'
  			],
  			sans: [
  				'Inter',
  				'Manrope',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
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
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        "toast-hide": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "toast-slide-in-right": {
          "0%": { transform: `translateX(calc(100% + 1rem))` },
          "100%": { transform: "translateX(0)" },
        },
        "toast-slide-in-bottom": {
          "0%": { transform: `translateY(calc(100% + 1rem))` },
          "100%": { transform: "translateY(0)" },
        },
        "toast-swipe-out": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": { transform: `translateX(calc(100% + 1rem))` },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        "toast-hide": "toast-hide 100ms ease-in",
        "toast-slide-in-right": "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-slide-in-bottom": "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-swipe-out": "toast-swipe-out 100ms ease-out",
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}