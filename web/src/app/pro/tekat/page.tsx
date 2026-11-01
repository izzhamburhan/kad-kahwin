import { Literata, Rozha_One, Sora } from "next/font/google";
import { TekatCard } from "@/components/pro/tekat/TekatCard";

const display = Rozha_One({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Literata({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Sora({ variable: "--font-d-ui", subsets: ["latin"] });

export default function TekatPage() {
  return <TekatCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
