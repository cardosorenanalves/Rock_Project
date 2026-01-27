import { VerifyNumberUseCase } from "../usecases/VerifyNumberUseCase";

const verifyUseCase = new VerifyNumberUseCase();

export const VerifyService = {
  verify: (number: string) => verifyUseCase.execute(number),
};
