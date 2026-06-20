"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

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
}: {
  icon: string;
  title: string;
  description: string;
  staggerClass: string;
}) {
  return (
    <div
      className={`${staggerClass} rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-2xl">
        {icon}
      </div>
      <h3 className="sinhala mb-2 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="sinhala text-sm leading-relaxed text-gray-500">
        {description}
      </p>
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
      {/*  SOLUTION / USP                                              */}
      {/* ============================================================ */}
      <section className="landing-section bg-white px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="stagger-1 mx-auto mb-14 max-w-2xl text-center">
            <h2 className="sinhala mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
              PTE සිංහලෙන් practice කරන්න පුළුවන්{" "}
              <span className="text-primary-600">
                එකම platform එක
              </span>
            </h2>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="🎧"
              title="සිංහලෙන් Feedback"
              description="ඔයාගේ answer submit කරාට පස්සේ, මොකද වැරදුනේ කියලා සිංහලෙන් පැහැදිලි කරනවා. ඉංග්‍රීසි වලින් තේරෙන්නැතුව struggle වෙන්න ඕනි නෑ."
              staggerClass="stagger-1"
            />
            <FeatureCard
              icon="📝"
              title="Real PTE Format"
              description="Actual PTE exam එකේ format එකටම practice කරන්න පුළුවන්. Exam එකේ දවසට surprise එකක් නෑ."
              staggerClass="stagger-2"
            />
            <FeatureCard
              icon="🆓"
              title="නොමිලේ Practice"
              description="දැන්ම practice කරන්න. Sign up ඕනි නෑ, payment ඕනි නෑ. ඔයාගේ PTE preparation අද පටන් ගන්න."
              staggerClass="stagger-3"
            />
          </div>

          {/* Image below cards */}
          <div className="stagger-4 mt-14">
            <ImagePlaceholder
              description="A close-up of a Sri Lankan person smiling while looking at their laptop screen. Soft glow of the screen visible. They look like they just understood something — relief and a small victory. Warm, optimistic lighting."
              aspectRatio="16/7"
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
