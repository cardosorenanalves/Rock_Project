import { NextRequest, NextResponse } from "next/server";

/**
 * Os 51 expoentes conhecidos dos primos de Mersenne
 */
const MERSENNE_P = [
  2, 3, 5, 7, 13, 17, 19, 31,
  61, 89, 107, 127, 521,
  607, 1279, 2203, 2281, 3217,
  4253, 4423, 9689, 9941,
  11213, 19937, 21701, 23209,
  44497, 86243, 110503, 132049,
  216091, 756839, 859433,
  1257787, 1398269, 2976221,
  3021377, 6972593, 13466917,
  20996011, 24036583, 25964951,
  30402457, 32582657, 37156667,
  42643801, 43112609, 57885161,
  74207281, 77232917, 82589933
];

const K = 12; // dígitos do prefixo

function digitsOfPerfect(p: number): number {
  return Math.floor((2 * p - 1) * Math.log10(2)) + 1;
}

function firstDigitsOfPerfect(p: number, k: number): string {
  const log10_2 = Math.log10(2);
  const logN = (2 * p - 1) * log10_2; // log10 do número perfeito
  const frac = logN - Math.floor(logN); // parte fracionária
  return Math.floor(10 ** (frac + k - 1)).toString();
}

export async function POST(req: NextRequest) {
  const { length, prefix } = await req.json();

  if (!length || !prefix || typeof prefix !== "string") {
    return NextResponse.json({ error: "invalid input" }, { status: 400 });
  }

  for (const p of MERSENNE_P) {
    const digits = digitsOfPerfect(p);
    console.log(digits, length );

    if (digits === length) {
      const expectedPrefix = firstDigitsOfPerfect(p, K);
      console.log(expectedPrefix, prefix, (prefix === expectedPrefix));
      if (prefix === expectedPrefix) {
        console.log('asdasdasda')
        return NextResponse.json({
          isPerfect: true,
          p,
          digits
        });
      }
    }

    if (digits > length) break;
  }

  return NextResponse.json({ isPerfect: false });
}
