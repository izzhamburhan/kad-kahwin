import { Alice, Gilda_Display, Josefin_Sans } from "next/font/google";
import { PurnamaCard } from "@/components/pro/purnama/PurnamaCard";

const display = Gilda_Display({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Alice({ variable: "--font-d-body", weight: "400", subsets: ["latin"] });
const ui = Josefin_Sans({ variable: "--font-d-ui", subsets: ["latin"] });

export default function PurnamaPage() {
  return <PurnamaCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
