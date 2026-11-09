import { Ibarra_Real_Nova, Tenor_Sans } from "next/font/google";
import { SuteraCard } from "@/components/pro/sutera/SuteraCard";

// A printed suite: one book face for display and reading, a quiet sans for the tabs and buttons.
const display = Ibarra_Real_Nova({ variable: "--font-d-display", style: ["normal", "italic"], subsets: ["latin"] });
const body = Ibarra_Real_Nova({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Tenor_Sans({ variable: "--font-d-ui", weight: "400", subsets: ["latin"] });

export default function SuteraPage() {
  return <SuteraCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
