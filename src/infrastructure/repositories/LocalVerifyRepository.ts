import { IVerifyRepository, VerifyNumberResponse } from "../../domain/repositories/IVerifyRepository";
import { MERSENNE_P } from "../../utils/mersenne";
import { digitsOfPerfect, perfectFromP } from "../../utils/digits";

const MAX_P_BIGINT = 107; // limite seguro no browser

export class LocalVerifyRepository implements IVerifyRepository {
  async verify(number: string): Promise<VerifyNumberResponse> {
    const input = number.trim();
    const normalized = input.replace(/^0+/, "") || "0";
    const digitCount = normalized.length;

    for (const p of MERSENNE_P) {
      const expectedDigits = digitsOfPerfect(p);

      if (digitCount === expectedDigits) {
        if (p <= MAX_P_BIGINT) {
          const perfect = perfectFromP(p);
          if (perfect.toString() === normalized) {
            return {
              isPerfect: true,
              checkedNumber: input,
              matchedP: p,
            };
          }
        }
      }
      if (digitCount < expectedDigits) break;
    }

    return {
      isPerfect: false,
      checkedNumber: input,
      matchedP: null,
    };
  }
}
