"use client";

import { SongketWeave } from "../bands";
import { DesignShell, type DesignCtx } from "../DesignShell";
import { InviteBody } from "../InviteBody";
import { SongketScene } from "./SongketScene";

const Invite = ({ w, lang }: DesignCtx) => (
  <InviteBody
    w={w}
    lang={lang}
    className="bg-bg-2"
    top={<div className="absolute inset-x-0 top-0"><SongketWeave height={22} /></div>}
    boardClass="border border-[#d9a441]"
    boardStyle={{
      background: "repeating-linear-gradient(90deg, rgba(243,210,138,.05) 0 1px, transparent 1px 6px), #3a0a17",
      boxShadow: "0 0 0 4px #3a0a17, 0 0 0 5px #8f6420, 0 18px 30px -18px rgba(0,0,0,.8)",
    }}
    dtClass="text-[#d9a441]"
    ddClass="text-[#f7e7c6]"
    ddSubClass="text-[#dcc095]"
  />
);

/** /songket: the invitation woven into a length of gold-thread songket. */
export function SongketApp({ fontClass }: { fontClass: string }) {
  return (
    <DesignShell
      theme="songket"
      fontClass={fontClass}
      ambience="dust"
      rsvpClass="bg-bg-2"
      divider={<SongketWeave />}
      Opening={SongketScene}
      Invite={Invite}
    />
  );
}