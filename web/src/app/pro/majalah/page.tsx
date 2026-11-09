import { Libre_Franklin, Prata } from "next/font/google";
import { MajalahCard } from "@/components/pro/majalah/MajalahCard";

// Magazine pairing: a high-contrast display serif over a plain grotesque.
const display = Prata({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Libre_Franklin({ variable: "--font-d-body", subsets: ["latin"] });
const ui = Libre_Franklin({ variable: "--font-d-ui", subsets: ["latin"] });

export default function MajalahPage() {
  return <MajalahCard theme="pro-majalah" fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
