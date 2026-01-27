import { IVerifyRepository, VerifyNumberResponse } from "../repositories/IVerifyRepository";
import { MERSENNE_P } from "../../utils/mersenne";
import { digitsOfPerfect } from "../../utils/digits";

export class VerifyNumberUseCase {
  constructor(
    private localRepository: IVerifyRepository,
    private remoteRepository: IVerifyRepository
  ) {}

  async execute(number: string): Promise<VerifyNumberResponse> {
    const input = number.trim();
    const normalized = input.replace(/^0+/, "") || "0";
    const digitCount = normalized.length;
    const MAX_P_BIGINT = 107;

    // Lógica de decisão: Local ou Remoto?
    // Verifica qual seria o 'p' candidato baseado no tamanho
    let candidateP = null;
    for (const p of MERSENNE_P) {
      const expectedDigits = digitsOfPerfect(p);
      if (digitCount === expectedDigits) {
        candidateP = p;
        break;
      }
      if (digitCount < expectedDigits) break;
    }

    // Se achou um candidato P e ele é pequeno, usa Local
    if (candidateP && candidateP <= MAX_P_BIGINT) {
      return this.localRepository.verify(normalized);
    }

    // Caso contrário (P grande ou não encontrado candidato óbvio, mas pode ser verificação remota)
    // Na verdade, se não achou candidatoP pelo tamanho, já poderia retornar false aqui mesmo para economizar rede.
    // Mas vamos manter a lógica original que delegava.
    
    // Se não encontrou candidato pelo tamanho exato, já sabemos que não é perfeito (exceto se a formula de digits falhar, o que não deve acontecer)
    if (!candidateP) {
       return { isPerfect: false, checkedNumber: input, matchedP: null };
    }

    // Se o candidato é grande, delega para API (Remoto)
    return this.remoteRepository.verify(normalized);
  }
}
