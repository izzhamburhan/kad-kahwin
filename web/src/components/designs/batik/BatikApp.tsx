"use client";

import { ParangBand } from "../bands";
import { DesignShell, type DesignCtx } from "../DesignShell";
import { InviteBody } from "../InviteBody";
import { BatikScene } from "./BatikScene";

// The details sit on a soga-dyed panel outlined in wax.
const Invite = ({ w, lang }: DesignCtx) => (
  <InviteBody
    w={w}
    lang={lang}
    className="bg-bg-2"
    top={
      <div className="absolute inset-x-0 top-0">
        <ParangBand />
      </div>
    }
    boardClass="rounded-[3px]"
    boardStyle={{ background: "#8a4b22", boxShadow: "inset 0 0 0 2px #f4ead6, inset 0 0 0 6px #8a4b22, inset 0 0 0 7px #f4ead6, 0 18px 30px -18px rgba(0,0,0,.7)" }}
    dtClass="text-[#f4d3a8]"
    ddClass="text-[#fbf3e4]"
    ddSubClass="text-[#f0d9b8]"
  />
);

/** /batik: the invitation drawn in wax with a canting, then dyed indigo and soga. */
export function BatikApp({ fontClass }: { fontClass: string }) {
  return <DesignShell theme="batik" fontClass={fontClass} rsvpClass="bg-bg-2" divider={<ParangBand />} Opening={BatikScene} Invite={Invite} />;
}