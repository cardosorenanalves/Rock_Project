import { VerifyNumberUseCase } from "../domain/usecases/VerifyNumberUseCase";
import { LocalVerifyRepository } from "../infrastructure/repositories/LocalVerifyRepository";
import { RemoteVerifyRepository } from "../infrastructure/repositories/RemoteVerifyRepository";

// Factory/Singleton simples para instanciar o serviço
const localRepo = new LocalVerifyRepository();
const remoteRepo = new RemoteVerifyRepository();
const verifyUseCase = new VerifyNumberUseCase(localRepo, remoteRepo);

export const VerifyService = {
  verify: (number: string) => verifyUseCase.execute(number),
};
