"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

import ScoreOverview from "@/components/wfd/ScoreOverview";
import WordDiff from "@/components/wfd/WordDiff";
import FeedbackPanel from "@/components/wfd/FeedbackPanel";
import { scoreAnswer } from "@/lib/scoring";
import { WFD_QUESTIONS } from "@/lib/questions";

const MOCK_QUESTION = WFD_QUESTIONS[0];
const MOCK_SCORE = scoreAnswer(MOCK_QUESTION.sentence, "The libary will be closed during the summer holiday.");

/* ------------------------------------------------------------------ */
/*  Intersection Observer hook for scroll-triggered animations         */
/* ------------------------------------------------------------------ */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const sections = container.querySelectorAll(".landing-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Image placeholder component                                        */
/* ------------------------------------------------------------------ */

function ImagePlaceholder({
  description,
  aspectRatio = "4/3",
  className = "",
}: {
  description: string;
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div
      className={`img-placeholder ${className}`}
      style={{ aspectRatio }}
    >
      <p className="max-w-xs">📷 {description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card component                                             */
/* ------------------------------------------------------------------ */

function FeatureCard({
  icon,
  title,
  description,
  staggerClass,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  staggerClass: string;
  href?: string;
}) {
  const cardContent = (
    <>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="sinhala mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="sinhala text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </>
  );

  const className = `${staggerClass} group rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary-200 block`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={className}>
      {cardContent}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step card component                                                */
/* ------------------------------------------------------------------ */

function StepCard({
  step,
  title,
  description,
  staggerClass,
}: {
  step: string;
  title: string;
  description: string;
  staggerClass: string;
}) {
  return (
    <div className={`${staggerClass} text-center`}>
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
        {step}
      </div>
      <h3 className="sinhala mb-2 text-base font-semibold text-gray-900">
        {title}
      </h3>
      <p className="sinhala text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing page                                                       */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="flex flex-1 flex-col">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="landing-section is-visible bg-white px-6 pb-20 pt-16 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Copy */}
          <div>


            <h1 className="sinhala stagger-2 mb-6 text-4xl font-bold !leading-tight text-gray-900 lg:text-5xl lg:!leading-[1.15]">
              PTE සිංහලෙන් <br />
              <span className="whitespace-nowrap">ඉගෙනගෙන{" "}
              <span className="text-primary-600">පාස් වෙමු.</span></span>
            </h1>

            <p className="sinhala stagger-3 mb-8 max-w-lg text-lg leading-relaxed text-gray-500">
              PTE exam එකට prepare වෙන්න English resources මතම විතරක් depend
              වෙන්න ඕනි නෑ. ඔයාට familiar භාෂාවෙන් practice කරන්න, feedback
              ගන්න.
            </p>

            <div className="stagger-4 flex flex-wrap items-center gap-4">
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:-trangray-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-700/25"
              >
                <span className="sinhala">නොමිලේ Practice කරන්න</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="stagger-3 relative overflow-hidden rounded-lg border border-gray-200/60 shadow-2xl shadow-gray-900/10 aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
            <Image
              src="/images/hero-image.png"
              alt="PTE සිංහලෙන් ඉගෙනගෙන පාස් වෙමු"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TEACHER MODE SECTION                                        */}
      {/* ============================================================ */}
      <section className="landing-section bg-gray-50 px-6 py-20 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Copy */}
          <div className="stagger-1">
            <h2 className="sinhala mb-6 text-3xl font-bold !leading-tight text-gray-900 lg:text-4xl lg:!leading-[1.2]">
              english වලින් PTE කොච්චර practice කරත්, pass වෙන එක අමාරුද?
            </h2>
            <p className="sinhala text-lg leading-relaxed text-gray-500">
              සිද්ධ වුණ වැරදි මොනවද කියලා හොයාගෙන, ඒවා improve කරගන්න tips ලබාගන්න. මේ හැමදේම සිංහලෙන්.
            </p>
          </div>

          {/* Screenshot (Teacher Mode Component) */}
          <div className="stagger-2 relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white pt-6 px-6 pb-0 shadow-2xl shadow-gray-900/10 pointer-events-none select-none flex flex-col">
            <div className="mb-6 flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            
            <div className="max-h-[650px] overflow-hidden pb-12">
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                Teacher feedback
              </h2>

              <div className="mt-4">
                <ScoreOverview score={MOCK_SCORE} lang="si" />
              </div>

              {/* Sentence comparison */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="sinhala text-sm font-semibold text-gray-900">
                  වාක්‍ය විශ්ලේෂණය
                </h3>
                <div className="mt-3">
                  <WordDiff score={MOCK_SCORE} lang="si" />
                </div>
              </div>

              {/* Detailed explanation */}
              <div className="mt-6">
                <FeedbackPanel
                  score={MOCK_SCORE}
                  question={MOCK_QUESTION}
                  lang="si"
                />
              </div>
            </div>

            {/* Fade out bottom to look like a screenshot mask */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-white/0 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SOLUTION / USP                                              */}
      {/* ============================================================ */}
      <section className="landing-section bg-white px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="stagger-1 mx-auto mb-14 max-w-2xl text-center">
            <h2 className="sinhala mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              Exam එකට අවශ්‍ය හැමදේම <br />
              <span className="text-primary-600">
                එක තැනක
              </span>
            </h2>
            <p className="sinhala text-lg leading-relaxed text-gray-500">
              Format එක ගැන ඉගෙන ගන්න, questions practice කරන්න, <br />
              mock exams කරන්න.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="📖"
              title="Format එක ගැන ඉගෙන ගන්න"
              description="PTE exam එකේ structure එක, ප්‍රශ්න වර්ග සහ ලකුණු ලැබෙන විදිහ ගැන සම්පූර්ණ අවබෝධයක් ලබාගන්න."
              staggerClass="stagger-1"
              href="/pte-format"
            />
            <FeatureCard
              icon="📝"
              title="Questions practice කරන්න"
              description="Exam එකට නිතරම ලැබෙන real exam questions, Sinhala feedback සහ tips එක්කම practice කරන්න."
              staggerClass="stagger-2"
              href="/practice"
            />
            <FeatureCard
              icon="🎯"
              title="Mock exams කරන්න"
              description="නියම exam එකේ time limit සහ environment එකටම අනුව mock exams කරලා ඔයාගේ මට්ටම test කරගන්න."
              staggerClass="stagger-3"
              href="/mock-exam"
            />
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                */}
      {/* ============================================================ */}
      <section
        id="how-it-works"
        className="landing-section bg-gray-50 px-6 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="stagger-1 mb-14 text-center">
            <h2 className="sinhala mb-3 text-3xl font-bold text-gray-900 lg:text-4xl">
              Simple steps{" "}
              <span className="text-primary-600">3කින්</span> practice
              කරන්න
            </h2>
          </div>

          {/* Steps */}
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            <StepCard
              step="01"
              title="Question එක listen කරන්න 🎧"
              description="Audio question එක play වෙනවා. හොඳට listen කරන්න."
              staggerClass="stagger-1"
            />
            <StepCard
              step="02"
              title="ඔයාගේ answer එක type කරන්න ⌨️"
              description="ඔයා ඇහුවා type කරන්න. ඔයාට ඕනි තරම් වෙලාව ගන්න පුළුවන්."
              staggerClass="stagger-2"
            />
            <StepCard
              step="03"
              title="සිංහලෙන් feedback එක බලන්න ✅"
              description="ඔයාගේ mistakes සිංහලෙන් explain කරනවා. ඊළඟ question එකට improve වෙන්න."
              staggerClass="stagger-3"
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FINAL CTA                                                   */}
      {/* ============================================================ */}
      <section className="landing-section bg-white px-6 py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="sinhala stagger-1 mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            ඔයාගේ PTE journey එක{" "}
            <span className="text-primary-600">අද පටන් ගන්න</span>
          </h2>

          <p className="sinhala stagger-2 mb-10 text-lg text-gray-500">
            Sign up ඕනි නෑ. Payment ඕනි නෑ. දැන්ම practice කරන්න.
          </p>

          <div className="stagger-3">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:-trangray-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-700/25"
            >
              <span className="sinhala">නොමිලේ Practice කරන්න</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-gray-200/80 bg-gray-50 px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            {/* Logo & tagline */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  L
                </span>
                <span className="text-base font-semibold tracking-tight text-gray-900">
                  Lanka<span className="text-primary-600">PTE</span>
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-400">
                Built for Sri Lankan students 🇱🇰
              </p>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-sm">
              <div className="flex flex-col gap-2">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Platform
                </span>
                <Link
                  href="/practice"
                  className="text-gray-500 transition-colors hover:text-primary-600"
                >
                  Practice
                </Link>
                <Link
                  href="/pte-format"
                  className="text-gray-500 transition-colors hover:text-primary-600"
                >
                  PTE Format
                </Link>
                <Link
                  href="/course"
                  className="text-gray-500 transition-colors hover:text-primary-600"
                >
                  Course
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 border-t border-gray-200/80 pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} LankaPTE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
