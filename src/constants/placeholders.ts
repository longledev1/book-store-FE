/**
 * SVG Data URI placeholder for author avatars without an image ("ĐANG CẬP NHẬT").
 */
export const PLACEHOLDER_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect width="300" height="400" fill="#0F172A"/>
  <g transform="translate(0, -15)">
    <circle cx="150" cy="155" r="48" fill="#334155"/>
    <path d="M80 270 C80 215, 220 215, 220 270 Z" fill="#334155"/>
  </g>
  <rect x="55" y="305" width="190" height="34" rx="17" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
  <text x="150" y="326" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">ĐANG CẬP NHẬT</text>
</svg>
`)}`;
