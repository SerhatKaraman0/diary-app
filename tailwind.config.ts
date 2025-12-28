import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("tailwindcss-animate")],
    theme: {
    	extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))',
                    50: '#FCE8CC',
                    100: '#FF9296',
                    200: '#FF4953',
                    300: '#CC182B',
                    400: '#8B0F1A',
                    500: '#4F0508',
                    600: '#280203',
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
                beige: {
                    50: '#E9DEC0',
                    100: '#C0B69B',
                    200: '#99927A',
                    300: '#726D5B',
                    400: '#4E4A3D',
                    500: '#202A22',
                    600: '#12110D',
                },
                neutral: {
                    50: '#F3EFE8',
                    100: '#D4C5AE',
                    200: '#A69F8C',
                    300: '#7A776B',
                    400: '#5E574C',
                    500: '#3D3535',
                    600: '#1B1914',
                },
                brown: {
                    50: '#F5EFE7',
                    100: '#E9C297',
                    200: '#C79B60',
                    300: '#9B7753',
                    400: '#6C553A',
                    500: '#443532',
                    600: '#22190E',
                },
                gray: {
                    50: '#E0DEDA',
                    100: '#BBB8B2',
                    200: '#92908D',
                    300: '#6B6B68',
                    400: '#464848',
                    500: '#2A2A28',
                    600: '#111110',
                },
                journal: {
                    paper: '#FDFBF5',
                    heart: '#C0392B',
                    star: '#D4AF37',
                    cold: '#2C3E50',
                    warm: '#E67E22',
                },
    		},
            fontFamily: {
                heading: ['Alfa Slab One', 'sans-serif'],
                handwriting: ['Caveat', 'cursive'],
                mono: ['Special Elite', 'monospace'],
            },
    	}
    }
} satisfies Config;
