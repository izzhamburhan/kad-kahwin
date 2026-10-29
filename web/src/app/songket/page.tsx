import { Marcellus, Mulish, Spectral } from "next/font/google";
import { SongketApp } from "@/components/designs/songket/SongketApp";

const display = Marcellus({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Spectral({ variable: "--font-d-body", weight: ["400", "500"], style: ["normal", "italic"], subsets: ["latin"] });
const ui = Mulish({ variable: "--font-d-ui", subsets: ["latin"] });

export default function SongketPage() {
  return <SongketApp fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}