import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// "Spartan" (the font used by the reference design) was renamed on Google Fonts
// and is no longer in next/font's catalogue, so its variable latin file is self-hosted.
const spartan = localFont({
  src: "./fonts/spartan-latin-var.woff2",
  variable: "--font-spartan",
  weight: "100 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Only used by the leaderboard message, so it is not preloaded.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["500"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "ITLegend Courses",
    template: "%s | ITLegend",
  },
  description: "Browse your courses and continue learning in the ITLegend course player.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spartan.variable} ${poppins.variable} ${plexArabic.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
