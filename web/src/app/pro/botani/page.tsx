import { Cormorant, Great_Vibes, Montserrat } from "next/font/google";
import { BotaniCard } from "@/components/pro/botani/BotaniCard";

const display = Great_Vibes({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Cormorant({ variable: "--font-d-body", weight: ["400", "500", "600"], style: ["normal", "italic"], subsets: ["latin"] });
const ui = Montserrat({ variable: "--font-d-ui", subsets: ["latin"] });

export default function BotaniPage() {
  return <BotaniCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
