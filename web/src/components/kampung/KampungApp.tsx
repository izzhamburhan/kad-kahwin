"use client";

import { DesignShell, type DesignCtx } from "../designs/DesignShell";
import { KampungInvite } from "./KampungInvite";
import { TikarBand } from "./motifs";
import { Scene } from "./Scene";

const Opening = ({ w, lang, guest, reduced, enter }: DesignCtx) => <Scene w={w} lang={lang} guest={guest} reduced={reduced} onEnter={enter} />;
const Invite = ({ w, lang }: DesignCtx) => <KampungInvite w={w} lang={lang} />;

/** /kampung: the invitation told as an evening walk up to a kampung house. */
export function KampungApp({ fontClass }: { fontClass: string }) {
  return (
    <DesignShell
      theme="kampung"
      fontClass={fontClass}
      ambience="fireflies"
      rsvpClass="papan"
      divider={<TikarBand />}
      Opening={Opening}
      Invite={Invite}
    />
  );
}
