import { Alex_Brush, Rosarivo, Work_Sans } from "next/font/google";
import { BingkaiCard } from "@/components/pro/bingkai/BingkaiCard";

const display = Alex_Brush({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Rosarivo({ variable: "--font-d-body", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Work_Sans({ variable: "--font-d-ui", subsets: ["latin"] });

export default function BingkaiPage() {
  return <BingkaiCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
