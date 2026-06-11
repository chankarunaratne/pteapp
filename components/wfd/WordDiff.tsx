import type { ScoreResult, WordStatus } from "@/lib/scoring";

const STATUS_STYLES: Record<WordStatus, string> = {
  correct: "bg-green-100 text-green-800 border-green-200",
  misspelled: "bg-amber-100 text-amber-800 border-amber-200",
  missing: "bg-red-100 text-red-800 border-red-200",
  extra: "bg-slate-100 text-slate-500 border-slate-200 line-through",
};

const LEGEND: { status: WordStatus; en: string; si: string }[] = [
  { status: "correct", en: "Correct", si: "නිවැරදියි" },
  { status: "misspelled", en: "Misspelled", si: "අකුරු වැරදියි" },
  { status: "missing", en: "Missing", si: "මඟ හැරුණා" },
  { status: "extra", en: "Extra", si: "අමතර" },
];

export default function WordDiff({ score }: { score: ScoreResult }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {score.words.map((w, idx) => (
          <span
            key={idx}
            className={`inline-flex items-baseline gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium ${STATUS_STYLES[w.status]}`}
          >
            {w.status === "misspelled" ? (
              <>
                <s className="opacity-70">{w.typed}</s>
                <span>→ {w.word}</span>
              </>
            ) : w.status === "extra" ? (
              w.typed
            ) : (
              w.word
            )}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {LEGEND.map((item) => (
          <span key={item.status} className="inline-flex items-center gap-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full border ${STATUS_STYLES[item.status]}`}
            />
            {item.en} · <span className="sinhala">{item.si}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
