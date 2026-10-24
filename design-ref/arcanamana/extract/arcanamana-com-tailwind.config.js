/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(41, 81%, 97%)',
            '100': 'hsl(41, 81%, 94%)',
            '200': 'hsl(41, 81%, 86%)',
            '300': 'hsl(41, 81%, 76%)',
            '400': 'hsl(41, 81%, 64%)',
            '500': 'hsl(41, 81%, 50%)',
            '600': 'hsl(41, 81%, 40%)',
            '700': 'hsl(41, 81%, 32%)',
            '800': 'hsl(41, 81%, 24%)',
            '900': 'hsl(41, 81%, 16%)',
            '950': 'hsl(41, 81%, 10%)',
            DEFAULT: '#a67811'
        },
        secondary: {
            '50': 'hsl(39, 46%, 97%)',
            '100': 'hsl(39, 46%, 94%)',
            '200': 'hsl(39, 46%, 86%)',
            '300': 'hsl(39, 46%, 76%)',
            '400': 'hsl(39, 46%, 64%)',
            '500': 'hsl(39, 46%, 50%)',
            '600': 'hsl(39, 46%, 40%)',
            '700': 'hsl(39, 46%, 32%)',
            '800': 'hsl(39, 46%, 24%)',
            '900': 'hsl(39, 46%, 16%)',
            '950': 'hsl(39, 46%, 10%)',
            DEFAULT: '#f5efe4'
        },
        'neutral-50': '#000000',
        'neutral-100': '#131415',
        background: '#131415',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Geist Mono',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: 'normal'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '24px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ]
    },
    spacing: {
        '1': '2px',
        '12': '24px',
        '16': '32px',
        '20': '40px',
        '26': '52px',
        '40': '80px'
    },
    borderRadius: {
        md: '6px',
        lg: '16px',
        full: '28px'
    },
    boxShadow: {
        xs: 'rgba(0, 0, 0, 0.25) 0px 2px 4px 0px'
    },
    screens: {
        md: '810px'
    }
},
  },
};
