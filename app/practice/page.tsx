"use client";

import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type QuestionType = {
  name: string;
  shortName: string;
  description: string;
  href: string;
  enabled: boolean;
  questionCount: number;
};

type Category = {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  enabled: boolean;
  questionTypes: QuestionType[];
};

const CATEGORIES: Category[] = [
  {
    id: "speaking",
    name: "Speaking & Writing",
    subtitle:
      "Speaking & Writing කොටසේ ප්‍රශ්න වර්ග 9ක් ඇත. පහතින් එකක් තෝරන්න.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
        />
      </svg>
    ),
    enabled: true,
    questionTypes: [
      {
        name: "Read Aloud",
        shortName: "RA",
        description:
          "Read a text displayed on the screen aloud into the microphone.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Repeat Sentence",
        shortName: "RS",
        description:
          "Listen to a recording of a sentence and repeat it back exactly.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Describe Image",
        shortName: "DI",
        description: "Look at an image or chart and describe it in detail.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Retell Lecture",
        shortName: "RL",
        description: "Listen to a short lecture and retell it in your own words.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Answer Short Question",
        shortName: "ASQ",
        description:
          "Listen to a question and answer it with a single word or short phrase.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Summarize Group Discussion",
        shortName: "SGD",
        description:
          "Listen to a group discussion and write or speak a summary.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Respond to a Situation",
        shortName: "RTS",
        description:
          "Listen to a situation description and speak your response to it.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Summarize Written Text",
        shortName: "SWT",
        description:
          "Read a text and write a one-sentence summary in 5–75 words.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Write Essay",
        shortName: "WE",
        description:
          "Write a 200–300 word argumentative essay on a given topic.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
    ],
  },
  {
    id: "reading",
    name: "Reading",
    subtitle: "Reading කොටසේ ප්‍රශ්න වර්ග 5ක් ඇත. පහතින් එකක් තෝරන්න.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    enabled: true,
    questionTypes: [
      {
        name: "Fill in the Blanks (Dropdown)",
        shortName: "FIB-D",
        description:
          "Read a text with blanks and select the correct words from dropdown menus.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Multiple Choice, Multiple Answers",
        shortName: "MCMA",
        description:
          "Read a text and answer the multiple-choice question by selecting all correct options.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Reorder Paragraph",
        shortName: "RP",
        description:
          "Arrange the text boxes in the correct order to reconstruct the original text.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Fill in the Blanks (Drag and Drop)",
        shortName: "FIB-DD",
        description:
          "Drag words from the box and drop them into the correct blanks in the text.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Multiple Choice, Single Answer",
        shortName: "MCSA",
        description:
          "Read a text and answer the multiple-choice question by selecting the single correct option.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
    ],
  },
  {
    id: "listening",
    name: "Listening",
    subtitle:
      "Listening කොටසේ ප්‍රශ්න වර්ග 8ක් ඇත. පහතින් එකක් තෝරන්න.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
        />
      </svg>
    ),
    enabled: true,
    questionTypes: [
      {
        name: "Summarize Spoken Text",
        shortName: "SST",
        description:
          "Listen to a recording and write a summary in 50–70 words.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Multiple-choice, Choose Multiple Answers",
        shortName: "MCMA",
        description:
          "Listen to a recording and choose all correct responses.",
        href: "/practice/listening/mcma",
        enabled: true,
        questionCount: 2,
      },
      {
        name: "Fill in the Blanks",
        shortName: "FIB",
        description:
          "Listen and fill in the missing words in a transcript.",
        href: "/practice/listening/lfib",
        enabled: true,
        questionCount: 1,
      },
      {
        name: "Highlight Correct Summary",
        shortName: "HCS",
        description:
          "Listen and select the paragraph that best summarises the recording.",
        href: "/practice/listening/hcs",
        enabled: true,
        questionCount: 1,
      },
      {
        name: "Multiple-choice, Choose Single Answer",
        shortName: "MCSA",
        description:
          "Listen to a recording and choose the single correct response.",
        href: "/practice/listening/mcsa",
        enabled: true,
        questionCount: 2,
      },
      {
        name: "Select Missing Word",
        shortName: "SMW",
        description:
          "Listen and select the missing word that completes the recording.",
        href: "#",
        enabled: false,
        questionCount: 0,
      },
      {
        name: "Highlight Incorrect Words",
        shortName: "HIW",
        description:
          "Listen and identify words in the transcript that differ from the recording.",
        href: "/practice/listening/hiw",
        enabled: true,
        questionCount: 1,
      },
      {
        name: "Write from Dictation",
        shortName: "WFD",
        description:
          "Listen to a sentence and type it exactly as you hear it.",
        href: "/practice/listening/wfd",
        enabled: true,
        questionCount: 3,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Lock icon (shared)                                                 */
/* ------------------------------------------------------------------ */

function LockIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Question-type card                                                 */
/* ------------------------------------------------------------------ */

function QuestionCard({ qt }: { qt: QuestionType }) {
  if (qt.enabled) {
    return (
      <Link
        href={qt.href}
        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-500 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">
              {qt.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            {qt.questionCount} Qs
          </span>
        </div>
        <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
          {qt.description}
        </p>
      </Link>
    );
  }

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-slate-100/60 p-5"
      aria-disabled="true"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-400">
            {qt.name}
          </h3>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500">
          <LockIcon />
          Soon
        </span>
      </div>
      <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
        {qt.description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Coming-soon placeholder                                            */
/* ------------------------------------------------------------------ */

function ComingSoonPanel({ category }: { category: Category }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
        <LockIcon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-400">Coming Soon</h3>
      <p className="sinhala mt-2 max-w-sm text-sm text-slate-400">
        {category.subtitle}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState("speaking");
  const activeCategory = CATEGORIES.find((c) => c.id === activeTab)!;

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight">Practice</h1>
      <p className="sinhala mt-2 text-sm text-slate-500">
        PTE Academic හි කොටස් 3ක් ඇත: Listening, Reading, Speaking &amp;
        Writing. පහතින් ඇති එක් එක් කොටස පුහුණු වන්න. Format එක පිළිබඳ
        වැඩිදුර තොරතුරු සඳහා{" "}
        <Link href="/pte-format" className="text-brand-600 hover:underline">
          PTE format
        </Link>{" "}
        එක බලන්න.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-slate-200">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === activeTab;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
                rounded-t-lg cursor-pointer
                ${
                  isActive
                    ? "text-brand-700 bg-brand-50/60"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }
              `}
            >
              {cat.icon}
              <span>{cat.name}</span>
              {!cat.enabled && (
                <LockIcon className="h-3 w-3 text-slate-400" />
              )}
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab subtitle */}
      {activeCategory.enabled && (
        <p className="sinhala mt-5 text-sm text-slate-500">
          {activeCategory.subtitle}
        </p>
      )}

      {/* Tab content */}
      <div className="mt-4">
        {activeCategory.enabled && activeCategory.questionTypes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {activeCategory.questionTypes.map((qt) => (
              <QuestionCard key={qt.shortName} qt={qt} />
            ))}
          </div>
        ) : (
          <ComingSoonPanel category={activeCategory} />
        )}
      </div>
    </div>
  );
}
