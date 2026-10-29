import { Alegreya, Alegreya_Sans, Gloock } from "next/font/google";
import { KampungApp } from "@/components/kampung/KampungApp";

const display = Gloock({ variable: "--font-kampung-display", weight: "400", subsets: ["latin"] });
const body = Alegreya({ variable: "--font-kampung-body", weight: ["400", "500"], style: ["normal", "italic"], subsets: ["latin"] });
const ui = Alegreya_Sans({ variable: "--font-kampung-ui", weight: ["400", "500"], subsets: ["latin"] });

export default function KampungPage() {
  return <KampungApp fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}