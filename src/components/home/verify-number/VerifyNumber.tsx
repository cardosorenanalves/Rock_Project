import Button from "../../forms/Button";
import TextArea from "../../forms/TextArea";
import VerifyResultCard from "./VerifyResultCard";
import { useVerifyNumber } from "../../../hooks/useVerifyNumber";
import { abbreviateMiddle } from "../../../utils/format";

export function VerifyNumber() {
  const { number, setNumber, result, handleVerify, loading, error } = useVerifyNumber();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          É um número perfeito?
        </h2>
        <label className="block text-slate-500 mb-2">Digite um número</label>
        <TextArea
          inputMode="numeric"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Digite um número"
          className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:border-transparent transition-all h-32 resize-y font-mono text-sm ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-300 focus:ring-primary"
          }`}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      <Button
        onClick={handleVerify}
        loading={loading}
        disabled={loading}
        className={`w-full font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
          loading
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-primary hover:opacity-90 text-slate-900"
        }`}
      >
        Verificar
      </Button>

      <p className="text-slate-500 text-sm leading-relaxed">
        Um número perfeito é igual à soma de todos seus divisores positivos,
        exceto ele mesmo.
      </p>

      <VerifyResultCard result={result} abbreviateMiddle={abbreviateMiddle} />
    </div>
  );
}
