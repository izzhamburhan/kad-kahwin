import { Bellefair, Cardo, Karla } from "next/font/google";
import { BatikApp } from "@/components/designs/batik/BatikApp";

const display = Bellefair({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Cardo({ variable: "--font-d-body", weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"] });
const ui = Karla({ variable: "--font-d-ui", subsets: ["latin"] });

export default function BatikPage() {
  return <BatikApp fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}