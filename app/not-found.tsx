import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Sans, Instrument_Serif, Fragment_Mono } from "next/font/google";
import SpoonCluster from "@/components/SpoonCluster";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  variable: "--font-instrument-serif",
});
const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment-mono",
});

export const metadata: Metadata = {
  title: "404 – Page Not Found | Bending Spoons",
  description: "This page doesn't exist. Head back to bendingspoons.com.",
};

const CORNER_TEXT: {
  text: string;
  className: string;
  color: string;
}[] = [
  {
    text: "BENDING SPOONS",
    className: "-top-4 -left-6 md:-top-6 md:-left-10 -rotate-3 skew-y-[-4deg]",
    color: "text-[#9ff2c4]",
  },
  {
    text: "PAGE NOT FOUND",
    className: "-top-4 -right-6 md:-top-6 md:-right-10 rotate-2 skew-y-[3deg]",
    color: "text-[#f8c7dc]",
  },
  {
    text: "COME BACK SOON",
    className: "-bottom-4 -left-6 md:-bottom-6 md:-left-10 rotate-2 skew-y-[3deg]",
    color: "text-[#f9e491]",
  },
  {
    text: "PAGE NOT FOUND",
    className: "-bottom-4 -right-6 md:-bottom-6 md:-right-10 -rotate-3 skew-y-[-4deg]",
    color: "text-[#9ff2c4]",
  },
];

export default function NotFound() {
  return (
    <div
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${fragmentMono.variable} relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FFE3E3] p-6 md:p-10`}
    >
      {CORNER_TEXT.map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`pointer-events-none absolute z-0 whitespace-nowrap font-[family-name:var(--font-instrument-sans)] text-4xl font-bold italic uppercase leading-none tracking-tight opacity-90 sm:text-6xl md:text-8xl ${c.className} ${c.color}`}
        >
          {c.text}
        </span>
      ))}

      <div className="relative z-10 grid w-full max-w-5xl animate-[card-in_0.6s_ease-out] grid-cols-1 overflow-hidden rounded-[36px] shadow-2xl md:grid-cols-2 md:rounded-[50px]">
        {/* Left panel */}
        <div className="flex min-h-[420px] flex-col justify-between bg-white p-8 sm:p-10 md:p-12">
          <div>
            <h1 className="font-[family-name:var(--font-instrument-sans)] text-6xl font-bold uppercase leading-[0.85] tracking-tight text-black sm:text-7xl">
              <span className="block">THIS PAGE</span>
              <span className="block">GOT</span>
              <span className="block">BENT</span>
            </h1>

            <Link
              href="/"
              className="mt-6 inline-block font-[family-name:var(--font-fragment-mono)] text-sm uppercase tracking-wide text-black underline decoration-1 underline-offset-4 transition-[text-underline-offset] hover:underline-offset-[6px]"
            >
              Back to bendingspoons.com &rarr;
            </Link>
          </div>

          <div className="mt-16 max-w-sm font-[family-name:var(--font-fragment-mono)] text-xs uppercase leading-relaxed tracking-wide text-zinc-700">
            <p>
              Bending Spoons builds apps used by millions of people. This
              page, however, doesn&rsquo;t exist &mdash; 404, not bent, just
              missing.
            </p>
            <a
              href="mailto:careers@bendingspoons.com"
              className="mt-4 inline-block text-zinc-700 underline decoration-1 underline-offset-4 transition-[text-underline-offset] hover:underline-offset-[6px]"
            >
              careers@bendingspoons.com
            </a>
          </div>
        </div>

        {/* Right panel */}
        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-black">
          <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-center">
            <span className="font-[family-name:var(--font-instrument-serif)] text-8xl italic leading-none text-[#8fe3b0] opacity-90 sm:text-9xl">
              404
            </span>
            <span className="font-[family-name:var(--font-instrument-serif)] text-3xl italic leading-none text-[#8fe3b0] opacity-70 sm:text-4xl">
              bent.
            </span>
          </div>

          <div className="relative z-10 h-full w-full max-w-[520px] p-6">
            <SpoonCluster />
          </div>
        </div>
      </div>
    </div>
  );
}
