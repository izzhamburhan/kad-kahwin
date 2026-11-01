import { EB_Garamond, Figtree, Forum } from "next/font/google";
import { SirihApp } from "@/components/designs/sirih/SirihApp";

const display = Forum({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = EB_Garamond({ variable: "--font-d-body", style: ["normal", "italic"], subsets: ["latin"] });
const ui = Figtree({ variable: "--font-d-ui", subsets: ["latin"] });

export default function SirihPage() {
  return <SirihApp fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}