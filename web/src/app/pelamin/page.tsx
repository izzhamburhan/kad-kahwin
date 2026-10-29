import { Gelasio, Italiana, Nunito_Sans } from "next/font/google";
import { PelaminApp } from "@/components/designs/pelamin/PelaminApp";

const display = Italiana({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Gelasio({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Nunito_Sans({ variable: "--font-d-ui", subsets: ["latin"] });

export default function PelaminPage() {
  return <PelaminApp fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}