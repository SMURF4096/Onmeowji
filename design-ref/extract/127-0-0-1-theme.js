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
    neutral700: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '16': string;
    '64': string;
    '38.4': string;
    '35.2': string;
    '28.8': string;
    '27.2': string;
    '22.4': string;
    '20.8': string;
    '18.4': string;
    '16.8': string;
    '16.32': string;
    '15.2': string;
 *   };
 *   space: {
    '0': string;
    '2': string;
    '13': string;
    '24': string;
    '26': string;
    '29': string;
    '35': string;
    '38': string;
    '48': string;
    '56': string;
    '64': string;
    '81': string;
    '88': string;
    '154': string;
    '439': string;
 *   };
 *   radii: {
    md: string;
    lg: string;
    full: string;
 *   };
 *   shadows: {
    none: string;
    md: string;
    lg: string;
    xl: string;
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
    "primary": "#c9a227",
    "secondary": "#e0554c",
    "accent": "#d4af37",
    "background": "#0e0913",
    "foreground": "#ffffff",
    "neutral50": "#ab9f97",
    "neutral100": "#8b808f",
    "neutral200": "#cfc5bb",
    "neutral300": "#ffffff",
    "neutral400": "#b3b3b7",
    "neutral500": "#40304f",
    "neutral600": "#0e0913",
    "neutral700": "#000000"
  },
  "fonts": {
    "body": "'Zen Old Mincho', sans-serif"
  },
  "fontSizes": {
    "16": "16px",
    "64": "64px",
    "38.4": "38.4px",
    "35.2": "35.2px",
    "28.8": "28.8px",
    "27.2": "27.2px",
    "22.4": "22.4px",
    "20.8": "20.8px",
    "18.4": "18.4px",
    "16.8": "16.8px",
    "16.32": "16.32px",
    "15.2": "15.2px"
  },
  "space": {
    "0": "0px",
    "2": "2px",
    "13": "13px",
    "24": "24px",
    "26": "26px",
    "29": "29px",
    "35": "35px",
    "38": "38px",
    "48": "48px",
    "56": "56px",
    "64": "64px",
    "81": "81px",
    "88": "88px",
    "154": "154px",
    "439": "439px"
  },
  "radii": {
    "md": "6px",
    "lg": "12px",
    "full": "999px"
  },
  "shadows": {
    "none": "rgba(201, 162, 39, 0.4) 0px 0px 0px 1px inset",
    "md": "rgba(176, 48, 39, 0.45) 0px 2px 10px 0px",
    "lg": "rgba(0, 0, 0, 0.35) 0px 6px 18px 0px",
    "xl": "rgba(0, 0, 0, 0.5) 0px 12px 32px 0px, rgba(0, 0, 0, 0.4) 0px 2px 8px 0px"
  },
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
      "main": "#c9a227",
      "light": "hsl(46, 68%, 62%)",
      "dark": "hsl(46, 68%, 32%)"
    },
    "secondary": {
      "main": "#e0554c",
      "light": "hsl(4, 70%, 74%)",
      "dark": "hsl(4, 70%, 44%)"
    },
    "background": {
      "default": "#0e0913",
      "paper": "#c9a227"
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#efe7dd"
    }
  },
  "typography": {
    "fontFamily": "'Zen Old Mincho', sans-serif",
    "h1": {
      "fontSize": "35.2px",
      "fontWeight": "400",
      "lineHeight": "38.72px"
    },
    "h2": {
      "fontSize": "27.2px",
      "fontWeight": "400",
      "lineHeight": "36.72px"
    },
    "h3": {
      "fontSize": "22.4px",
      "fontWeight": "700",
      "lineHeight": "35.84px"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": [
    "rgba(201, 162, 39, 0.4) 0px 0px 0px 1px inset",
    "rgba(176, 48, 39, 0.45) 0px 2px 10px 0px",
    "rgba(176, 48, 39, 0.4) 0px 4px 18px 0px",
    "rgba(0, 0, 0, 0.35) 0px 6px 18px 0px",
    "rgba(0, 0, 0, 0.5) 0px 12px 32px 0px, rgba(0, 0, 0, 0.4) 0px 2px 8px 0px"
  ]
};

export default theme;
