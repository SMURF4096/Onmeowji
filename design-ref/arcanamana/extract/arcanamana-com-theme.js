// React Theme — extracted from https://arcanamana.com
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
 *   };
 *   fonts: {
    mono: string;
 *   };
 *   fontSizes: {
    '12': string;
    '14': string;
    '16': string;
 *   };
 *   space: {
    '2': string;
    '24': string;
    '32': string;
    '40': string;
    '52': string;
    '80': string;
 *   };
 *   radii: {
    md: string;
    lg: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
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
    "secondary": "#f5efe4",
    "background": "#131415",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#131415"
  },
  "fonts": {
    "mono": "'Geist Mono', monospace"
  },
  "fontSizes": {
    "12": "12px",
    "14": "14px",
    "16": "16px"
  },
  "space": {
    "2": "2px",
    "24": "24px",
    "32": "32px",
    "40": "40px",
    "52": "52px",
    "80": "80px"
  },
  "radii": {
    "md": "6px",
    "lg": "16px",
    "full": "28px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0.25) 0px 2px 4px 0px"
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
      "main": "#a67811",
      "light": "hsl(41, 81%, 51%)",
      "dark": "hsl(41, 81%, 21%)"
    },
    "secondary": {
      "main": "#f5efe4",
      "light": "hsl(39, 46%, 95%)",
      "dark": "hsl(39, 46%, 78%)"
    },
    "background": {
      "default": "#131415",
      "paper": "#131415"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#0000ee"
    }
  },
  "typography": {
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "normal"
    },
    "body2": {
      "fontSize": "12px",
      "fontWeight": "400",
      "lineHeight": "normal"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": [
    "rgba(0, 0, 0, 0.25) 0px 2px 4px 0px"
  ]
};

export default theme;
