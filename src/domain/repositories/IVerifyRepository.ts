export interface VerifyNumberResponse {
  isPerfect: boolean;
  checkedNumber?: string;
  matchedP?: number | null;
  method?: string;
  digits?: number;
}

export interface VerifyNumberRequest {
  number: string;
}

export interface IVerifyRepository {
  verify(number: string): Promise<VerifyNumberResponse>;
}
