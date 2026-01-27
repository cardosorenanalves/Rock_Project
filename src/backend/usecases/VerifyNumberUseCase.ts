import { perfectFromP, digitsOfPerfect, getPerfectPrefix, getPerfectSuffix } from "../../utils/digits";
import { MERSENNE_P } from "../../utils/mersenne";

export interface VerifyNumberBackendResponse {
  isPerfect: boolean;
  p?: number;
  digits?: number;
  method?: "hybrid" | "exact";
}

const MAX_SAFE_DIGITS = 150000;

export class VerifyNumberUseCase {
  execute(number: string): VerifyNumberBackendResponse {
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
              return {
                isPerfect: true,
                p,
                digits,
                method: "exact"
              };
            }
            // Se não bater, não é perfeito (pois digits bateu mas conteúdo não)
            continue;
          } catch (error) {
            console.error(`Erro ao gerar perfeito para p=${p} (fallback para híbrido):`, error);
          }
        }

        // 2. Validação Híbrida (Prefixo + Sufixo) para números gigantes
        const prefixLen = 5;
        const suffixLen = 15;

        try {
          const expectedPrefix = getPerfectPrefix(p, prefixLen);
          const expectedSuffix = getPerfectSuffix(p, suffixLen);

          const inputPrefix = cleanNumber.substring(0, prefixLen);
          const inputSuffix = cleanNumber.substring(cleanNumber.length - suffixLen);

          if (inputPrefix === expectedPrefix && inputSuffix === expectedSuffix) {
            return {
              isPerfect: true,
              p,
              digits,
              method: "hybrid"
            };
          }
        } catch (err) {
          console.error(`Erro na validação híbrida para p=${p}:`, err);
        }
      }

      if (digits > len) break;
    }

    return { isPerfect: false };
  }
}
