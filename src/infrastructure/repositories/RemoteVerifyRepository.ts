import { IVerifyRepository, VerifyNumberResponse } from "../../domain/repositories/IVerifyRepository";

export class RemoteVerifyRepository implements IVerifyRepository {
  async verify(number: string): Promise<VerifyNumberResponse> {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify number remotely");
    }

    return response.json();
  }
}
