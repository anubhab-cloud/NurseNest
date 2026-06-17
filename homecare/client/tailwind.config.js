/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // ── Override defaults — nothing outside the design system ──────────────
    screens: {
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',   // ← max-width container
    },

    // ── Strict spacing scale: 8px base unit ────────────────────────────────
    spacing: {
      px:  '1px',
      0:   '0px',
      1:   '4px',   // half-unit — only for micro gaps
      2:   '8px',   // base unit
      3:   '12px',
      4:   '16px',
      5:   '20px',
      6:   '24px',
      7:   '28px',
      8:   '32px',
      10:  '40px',
      12:  '48px',
      14:  '56px',
      16:  '64px',
      20:  '80px',
      24:  '96px',
      28:  '112px',
      32:  '128px',
      36:  '144px',
      40:  '160px',
      48:  '192px',
      56:  '224px',
      64:  '256px',
      72:  '288px',
      80:  '320px',
      96:  '384px',
    },

    // ── Border radius: strict design tokens ────────────────────────────────
    borderRadius: {
      none:  '0px',
      sm:    '4px',
      DEFAULT: '8px',
      md:    '8px',
      lg:    '12px',   // ← buttons
      xl:    '16px',   // ← cards
      '2xl': '20px',
      '3xl': '24px',
      full:  '9999px',
    },

    // ── Font sizes — strict type scale ─────────────────────────────────────
    fontSize: {
      xs:   ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
      sm:   ['13px', { lineHeight: '20px', letterSpacing: '0.01em' }],
      base: ['15px', { lineHeight: '24px', letterSpacing: '0' }],
      lg:   ['17px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
      xl:   ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
      '2xl':['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
      '3xl':['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
      '4xl':['36px', { lineHeight: '42px', letterSpacing: '-0.03em' }],
      '5xl':['48px', { lineHeight: '54px', letterSpacing: '-0.03em' }],
      '6xl':['60px', { lineHeight: '66px', letterSpacing: '-0.04em' }],
      '7xl':['72px', { lineHeight: '78px', letterSpacing: '-0.04em' }],
    },

    fontFamily: {
      sans:    ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
      mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
    },

    fontWeight: {
      normal:    '400',
      medium:    '500',
      semibold:  '600',
      bold:      '700',
      extrabold: '800',
    },

    extend: {
      // ── Color system ──────────────────────────────────────────────────────
      colors: {
        // Brand blue — primary actions, links, highlights
        blue: {
          50:  '#F0F7FF',
          100: '#E0EFFF',
          200: '#BAD9FF',
          300: '#84BBFF',
          400: '#4897FD',
          500: '#1D77F2',   // ← primary brand
          600: '#155DD4',
          700: '#1147A8',
          800: '#0F3580',
          900: '#0A2258',
        },
        // Teal — secondary / success states
        teal: {
          50:  '#F0FDFB',
          100: '#CCFBF3',
          200: '#99F4E8',
          300: '#5CE8D7',
          400: '#2DD4C0',
          500: '#14B8A4',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // Neutral — backgrounds, borders, text
        gray: {
          0:   '#FFFFFF',
          25:  '#FAFAFA',
          50:  '#F5F5F5',
          100: '#EBEBEB',
          200: '#D4D4D4',
          300: '#ABABAB',
          400: '#858585',
          500: '#5C5C5C',
          600: '#3D3D3D',
          700: '#2B2B2B',
          800: '#1A1A1A',
          900: '#0F0F0F',
        },
        // Semantic
        success: { light: '#ECFDF5', DEFAULT: '#10B981', dark: '#065F46' },
        warning: { light: '#FFFBEB', DEFAULT: '#F59E0B', dark: '#92400E' },
        error:   { light: '#FEF2F2', DEFAULT: '#EF4444', dark: '#991B1B' },
        info:    { light: '#EFF6FF', DEFAULT: '#3B82F6', dark: '#1E40AF' },
      },

      // ── Box shadows — 3 levels only ───────────────────────────────────────
      boxShadow: {
        // Level 1 — cards, inputs
        sm:  '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        // Level 2 — dropdowns, popovers
        md:  '0 4px 12px -2px rgba(0,0,0,0.10), 0 2px 6px -2px rgba(0,0,0,0.06)',
        // Level 3 — modals, drawers
        lg:  '0 16px 40px -8px rgba(0,0,0,0.14), 0 4px 12px -4px rgba(0,0,0,0.08)',
        // Interaction glow
        focus:  '0 0 0 3px rgba(29,119,242,0.20)',
        focusRed: '0 0 0 3px rgba(239,68,68,0.20)',
        // No shadow (elevation 0)
        none: 'none',
        // Inset
        inset: 'inset 0 1px 3px rgba(0,0,0,0.06)',
      },

      // ── Transitions ───────────────────────────────────────────────────────
      transitionDuration: {
        fast:    '100ms',
        base:    '150ms',
        slow:    '250ms',
        slower:  '400ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',  // ease-out-expo
        in:      'cubic-bezier(0.4, 0, 1, 1)',
        out:     'cubic-bezier(0, 0, 0.2, 1)',
        spring:  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // ── Z-index scale ─────────────────────────────────────────────────────
      zIndex: { 0: '0', 10: '10', 20: '20', 30: '30', 40: '40', 50: '50', modal: '100', toast: '200' },

      // ── Animations ────────────────────────────────────────────────────────
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn:  { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:  { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulse:    { '0%,100%': { opacity: '1' }, '50%': { opacity: '.5' } },
        gradient: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        shimmer:  { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        spin:     { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        pulseDot: { '0%,100%': { transform: 'scale(1)', opacity: '1' }, '50%': { transform: 'scale(1.5)', opacity: '0.5' } },
      },
      animation: {
        'fade-up':    'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fadeIn 0.3s ease both',
        'slide-in':   'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':   'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'float':      'float 5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient':   'gradient 8s ease infinite',
        'shimmer':    'shimmer 1.5s linear infinite',
        'spin':       'spin 1s linear infinite',
        'pulse-dot':  'pulseDot 1.8s ease-in-out infinite',
      },

      // ── Grid ──────────────────────────────────────────────────────────────
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },

      // ── Max width ─────────────────────────────────────────────────────────
      maxWidth: {
        'container': '1280px',
        'prose':     '68ch',
      },
    },
  },
  plugins: [],
};
