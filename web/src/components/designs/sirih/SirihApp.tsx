"use client";

import { SirihBand } from "../bands";
import { DesignShell, type DesignCtx } from "../DesignShell";
import { InviteBody } from "../InviteBody";
import { SirihScene } from "./SirihScene";

// The details sit on a velvet board framed in a double brass rim, like the tepak's tray.
const Invite = ({ w, lang }: DesignCtx) => (
  <InviteBody
    w={w}
    lang={lang}
    className="bg-bg-2"
    top={
      <div className="absolute inset-x-0 top-0">
        <SirihBand />
      </div>
    }
    boardClass="rounded-[6px]"
    boardStyle={{
      background: "radial-gradient(120% 90% at 50% 0%, #3a1c44 0%, #26132c 70%)",
      boxShadow: "0 0 0 3px #26132c, 0 0 0 5px #d4a64a, 0 0 0 8px #26132c, 0 0 0 9px #8c6420, 0 20px 40px -20px rgba(0,0,0,.8)",
    }}
    dtClass="text-[#d4a64a]"
    ddClass="text-[#f6ead2]"
    ddSubClass="text-[#dac6a0]"
  />
);

/** /sirih: a tepak sirih opened cembul by cembul, the old way of welcoming a guest. */
export function SirihApp({ fontClass }: { fontClass: string }) {
  return <DesignShell theme="sirih" fontClass={fontClass} ambience="petals" rsvpClass="bg-bg-2" divider={<SirihBand />} Opening={SirihScene} Invite={Invite} />;
}