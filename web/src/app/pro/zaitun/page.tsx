import { Libre_Franklin, Prata } from "next/font/google";
import { MajalahCard } from "@/components/pro/majalah/MajalahCard";

// The Majalah layout in pastel olive; same faces as /pro/majalah.
const display = Prata({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Libre_Franklin({ variable: "--font-d-body", subsets: ["latin"] });
const ui = Libre_Franklin({ variable: "--font-d-ui", subsets: ["latin"] });

export default function ZaitunPage() {
  return <MajalahCard theme="pro-zaitun" fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
