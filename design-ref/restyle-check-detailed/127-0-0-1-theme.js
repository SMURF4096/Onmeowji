// React Theme — extracted from http://127.0.0.1:8431
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
 *   };
 *   fonts: {
    body: string;
    mono: string;
 *   };
 *   fontSizes: {
    '16': string;
    '115.2': string;
    '35.2': string;
    '25.6': string;
    '22.4': string;
    '17.6': string;
    '16.8': string;
    '15.2': string;
    '14.4': string;
    '13.6': string;
    '13.12': string;
    '12.48': string;
 *   };
 *   space: {
    '2': string;
    '24': string;
    '29': string;
    '35': string;
    '40': string;
    '44': string;
    '48': string;
    '56': string;
    '64': string;
    '88': string;
 *   };
 *   radii: {
    sm: string;
    full: string;
 *   };
 *   shadows: {

 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#a67811",
    "secondary": "#d4af37",
    "accent": "#e0554c",
    "background": "#131415",
    "foreground": "#ffffff",
    "neutral50": "#878177",
    "neutral100": "#a49f95",
    "neutral200": "#ffffff",
    "neutral300": "#17181a",
    "neutral400": "#1d1e21",
    "neutral500": "#2a2b2e",
    "neutral600": "#050506"
  },
  "fonts": {
    "body": "'Inter', sans-serif",
    "mono": "'Geist Mono', monospace"
  },
  "fontSizes": {
    "16": "16px",
    "115.2": "115.2px",
    "35.2": "35.2px",
    "25.6": "25.6px",
    "22.4": "22.4px",
    "17.6": "17.6px",
    "16.8": "16.8px",
    "15.2": "15.2px",
    "14.4": "14.4px",
    "13.6": "13.6px",
    "13.12": "13.12px",
    "12.48": "12.48px"
  },
  "space": {
    "2": "2px",
    "24": "24px",
    "29": "29px",
    "35": "35px",
    "40": "40px",
    "44": "44px",
    "48": "48px",
    "56": "56px",
    "64": "64px",
    "88": "88px"
  },
  "radii": {
    "sm": "4px",
    "full": "28px"
  },
  "shadows": {},
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#a67811",
      "light": "hsl(41, 81%, 51%)",
      "dark": "hsl(41, 81%, 21%)"
    },
    "secondary": {
      "main": "#d4af37",
      "light": "hsl(46, 65%, 67%)",
      "dark": "hsl(46, 65%, 37%)"
    },
    "background": {
      "default": "#131415",
      "paper": "#a67811"
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#f5efe4"
    }
  },
  "typography": {
    "fontFamily": "'Inter', sans-serif",
    "h1": {
      "fontSize": "35.2px",
      "fontWeight": "700",
      "lineHeight": "38.72px"
    },
    "h2": {
      "fontSize": "25.6px",
      "fontWeight": "900",
      "lineHeight": "43.52px"
    },
    "h3": {
      "fontSize": "22.4px",
      "fontWeight": "900",
      "lineHeight": "31.36px"
    },
    "body1": {
      "fontSize": "16.8px",
      "fontWeight": "700",
      "lineHeight": "28.56px"
    }
  },
  "shape": {
    "borderRadius": 4
  },
  "shadows": []
};

export default theme;
