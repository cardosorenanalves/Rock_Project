import Button from "../../forms/Button";
import TextArea from "../../forms/TextArea";
import FindResults from "./FindResults";
import { useFindPerfectNumbers } from "../../../hooks/useFindPerfectNumbers";
import { abbreviateMiddle } from "../../../utils/format";

export function FindNumber() {
  const {
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    foundNumbers,
    isSearching,
    handleFind,
    error,
  } = useFindPerfectNumbers();

  return (
    <div className="space-y-6">
    <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
        Encontrar Números Perfeitos
        </h2>
        <p className="text-slate-500 text-sm mb-4">
        Digite um intervalo para buscar números perfeitos.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
            <label className="block text-slate-500 mb-2 text-sm">De (Início)</label>
            <TextArea
            inputMode="numeric"
            value={rangeStart}
            onChange={(e) => setRangeStart(e.target.value)}
            placeholder="Ex: 1"
            className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:border-transparent transition-all h-32 resize-y font-mono text-sm ${
                error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-primary"
            }`}
            />
        </div>
        <div>
            <label className="block text-slate-500 mb-2 text-sm">Até (Fim)</label>
            <TextArea
            inputMode="numeric"
            value={rangeEnd}
            onChange={(e) => setRangeEnd(e.target.value)}
            placeholder="Ex: 1000"
            className={`w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:border-transparent transition-all h-32 resize-y font-mono text-sm ${
                error
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:ring-primary"
            }`}
            />
        </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <Button
        onClick={handleFind}
        disabled={isSearching}
        loading={isSearching}
        className={`w-full font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
            isSearching
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-primary hover:opacity-90 text-slate-900"
        }`}
        >
        Buscar Números
        </Button>
    </div>

    <FindResults foundNumbers={foundNumbers} abbreviateMiddle={abbreviateMiddle} />
    </div>
  );
}