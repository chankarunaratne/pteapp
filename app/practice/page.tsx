import Link from "next/link";

const CATEGORIES = [
  {
    name: "Listening",
    description: "8 question types — Write From Dictation & more",
    href: "/practice/listening",
    enabled: true,
  },
  {
    name: "Reading",
    description: "Coming soon",
    href: "#",
    enabled: false,
  },
  {
    name: "Speaking & Writing",
    description: "Coming soon",
    href: "#",
    enabled: false,
  },
];

export default function PracticePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
      <p className="sinhala mt-2 text-sm text-slate-500">
        PTE Academic හි කොටස් 3ක් ඇත: Listening, Reading, Speaking & Writing. පහතින් ඇති එක් එක් කොටස පුහුණු වන්න.
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
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  Start
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{cat.description}</p>
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
            </div>
          )
        )}
      </div>
    </div>
  );
}
