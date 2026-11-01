import { Geist, Instrument_Serif } from "next/font/google";
import { RingkasCard } from "@/components/pro/ringkas/RingkasCard";

const display = Instrument_Serif({ variable: "--font-d-display", weight: "400", style: ["normal", "italic"], subsets: ["latin"] });
// One sans for both reading and labels: the card is set in two voices only.
const body = Geist({ variable: "--font-d-body", subsets: ["latin"] });
const ui = Geist({ variable: "--font-d-ui", subsets: ["latin"] });

export default function RingkasPage() {
  return <RingkasCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}