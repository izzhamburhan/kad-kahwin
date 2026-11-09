import { Italianno, Libre_Baskerville, Outfit } from "next/font/google";
import { CincinCard } from "@/components/pro/cincin/CincinCard";

const display = Italianno({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Libre_Baskerville({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Outfit({ variable: "--font-d-ui", subsets: ["latin"] });

export default function CincinPage() {
  return <CincinCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
