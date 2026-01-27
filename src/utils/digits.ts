  // 🔢 Quantidade de dígitos de um número perfeito dado p
 export function digitsOfPerfect(p: number){
  return Math.floor((2 * p - 1) * Math.log10(2)) + 1;
};

// 🧮 Gera número perfeito via BigInt (só para p pequenos)
export function perfectFromP(p: number) {
  const two = BigInt(2);
  return (two ** BigInt(p - 1)) * ((two ** BigInt(p)) - BigInt(1));
};

// Helper para exponenciação modular
function modPow(base: bigint, exp: bigint, modulus: bigint) {
  let result = BigInt(1);
  base %= modulus;
  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exp /= BigInt(2);
  }
  return result;
}

// Retorna os últimos N dígitos do número perfeito gerado por p
export function getPerfectSuffix(p: number, length: number): string {
  const mod = BigInt(10) ** BigInt(length);
  const two = BigInt(2);
  
  const term1 = modPow(two, BigInt(p - 1), mod);
  const term2 = (modPow(two, BigInt(p), mod) - BigInt(1) + mod) % mod;
  
  const suffixBig = (term1 * term2) % mod;
  return suffixBig.toString().padStart(length, '0');
}

// Retorna os primeiros N dígitos (aproximados) do número perfeito gerado por p
// Nota: A precisão diminui para p muito grandes devido a limitações de ponto flutuante.
// Recomendado usar length pequeno (ex: 3 a 5).
export function getPerfectPrefix(p: number, length: number): string {
  const log2 = Math.log10(2);
  const logVal = (2 * p - 1) * log2;
  const fractional = logVal - Math.floor(logVal);
  
  const prefixVal = Math.pow(10, fractional) * Math.pow(10, length - 1);
  return Math.floor(prefixVal).toString();
}