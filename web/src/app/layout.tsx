import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import { defaultWedding as w } from "@/lib/defaults";
import { formatDateShort } from "@/lib/format";
import "./globals.css";

const script = Pinyon_Script({ variable: "--font-script", weight: "400", subsets: ["latin"] });
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
const sans = Jost({ variable: "--font-sans", weight: ["300", "400", "500"], subsets: ["latin"] });
const arabic = Amiri({ variable: "--font-arabic", weight: "400", subsets: ["arabic"] });

const title = `${w.title.ms} ${w.couple.groomShort} & ${w.couple.brideShort}`;
const description = `${formatDateShort(w.start, "ms")} · ${w.venue.name}, ${w.venue.address}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, type: "website", locale: "ms_MY" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0d2b23",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ms" className={`${script.variable} ${serif.variable} ${sans.variable} ${arabic.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}