import { NextRequest, NextResponse } from "next/server";
import { perfectFromP, digitsOfPerfect, getPerfectPrefix, getPerfectSuffix } from "../../../utils/digits";
import { MERSENNE_P } from "../../../utils/mersenne";

const MAX_SAFE_DIGITS = 150000; // Limite seguro para gerar BigInt completo

export async function POST(req: NextRequest) {
  const { number } = await req.json();

  if (!number || typeof number !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const cleanNumber = number.trim();
  const len = cleanNumber.length;

  for (const p of MERSENNE_P) {
    const digits = digitsOfPerfect(p);

    if (digits === len) {
      // 1. Tentar validação exata se o número for pequeno o suficiente
      if (digits <= MAX_SAFE_DIGITS) {
        try {
          const perfectBigInt = perfectFromP(p);
          const perfectStr = perfectBigInt.toString();

          if (perfectStr === cleanNumber) {
            return NextResponse.json({
              isPerfect: true,
              p,
              digits,
            });
          }
          // Se não bater, não é perfeito (pois digits bateu mas conteúdo não)
          // Mas como estamos iterando MERSENNE_P, e digits é único para cada P (crescente),
          // se não bater aqui, não é este P. E dificilmente será outro P com mesmo digits.
          // Continuamos o loop apenas por segurança.
          continue; 
        } catch (error) {
          console.error(`Erro ao gerar perfeito para p=${p} (fallback para híbrido):`, error);
          // Se der erro de memória mesmo abaixo do limite, cai no fallback
        }
      }

      // 2. Validação Híbrida (Prefixo + Sufixo) para números gigantes
      // Usada se digits > MAX_SAFE_DIGITS ou se a geração exata falhou
      const prefixLen = 5;
      const suffixLen = 15; // Sufixo maior para garantir unicidade com alta probabilidade

      try {
        const expectedPrefix = getPerfectPrefix(p, prefixLen);
        const expectedSuffix = getPerfectSuffix(p, suffixLen);

        const inputPrefix = cleanNumber.substring(0, prefixLen);
        const inputSuffix = cleanNumber.substring(cleanNumber.length - suffixLen);

        if (inputPrefix === expectedPrefix && inputSuffix === expectedSuffix) {
          return NextResponse.json({
            isPerfect: true,
            p,
            digits,
            method: "hybrid"
          });
        }
      } catch (err) {
        console.error(`Erro na validação híbrida para p=${p}:`, err);
      }
    }

    if (digits > len) break;
  }

  return NextResponse.json({ isPerfect: false });
}
