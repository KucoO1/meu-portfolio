"use client";

/**
 * Gera um padrão visual semelhante a um QR Code a partir de uma string (seed).
 * É puramente decorativo — não é um QR Code real nem descodificável.
 * Usado apenas para dar corpo visual às demos interativas do portefólio.
 */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + Math.imul(h ^ (h >>> 7), 61 | h)) ^ h;
    h = h >>> 0;
    return (h % 1000) / 1000;
  };
}

export default function FakeQRCode({
  seed,
  size = 220,
}: {
  seed: string;
  size?: number;
}) {
  const cells = 21;
  const cellSize = size / cells;
  const rand = seededRandom(seed);

  const grid: boolean[][] = Array.from({ length: cells }, () =>
    Array.from({ length: cells }, () => rand() > 0.5)
  );

  const isFinder = (r: number, c: number) => {
    const inCorner = (rr: number, cc: number) =>
      r >= rr && r < rr + 7 && c >= cc && c < cc + 7;
    return inCorner(0, 0) || inCorner(0, cells - 7) || inCorner(cells - 7, 0);
  };

  const finderPattern = (r: number, c: number, rr: number, cc: number) => {
    const lr = r - rr;
    const lc = c - cc;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="bg-white rounded-lg"
      role="img"
      aria-label="QR Code simulado"
    >
      {grid.map((row, r) =>
        row.map((on, c) => {
          let filled = on;
          if (isFinder(r, c)) {
            if (r < 7 && c < 7) filled = finderPattern(r, c, 0, 0);
            else if (r < 7 && c >= cells - 7) filled = finderPattern(r, c, 0, cells - 7);
            else filled = finderPattern(r, c, cells - 7, 0);
          }
          if (!filled) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#111827"
            />
          );
        })
      )}
    </svg>
  );
}
