import Link from "next/link";

const QUESTION_TYPES = [
  {
    name: "Summarize Spoken Text",
    shortName: "SST",
    description: "Listen to a recording and write a summary in 50–70 words.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Multiple-choice, Choose Multiple Answers",
    shortName: "MCMA",
    description: "Listen to a recording and choose all correct responses.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Fill in the Blanks",
    shortName: "FIB",
    description: "Listen and fill in the missing words in a transcript.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Highlight Correct Summary",
    shortName: "HCS",
    description: "Listen and select the paragraph that best summarises the recording.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Multiple-choice, Choose Single Answer",
    shortName: "MCSA",
    description: "Listen to a recording and choose the single correct response.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Select Missing Word",
    shortName: "SMW",
    description: "Listen and select the missing word that completes the recording.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Highlight Incorrect Words",
    shortName: "HIW",
    description: "Listen and identify words in the transcript that differ from the recording.",
    href: "#",
    enabled: false,
    questionCount: 0,
  },
  {
    name: "Write from Dictation",
    shortName: "WFD",
    description: "Listen to a sentence and type it exactly as you hear it.",
    href: "/practice/listening/wfd",
    enabled: true,
    questionCount: 3,
  },
];

export default function ListeningPage() {
  return (
    <div>
      <div className="text-sm font-normal text-slate-400 flex items-center">
        <Link href="/practice" className="hover:text-slate-600 transition">
          Practice
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-600 font-medium">Listening</span>
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Listening</h1>
      <p className="sinhala mt-2 text-sm text-slate-500">
        Listening කොටසේ ප්‍රශ්න වර්ග 8ක් ඇත. පහතින් එකක් තෝරන්න.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUESTION_TYPES.map((qt) =>
          qt.enabled ? (
            <Link
              key={qt.shortName}
              href={qt.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">
                    {qt.name}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  {qt.questionCount} Qs
                </span>
              </div>
              <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
                {qt.description}
              </p>
            </Link>
          ) : (
            <div
              key={qt.shortName}
              className="rounded-2xl border border-slate-200 bg-slate-100/60 p-5"
              aria-disabled="true"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-slate-400">
                    {qt.name}
                  </h2>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Soon
                </span>
              </div>
              <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                {qt.description}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
