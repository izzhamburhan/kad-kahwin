import { Courier_Prime, Nanum_Pen_Script, Source_Serif_4 } from "next/font/google";
import { SuratApp } from "@/components/designs/surat/SuratApp";

const display = Nanum_Pen_Script({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Source_Serif_4({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Courier_Prime({ variable: "--font-d-ui", weight: ["400", "700"], subsets: ["latin"] });

export default function SuratPage() {
  return <SuratApp fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}