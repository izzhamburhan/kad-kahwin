import { Crimson_Pro, DM_Sans, Pinyon_Script } from "next/font/google";
import { SenjaCard } from "@/components/pro/senja/SenjaCard";

const display = Pinyon_Script({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Crimson_Pro({ variable: "--font-d-body", subsets: ["latin"] });
const ui = DM_Sans({ variable: "--font-d-ui", subsets: ["latin"] });

export default function SenjaPage() {
  return <SenjaCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}