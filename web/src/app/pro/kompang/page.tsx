import { Fraunces, Parisienne, Plus_Jakarta_Sans } from "next/font/google";
import { KompangCard } from "@/components/pro/kompang/KompangCard";

// A festive script for the names, a warm soft serif for reading, a rounded sans for buttons.
const display = Parisienne({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Fraunces({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Plus_Jakarta_Sans({ variable: "--font-d-ui", subsets: ["latin"] });

export default function KompangPage() {
  return <KompangCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
