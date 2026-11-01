import { Lora, Manrope, Playfair_Display } from "next/font/google";
import { MihrabCard } from "@/components/pro/mihrab/MihrabCard";

const display = Playfair_Display({ variable: "--font-d-display", style: ["normal", "italic"], subsets: ["latin"] });
const body = Lora({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Manrope({ variable: "--font-d-ui", subsets: ["latin"] });

export default function MihrabPage() {
  return <MihrabCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}