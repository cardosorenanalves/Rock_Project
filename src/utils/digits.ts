  // 🔢 Quantidade de dígitos de um número perfeito dado p
 export function digitsOfPerfect(p: number){
    return Math.floor((2 * p - 1) * Math.log10(2)) + 1;
  };

  // 🧮 Gera número perfeito via BigInt (só para p pequenos)
export function perfectFromP(p: number) {
    const two = BigInt(2);
    return (two ** BigInt(p - 1)) * ((two ** BigInt(p)) - BigInt(1));
  };