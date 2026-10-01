import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Fragment_Mono } from "next/font/google";
import MatterSpoons from "@/components/MatterSpoons";

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
  title: "Page not found",
  description: "Nothing here but the 50+ spoons we've bent so far.",
};

export default function Home() {
  return (
    <div
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${fragmentMono.variable} relative h-dvh w-full overflow-hidden bg-black`}
    >
      <MatterSpoons />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-[family-name:var(--font-instrument-sans)] text-6xl leading-none tracking-tight text-white sm:text-8xl md:text-9xl">
          Page not{" "}
          <em className="font-[family-name:var(--font-instrument-serif)] italic tracking-tight text-[#c7ff9f]">
            found
          </em>
        </h1>
        <p className="mt-6 max-w-md font-[family-name:var(--font-instrument-sans)] text-[20px] font-normal leading-[1.41] tracking-[-0.03em] text-white sm:text-[26px] md:text-[32px]">
          Nothing here but the 50+ spoons we&rsquo;ve bent so far.
        </p>
        <a
          href="https://bendingspoons.com"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto mt-8 inline-block rounded-full border bg-white px-3 py-2 font-[family-name:var(--font-instrument-sans)] text-[14px] font-semibold leading-[1.3] tracking-[0.025em] text-black transition-all duration-300 ease-in-out hover:bg-black hover:text-white md:px-4.5 md:py-2.5 md:text-[16px]"
        >
          Return home
        </a>
      </div>
    </div>
  );
}
