import { Albert_Sans, Bodoni_Moda, Libre_Caslon_Text } from "next/font/google";
import { MarmarCard } from "@/components/pro/marmar/MarmarCard";

const display = Bodoni_Moda({ variable: "--font-d-display", style: ["normal", "italic"], subsets: ["latin"] });
const body = Libre_Caslon_Text({ variable: "--font-d-body", weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"] });
const ui = Albert_Sans({ variable: "--font-d-ui", subsets: ["latin"] });

export default function MarmarPage() {
  return <MarmarCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
