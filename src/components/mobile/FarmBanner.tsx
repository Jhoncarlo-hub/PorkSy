export function FarmBanner() {
  return (
    <div className="agri-farm-banner">
      <svg
        viewBox="0 0 400 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Sky */}
        <rect width="400" height="80" fill="#2d6a4f" />

        {/* Sun */}
        <circle cx="340" cy="22" r="14" fill="#f9c74f" opacity="0.85" />
        {/* Sun rays */}
        {[0,45,90,135,180,225,270,315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 340 + 18 * Math.cos(rad);
          const y1 = 22 + 18 * Math.sin(rad);
          const x2 = 340 + 24 * Math.cos(rad);
          const y2 = 22 + 24 * Math.sin(rad);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f9c74f" strokeWidth="2" opacity="0.6" />;
        })}

        {/* Far hills */}
        <ellipse cx="80" cy="90" rx="160" ry="55" fill="#52b788" opacity="0.5" />
        <ellipse cx="300" cy="95" rx="160" ry="55" fill="#40916c" opacity="0.5" />

        {/* Mid hills */}
        <ellipse cx="50" cy="100" rx="120" ry="45" fill="#74c69d" opacity="0.7" />
        <ellipse cx="220" cy="95" rx="140" ry="50" fill="#52b788" opacity="0.7" />
        <ellipse cx="380" cy="100" rx="110" ry="45" fill="#74c69d" opacity="0.7" />

        {/* Foreground ground */}
        <rect x="0" y="58" width="400" height="30" fill="#1b4332" opacity="0.7" />

        {/* Farmhouse body */}
        <rect x="168" y="36" width="36" height="26" fill="#fff" opacity="0.9" rx="2" />
        {/* Farmhouse roof */}
        <polygon points="162,38 186,20 210,38" fill="#e63946" opacity="0.85" />
        {/* Chimney */}
        <rect x="198" y="24" width="6" height="10" fill="#d4a574" opacity="0.9" />
        {/* Door */}
        <rect x="180" y="48" width="10" height="14" fill="#2d6a4f" opacity="0.9" rx="1" />
        {/* Windows */}
        <rect x="170" y="42" width="8" height="7" fill="#a8d8ea" opacity="0.9" rx="1" />
        <rect x="193" y="42" width="8" height="7" fill="#a8d8ea" opacity="0.9" rx="1" />

        {/* Fence left */}
        {[0,1,2,3].map(i => (
          <rect key={`fl${i}`} x={110 + i*14} y={56} width={3} height={12} fill="#fff" opacity="0.5" rx="1" />
        ))}
        <rect x="110" y="60" width="42" height="2" fill="#fff" opacity="0.4" />
        <rect x="110" y="64" width="42" height="2" fill="#fff" opacity="0.4" />

        {/* Fence right */}
        {[0,1,2,3].map(i => (
          <rect key={`fr${i}`} x={248 + i*14} y={56} width={3} height={12} fill="#fff" opacity="0.5" rx="1" />
        ))}
        <rect x="248" y="60" width="42" height="2" fill="#fff" opacity="0.4" />
        <rect x="248" y="64" width="42" height="2" fill="#fff" opacity="0.4" />

        {/* Trees */}
        <rect x="130" y="48" width="4" height="14" fill="#1b4332" opacity="0.8" />
        <ellipse cx="132" cy="44" rx="10" ry="10" fill="#40916c" opacity="0.9" />

        <rect x="256" y="48" width="4" height="14" fill="#1b4332" opacity="0.8" />
        <ellipse cx="258" cy="44" rx="10" ry="10" fill="#52b788" opacity="0.9" />

        {/* Small pig silhouette */}
        <ellipse cx="60" cy="65" rx="9" ry="6" fill="#ffb3c1" opacity="0.85" />
        <circle cx="68" cy="62" r="5" fill="#ffb3c1" opacity="0.85" />
        <ellipse cx="70" cy="61" rx="3" ry="2" fill="#ff8fab" opacity="0.7" />
        {/* pig ears */}
        <ellipse cx="67" cy="58" rx="2" ry="3" fill="#ff8fab" opacity="0.7" transform="rotate(-20 67 58)" />
        <ellipse cx="72" cy="58" rx="2" ry="3" fill="#ff8fab" opacity="0.7" transform="rotate(20 72 58)" />

        {/* Clouds */}
        <ellipse cx="40" cy="12" rx="20" ry="9" fill="#fff" opacity="0.3" />
        <ellipse cx="55" cy="10" rx="16" ry="8" fill="#fff" opacity="0.3" />
        <ellipse cx="28" cy="14" rx="14" ry="7" fill="#fff" opacity="0.3" />

        <ellipse cx="250" cy="15" rx="18" ry="8" fill="#fff" opacity="0.25" />
        <ellipse cx="264" cy="13" rx="14" ry="7" fill="#fff" opacity="0.25" />
      </svg>
    </div>
  );
}
