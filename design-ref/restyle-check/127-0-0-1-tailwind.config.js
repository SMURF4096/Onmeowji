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
            '50': 'hsl(46, 65%, 97%)',
            '100': 'hsl(46, 65%, 94%)',
            '200': 'hsl(46, 65%, 86%)',
            '300': 'hsl(46, 65%, 76%)',
            '400': 'hsl(46, 65%, 64%)',
            '500': 'hsl(46, 65%, 50%)',
            '600': 'hsl(46, 65%, 40%)',
            '700': 'hsl(46, 65%, 32%)',
            '800': 'hsl(46, 65%, 24%)',
            '900': 'hsl(46, 65%, 16%)',
            '950': 'hsl(46, 65%, 10%)',
            DEFAULT: '#d4af37'
        },
        accent: {
            '50': 'hsl(4, 70%, 97%)',
            '100': 'hsl(4, 70%, 94%)',
            '200': 'hsl(4, 70%, 86%)',
            '300': 'hsl(4, 70%, 76%)',
            '400': 'hsl(4, 70%, 64%)',
            '500': 'hsl(4, 70%, 50%)',
            '600': 'hsl(4, 70%, 40%)',
            '700': 'hsl(4, 70%, 32%)',
            '800': 'hsl(4, 70%, 24%)',
            '900': 'hsl(4, 70%, 16%)',
            '950': 'hsl(4, 70%, 10%)',
            DEFAULT: '#e0554c'
        },
        'neutral-50': '#878177',
        'neutral-100': '#a49f95',
        'neutral-200': '#ffffff',
        'neutral-300': '#17181a',
        'neutral-400': '#1d1e21',
        'neutral-500': '#2a2b2e',
        'neutral-600': '#050506',
        background: '#131415',
        foreground: '#ffffff'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ],
        mono: [
            'Geist Mono',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '20.4px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '115.2': [
            '115.2px',
            {
                lineHeight: '109.44px',
                letterSpacing: '-2.304px'
            }
        ],
        '35.2': [
            '35.2px',
            {
                lineHeight: '38.72px'
            }
        ],
        '25.6': [
            '25.6px',
            {
                lineHeight: '43.52px',
                letterSpacing: '-0.256px'
            }
        ],
        '22.4': [
            '22.4px',
            {
                lineHeight: '31.36px',
                letterSpacing: '-0.224px'
            }
        ],
        '17.6': [
            '17.6px',
            {
                lineHeight: '29.92px',
                letterSpacing: '1.056px'
            }
        ],
        '16.8': [
            '16.8px',
            {
                lineHeight: '28.56px',
                letterSpacing: '1.92px'
            }
        ],
        '15.2': [
            '15.2px',
            {
                lineHeight: '25.84px'
            }
        ],
        '14.4': [
            '14.4px',
            {
                lineHeight: '24.48px'
            }
        ],
        '13.6': [
            '13.6px',
            {
                lineHeight: '23.12px'
            }
        ],
        '13.12': [
            '13.12px',
            {
                lineHeight: '22.304px'
            }
        ],
        '12.48': [
            '12.48px',
            {
                lineHeight: '21.216px',
                letterSpacing: '1.7472px'
            }
        ],
        '11.52': [
            '11.52px',
            {
                lineHeight: '19.584px',
                letterSpacing: '1.6128px'
            }
        ],
        '11.2': [
            '11.2px',
            {
                lineHeight: '19.04px'
            }
        ]
    },
    spacing: {
        '1': '2px',
        '12': '24px',
        '20': '40px',
        '22': '44px',
        '24': '48px',
        '28': '56px',
        '32': '64px',
        '44': '88px',
        '29px': '29px',
        '35px': '35px'
    },
    borderRadius: {
        sm: '4px',
        full: '28px'
    },
    screens: {
        xs: '360px',
        md: '720px'
    },
    transitionDuration: {
        '150': '0.15s',
        '320': '0.32s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.22, 1, 0.36, 1)'
    },
    container: {
        center: true,
        padding: '48px'
    },
    maxWidth: {
        container: '1240px'
    }
},
  },
};
