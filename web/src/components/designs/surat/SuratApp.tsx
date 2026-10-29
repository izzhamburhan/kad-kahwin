"use client";

import { AirmailEdge } from "../bands";
import { DesignShell, type DesignCtx } from "../DesignShell";
import { InviteBody } from "../InviteBody";
import { SuratScene } from "./SuratScene";

// The details are typed on a postcard pinned under the letter.
const Invite = ({ w, lang }: DesignCtx) => (
  <InviteBody
    w={w}
    lang={lang}
    top={
      <div className="absolute inset-x-0 top-0">
        <AirmailEdge />
      </div>
    }
    boardClass="rotate-[-1deg]"
    boardStyle={{ background: "#ffffff", boxShadow: "0 1px 0 rgba(27,42,107,.08), 0 18px 30px -18px rgba(27,42,107,.45)" }}
    dtClass="text-[#c8323b] uppercase tracking-wide !text-xs"
    ddClass="text-[#1b2a6b]"
    ddSubClass="text-[#3a4985]"
  />
);

/** /surat: a 90s airmail letter that unfolds as you scroll. */
export function SuratApp({ fontClass }: { fontClass: string }) {
  return <DesignShell theme="surat" fontClass={fontClass} rsvpClass="bg-bg-2" divider={<AirmailEdge />} Opening={SuratScene} Invite={Invite} />;
}