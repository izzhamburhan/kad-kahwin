import { Allura, Gentium_Book_Plus, Lexend } from "next/font/google";
import { TropikaCard } from "@/components/pro/tropika/TropikaCard";

const display = Allura({ variable: "--font-d-display", weight: "400", subsets: ["latin"] });
const body = Gentium_Book_Plus({ variable: "--font-d-body", weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"] });
const ui = Lexend({ variable: "--font-d-ui", subsets: ["latin"] });

export default function TropikaPage() {
  return <TropikaCard fontClass={`${display.variable} ${body.variable} ${ui.variable}`} />;
}
