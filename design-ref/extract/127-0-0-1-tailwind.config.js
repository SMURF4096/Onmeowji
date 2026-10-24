/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(46, 68%, 97%)',
            '100': 'hsl(46, 68%, 94%)',
            '200': 'hsl(46, 68%, 86%)',
            '300': 'hsl(46, 68%, 76%)',
            '400': 'hsl(46, 68%, 64%)',
            '500': 'hsl(46, 68%, 50%)',
            '600': 'hsl(46, 68%, 40%)',
            '700': 'hsl(46, 68%, 32%)',
            '800': 'hsl(46, 68%, 24%)',
            '900': 'hsl(46, 68%, 16%)',
            '950': 'hsl(46, 68%, 10%)',
            DEFAULT: '#c9a227'
        },
        secondary: {
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
        accent: {
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
        'neutral-50': '#ab9f97',
        'neutral-100': '#8b808f',
        'neutral-200': '#cfc5bb',
        'neutral-300': '#ffffff',
        'neutral-400': '#b3b3b7',
        'neutral-500': '#40304f',
        'neutral-600': '#0e0913',
        'neutral-700': '#000000',
        background: '#0e0913',
        foreground: '#ffffff'
    },
    fontFamily: {
        sans: [
            'Zen Old Mincho',
            'sans-serif'
        ],
        heading: [
            'Marcellus',
            'sans-serif'
        ]
    },
    fontSize: {
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '64': [
            '64px',
            {
                lineHeight: '71.68px',
                letterSpacing: '2.56px'
            }
        ],
        '38.4': [
            '38.4px',
            {
                lineHeight: '61.44px',
                letterSpacing: '21.12px'
            }
        ],
        '35.2': [
            '35.2px',
            {
                lineHeight: '38.72px'
            }
        ],
        '28.8': [
            '28.8px',
            {
                lineHeight: '46.08px',
                letterSpacing: '2.88px'
            }
        ],
        '27.2': [
            '27.2px',
            {
                lineHeight: '36.72px',
                letterSpacing: '1.632px'
            }
        ],
        '22.4': [
            '22.4px',
            {
                lineHeight: '35.84px'
            }
        ],
        '20.8': [
            '20.8px',
            {
                lineHeight: '33.28px',
                letterSpacing: '1.248px'
            }
        ],
        '18.4': [
            '18.4px',
            {
                lineHeight: '29.44px',
                letterSpacing: '2.208px'
            }
        ],
        '16.8': [
            '16.8px',
            {
                lineHeight: '26.88px',
                letterSpacing: '2.208px'
            }
        ],
        '16.32': [
            '16.32px',
            {
                lineHeight: '26.112px',
                letterSpacing: '0.816px'
            }
        ],
        '15.2': [
            '15.2px',
            {
                lineHeight: '24.32px',
                letterSpacing: '1.216px'
            }
        ],
        '14.4': [
            '14.4px',
            {
                lineHeight: '19.44px',
                letterSpacing: '0.576px'
            }
        ],
        '14.08': [
            '14.08px',
            {
                lineHeight: 'normal',
                letterSpacing: '0.8448px'
            }
        ],
        '13.6': [
            '13.6px',
            {
                lineHeight: '21.76px'
            }
        ]
    },
    spacing: {
        '0': '0px',
        '1': '2px',
        '12': '24px',
        '13': '26px',
        '19': '38px',
        '24': '48px',
        '28': '56px',
        '32': '64px',
        '44': '88px',
        '77': '154px',
        '13px': '13px',
        '29px': '29px',
        '35px': '35px',
        '81px': '81px',
        '439px': '439px'
    },
    borderRadius: {
        md: '6px',
        lg: '12px',
        full: '999px'
    },
    boxShadow: {
        xs: 'rgba(176, 48, 39, 0.45) 0px 2px 10px 0px',
        sm: 'rgba(176, 48, 39, 0.4) 0px 4px 18px 0px',
        md: 'rgba(0, 0, 0, 0.5) 0px 12px 32px 0px, rgba(0, 0, 0, 0.4) 0px 2px 8px 0px'
    },
    screens: {
        xs: '360px',
        md: '720px'
    },
    transitionDuration: {
        '45': '0.045s',
        '90': '0.09s',
        '135': '0.135s',
        '150': '0.15s',
        '180': '0.18s',
        '225': '0.225s',
        '270': '0.27s',
        '315': '0.315s',
        '320': '0.32s',
        '360': '0.36s',
        '405': '0.405s',
        '450': '0.45s',
        '495': '0.495s',
        '600': '0.6s'
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
