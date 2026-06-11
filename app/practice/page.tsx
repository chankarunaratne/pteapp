import Link from "next/link";

const CATEGORIES = [
  {
    name: "Listening",
    nameSi: "සවන්දීම",
    description: "Write From Dictation — 3 questions",
    descriptionSi: "ඇහෙන වාක්‍යය ලියන්න — ප්‍රශ්න 3යි",
    href: "/practice/wfd",
    enabled: true,
  },
  {
    name: "Reading",
    nameSi: "කියවීම",
    description: "Coming soon",
    descriptionSi: "ළඟදීම",
    href: "#",
    enabled: false,
  },
  {
    name: "Writing",
    nameSi: "ලිවීම",
    description: "Coming soon",
    descriptionSi: "ළඟදීම",
    href: "#",
    enabled: false,
  },
  {
    name: "Speaking",
    nameSi: "කථනය",
    description: "Coming soon",
    descriptionSi: "ළඟදීම",
    href: "#",
    enabled: false,
  },
];

export default function PracticePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
      <p className="mt-2 text-slate-600">
        Choose a section to start practising.
      </p>
      <p className="sinhala mt-1 text-sm text-slate-500">
        පුහුණු වෙන්න කොටසක් තෝරන්න. දැනට විවෘතව ඇත්තේ Listening කොටස පමණයි.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CATEGORIES.map((cat) =>
          cat.enabled ? (
            <Link
              key={cat.name}
              href={cat.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
                    {cat.name}
                  </h2>
                  <p className="sinhala text-sm text-slate-500">{cat.nameSi}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  Start
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{cat.description}</p>
              <p className="sinhala mt-0.5 text-sm text-slate-500">
                {cat.descriptionSi}
              </p>
            </Link>
          ) : (
            <div
              key={cat.name}
              className="rounded-2xl border border-slate-200 bg-slate-100/60 p-6"
              aria-disabled="true"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-400">
                    {cat.name}
                  </h2>
                  <p className="sinhala text-sm text-slate-400">{cat.nameSi}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500">
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
                  Locked
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-400">{cat.description}</p>
              <p className="sinhala mt-0.5 text-sm text-slate-400">
                {cat.descriptionSi}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
