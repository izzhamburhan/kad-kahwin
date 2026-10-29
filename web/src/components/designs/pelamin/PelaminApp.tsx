"use client";

import { Garland } from "../bands";
import { DesignShell, type DesignCtx } from "../DesignShell";
import { InviteBody } from "../InviteBody";
import { PelaminScene } from "./PelaminScene";

// The details sit on a silk card with the same arched top as the pelamin backdrop.
const Invite = ({ w, lang }: DesignCtx) => (
  <InviteBody
    w={w}
    lang={lang}
    className="bg-bg-2"
    top={
      <div className="absolute inset-x-0 top-0">
        <Garland />
      </div>
    }
    boardClass="rounded-t-[9rem] !pt-24"
    boardStyle={{ background: "#fbf3e2", boxShadow: "inset 0 0 0 3px #e6b84a, inset 0 0 0 7px #fbf3e2, inset 0 0 0 8px #e6b84a, 0 20px 40px -20px rgba(0,0,0,.7)" }}
    dtClass="text-[#a77c1f]"
    ddClass="text-[#142a63]"
    ddSubClass="text-[#4a5a8c]"
  />
);

/** /pelamin: walking down the aisle to the bridal dais. */
export function PelaminApp({ fontClass }: { fontClass: string }) {
  return <DesignShell theme="pelamin" fontClass={fontClass} ambience="petals" rsvpClass="bg-bg-2" divider={<Garland />} Opening={PelaminScene} Invite={Invite} />;
}