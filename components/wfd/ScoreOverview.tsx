import type { FeedbackLang } from "@/lib/feedback";
import type { ScoreResult } from "@/lib/scoring";

const RING_SIZE = 96;
const STROKE_WIDTH = 7;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreHeading(pct: number, lang: FeedbackLang): string {
  if (lang === "si") {
    if (pct === 100) return "සම්පූර්ණයි!";
    if (pct >= 80) return "ගොඩක් හොඳයි!";
    if (pct >= 50) return "හොඳටම ළඟයි!";
    return "තව පුහුණු වෙන්න";
  }
  if (pct === 100) return "Perfect!";
  if (pct >= 80) return "Great job!";
  if (pct >= 50) return "Almost there!";
  return "Keep practicing";
}

function getScoreMessage(pct: number, lang: FeedbackLang): string {
  if (lang === "si") {
    if (pct === 100) return "සියලුම වචන නිවැරදියි. හරිම දක්ෂයි!";
    if (pct >= 80) return "පොඩි වැරදි ටිකක් තියෙනවා. පහළින් බලන්න.";
    if (pct >= 50) return "තව ටිකක් උත්සාහ කරන්න. මඟ හැරුණු වචන පහළින් බලන්න.";
    return "මඟ හැරුණු වචන පහළින් බලලා තව පුහුණු වෙන්න.";
  }
  if (pct === 100) return "Perfect score! You nailed every word.";
  if (pct >= 80)
    return "Great job! Just a few small slips. Review the breakdown below.";
  if (pct >= 50)
    return "You're getting closer. Review the breakdown below to see exactly what you missed.";
  return "Keep practicing. Check the breakdown below and focus on the words you missed.";
}

function getScoreColor(pct: number) {
  if (pct >= 80) return { ring: "#22c55e", text: "text-green-600" };
  if (pct >= 50) return { ring: "#f59e0b", text: "text-amber-600" };
  return { ring: "#ef4444", text: "text-red-600" };
}

const BADGE_STYLES: Record<string, string> = {
  misspelled: "bg-amber-50 text-amber-700 border-amber-200",
  missing: "bg-red-50 text-red-700 border-red-200",
  extra: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function ScoreOverview({ score, lang }: { score: ScoreResult; lang: FeedbackLang }) {
  const pct =
    score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
  const { ring, text } = getScoreColor(pct);

  const misspelledCount = score.words.filter(
    (w) => w.status === "misspelled"
  ).length;
  const missingCount = score.words.filter(
    (w) => w.status === "missing"
  ).length;
  const extraCount = score.words.filter((w) => w.status === "extra").length;

  const badges = [
    { label: lang === "si" ? "අකුරු වැරදියි" : "Misspelled", count: misspelledCount, key: "misspelled" },
    { label: lang === "si" ? "මඟ හැරුණා" : "Missing", count: missingCount, key: "missing" },
    { label: lang === "si" ? "අමතර" : "Extra", count: extraCount, key: "extra" },
  ].filter((b) => b.count > 0);

  return (
    <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
      {/* Ring */}
      <div className="relative shrink-0">
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-slate-200"
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={ring}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${text}`}
        >
          {pct}%
        </span>
      </div>

      {/* Text + badges */}
      <div className="min-w-0 flex-1">
        <h2 className={`text-base font-semibold text-slate-900 ${lang === "si" ? "sinhala" : ""}`}>
          {getScoreHeading(pct, lang)}
        </h2>
        <p className={`mt-0.5 text-sm leading-snug text-slate-500 ${lang === "si" ? "sinhala" : ""}`}>
          {getScoreMessage(pct, lang)}
        </p>

        {badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.key}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLES[b.key]} ${lang === "si" ? "sinhala" : ""}`}
              >
                {b.label}
                <span className="font-bold">{b.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
