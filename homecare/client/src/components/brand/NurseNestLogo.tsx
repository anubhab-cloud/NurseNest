/**
 * NurseNest Logo Component
 * Based on original brand: shield + two caring hands + tree
 * Refined for digital/web use — SVG, fully scalable, no raster artifacts
 *
 * Usage:
 *   <NurseNestLogo />                    — default: icon + wordmark, horizontal
 *   <NurseNestLogo variant="icon" />     — icon only
 *   <NurseNestLogo variant="full" />     — icon + wordmark + tagline
 *   <NurseNestLogo variant="wordmark" /> — wordmark only, no icon
 *   <NurseNestLogo size={48} />          — control icon height in px
 *   <NurseNestLogo dark />               — white wordmark for dark backgrounds
 *   <NurseNestLogo stacked />            — vertical layout
 */

interface Props {
  variant?: 'default' | 'icon' | 'full' | 'wordmark';
  size?: number;
  dark?: boolean;
  stacked?: boolean;
  className?: string;
}

// ── Colour tokens (brand palette derived from original logo)
const C = {
  // Shield gradient — warm gold, faithful to original
  shieldLight:  '#F5DFA0',
  shieldMid:    '#E8C96A',
  shieldDark:   '#C9A84C',
  shieldAccent: '#A0783A',

  // Left hand — lighter warm tan
  handLeft:     '#D4A96A',
  handLeftShad: '#B88A4A',

  // Right hand — deeper warm brown
  handRight:    '#7A4F2D',
  handRightShad:'#5A3520',

  // Tree
  treeTrunk:    '#7A4F2D',
  treeLeaf:     '#C9A84C',
  treeLeafDark: '#A0783A',

  // Text — primary (light bg)
  textPrimary:  '#4A1E6B',   // deep purple, matches original
  textTagline:  '#6B3A8A',

  // Text — dark mode
  textLight:    '#FFFFFF',
  textLightSub: 'rgba(255,255,255,0.75)',

  // Accent line under NURSENEST
  accentLine:   '#C9A84C',
};

// ── The icon mark ──────────────────────────────────────────────────────────────
function IconMark({ size = 48 }: { size?: number }) {
  const s = size;
  const vb = 100; // viewBox is 100×100 units
  return (
    <svg
      width={s} height={s}
      viewBox={`0 0 ${vb} ${vb}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Shield gradient — left half lighter, right half darker */}
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.shieldLight} />
          <stop offset="45%"  stopColor={C.shieldMid} />
          <stop offset="100%" stopColor={C.shieldDark} />
        </linearGradient>

        {/* Inner shield face (the flat front) */}
        <linearGradient id="shieldFace" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#FFF3CC" />
          <stop offset="100%" stopColor={C.shieldMid} />
        </linearGradient>

        {/* Left hand gradient */}
        <linearGradient id="handL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.handLeft} />
          <stop offset="100%" stopColor={C.handLeftShad} />
        </linearGradient>

        {/* Right hand gradient */}
        <linearGradient id="handR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.handRight} />
          <stop offset="100%" stopColor={C.handRightShad} />
        </linearGradient>

        {/* Subtle drop shadow filter */}
        <filter id="shadow" x="-10%" y="-5%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.18)" />
        </filter>
        <filter id="shadowSoft" x="-15%" y="-10%" width="130%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="rgba(0,0,0,0.12)" />
        </filter>
      </defs>

      {/* ── LEFT HAND ── */}
      {/* Palm + fingers curving up from bottom-left, supporting the shield */}
      <g filter="url(#shadow)">
        <path
          d="
            M 10 85
            C 8 78, 6 68, 9 58
            C 11 51, 14 45, 17 40
            C 20 35, 22 33, 23 36
            C 24 38, 23 41, 22 44
            C 22 44, 27 37, 29 35
            C 31 33, 34 33, 34 36
            C 34 39, 32 43, 31 46
            C 31 46, 35 39, 37 37
            C 39 35, 42 36, 42 39
            C 42 42, 39 47, 38 50
            C 38 50, 41 45, 43 44
            C 45 43, 47 44, 46 47
            C 44 52, 40 60, 38 66
            C 36 72, 35 78, 36 84
            C 30 87, 18 87, 10 85
            Z
          "
          fill="url(#handL)"
        />
        {/* Thumb */}
        <path
          d="M 10 85 C 9 76, 10 65, 14 58 C 12 64, 11 73, 13 81 Z"
          fill={C.handLeftShad}
          opacity="0.5"
        />
      </g>

      {/* ── RIGHT HAND ── */}
      <g filter="url(#shadow)">
        <path
          d="
            M 90 85
            C 92 78, 94 68, 91 58
            C 89 51, 86 45, 83 40
            C 80 35, 78 33, 77 36
            C 76 38, 77 41, 78 44
            C 78 44, 73 37, 71 35
            C 69 33, 66 33, 66 36
            C 66 39, 68 43, 69 46
            C 69 46, 65 39, 63 37
            C 61 35, 58 36, 58 39
            C 58 42, 61 47, 62 50
            C 62 50, 59 45, 57 44
            C 55 43, 53 44, 54 47
            C 56 52, 60 60, 62 66
            C 64 72, 65 78, 64 84
            C 70 87, 82 87, 90 85
            Z
          "
          fill="url(#handR)"
        />
        {/* Thumb */}
        <path
          d="M 90 85 C 91 76, 90 65, 86 58 C 88 64, 89 73, 87 81 Z"
          fill={C.handRightShad}
          opacity="0.5"
        />
      </g>

      {/* ── SHIELD ── */}
      <g filter="url(#shadowSoft)">
        {/* Shield body */}
        <path
          d="
            M 50 8
            L 78 20
            L 78 52
            C 78 68, 64 80, 50 88
            C 36 80, 22 68, 22 52
            L 22 20
            Z
          "
          fill="url(#shieldGrad)"
        />
        {/* Centre fold / 3D crease */}
        <path
          d="M 50 8 L 50 88"
          stroke={C.shieldDark}
          strokeWidth="0.8"
          opacity="0.4"
        />
        {/* Inner shield face (lighter inset) */}
        <path
          d="
            M 50 14
            L 73 24
            L 73 52
            C 73 65, 61 75, 50 82
            C 39 75, 27 65, 27 52
            L 27 24
            Z
          "
          fill="url(#shieldFace)"
          opacity="0.6"
        />
      </g>

      {/* ── TREE ── */}
      <g>
        {/* Trunk */}
        <rect x="47.5" y="60" width="5" height="18" rx="2.5" fill={C.treeTrunk} />
        {/* Ground roots */}
        <path d="M 45 76 C 41 78, 38 79, 36 78" stroke={C.treeTrunk} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 55 76 C 59 78, 62 79, 64 78" stroke={C.treeTrunk} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Main branches */}
        <path d="M 50 60 C 50 53, 42 48, 36 46" stroke={C.treeTrunk} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 50 60 C 50 53, 58 48, 64 46" stroke={C.treeTrunk} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 50 57 L 50 44" stroke={C.treeTrunk} strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Sub-branches */}
        <path d="M 44 52 C 41 48, 37 44, 34 42" stroke={C.treeTrunk} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 56 52 C 59 48, 63 44, 66 42" stroke={C.treeTrunk} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 50 50 C 46 46, 44 42, 43 40" stroke={C.treeTrunk} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M 50 50 C 54 46, 56 42, 57 40" stroke={C.treeTrunk} strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Leaves — ellipses scattered on branch tips */}
        {[
          // [cx, cy, rx, ry, rotate]
          [36, 44, 5, 3.5, -30], [32, 41, 4, 3, -20], [38, 40, 4.5, 3, -40],
          [64, 44, 5, 3.5, 30],  [68, 41, 4, 3, 20],  [62, 40, 4.5, 3, 40],
          [50, 41, 5, 3.5, 0],   [43, 38, 4, 3, -25], [57, 38, 4, 3, 25],
          [46, 35, 4.5, 3, -15], [54, 35, 4.5, 3, 15],[50, 33, 5, 3.5, 0],
          [42, 32, 4, 2.8, -30], [58, 32, 4, 2.8, 30],
        ].map(([cx, cy, rx, ry, rot], i) => (
          <ellipse
            key={i}
            cx={cx} cy={cy} rx={rx} ry={ry}
            fill={i % 3 === 0 ? C.treeLeafDark : C.treeLeaf}
            transform={`rotate(${rot}, ${cx}, ${cy})`}
            opacity="0.9"
          />
        ))}
      </g>
    </svg>
  );
}

// ── Wordmark SVG text (crisp at all sizes) ─────────────────────────────────────
function Wordmark({ dark = false, showTagline = false, stacked = false }: { dark?: boolean; showTagline?: boolean; stacked?: boolean }) {
  const primary = dark ? C.textLight : C.textPrimary;
  const tagline  = dark ? C.textLightSub : C.textTagline;

  return (
    <span className={`flex flex-col ${stacked ? 'items-center' : 'items-start'} leading-none select-none`}>
      {/* Brand name */}
      <span
        style={{
          fontFamily: '"Outfit", "Inter", sans-serif',
          fontWeight: 800,
          fontSize: '1em',
          letterSpacing: '0.08em',
          color: primary,
          lineHeight: 1,
          textTransform: 'uppercase' as const,
        }}>
        NurseNest
      </span>
      {/* Accent line */}
      <span
        style={{
          display: 'block',
          height: '2px',
          width: '100%',
          background: `linear-gradient(90deg, ${C.accentLine}, transparent)`,
          marginTop: '3px',
          marginBottom: showTagline ? '4px' : '0',
          borderRadius: '1px',
          opacity: 0.7,
        }}
      />
      {/* Tagline */}
      {showTagline && (
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: '0.45em',
            letterSpacing: '0.12em',
            color: tagline,
            textTransform: 'uppercase' as const,
            lineHeight: 1,
            marginTop: '1px',
          }}>
          Comfort of Home
        </span>
      )}
    </span>
  );
}

// ── Main exported component ───────────────────────────────────────────────────
export default function NurseNestLogo({
  variant = 'default',
  size = 40,
  dark = false,
  stacked = false,
  className = '',
}: Props) {
  const gap = Math.round(size * 0.28);

  if (variant === 'icon') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <IconMark size={size} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span className={`inline-flex ${className}`} style={{ fontSize: size * 0.55 }}>
        <Wordmark dark={dark} showTagline />
      </span>
    );
  }

  if (stacked) {
    return (
      <span className={`inline-flex flex-col items-center ${className}`} style={{ gap: gap * 0.6 }}>
        <IconMark size={size} />
        <span style={{ fontSize: size * 0.42 }}>
          <Wordmark dark={dark} showTagline stacked />
        </span>
      </span>
    );
  }

  // 'default' — horizontal: icon + name
  // 'full'    — horizontal: icon + name + tagline
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap }}>
      <IconMark size={size} />
      <span style={{ fontSize: size * 0.52 }}>
        <Wordmark dark={dark} showTagline={variant === 'full'} />
      </span>
    </span>
  );
}
