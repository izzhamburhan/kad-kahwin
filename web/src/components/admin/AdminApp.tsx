"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { isDemo, supabase } from "@/lib/data";
import { Dashboard } from "./Dashboard";

/** Supabase mode: sign in and confirm the email is listed in `admins`. Demo mode: open, data is local. */
export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [ready, setReady] = useState(isDemo);

  useEffect(() => {
    document.documentElement.dataset.theme = "gading";
    if (isDemo) return;
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isDemo || !session) return;
    supabase()
      .from("admins")
      .select("email")
      .maybeSingle()
      .then(({ data }) => setAllowed(!!data));
  }, [session]);

  return (
    <div
      className="min-h-dvh bg-[#f2f2f7] text-stone-900 antialiased"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif' }}
    >
      {!ready ? null : isDemo ? (
        <Dashboard />
      ) : !session ? (
        <Login />
      ) : allowed === false ? (
        <Shell>
          <p className="text-center text-stone-600">
            {session.user.email} tiada akses. Tambah emel ini ke jadual <code>admins</code> di Supabase.
          </p>
          <button type="button" onClick={() => supabase().auth.signOut()} className="mx-auto mt-4 block text-emerald-700">
            Log keluar
          </button>
        </Shell>
      ) : allowed ? (
        <Dashboard onSignOut={() => supabase().auth.signOut()} email={session.user.email} />
      ) : null}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5">{children}</div>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase().auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <Shell>
      <h1 className="text-center text-[2rem] font-semibold tracking-tight">Pengurus Majlis</h1>
      <p className="mt-1 text-center text-sm text-stone-500">Log masuk untuk mengurus jemputan</p>
      <form onSubmit={submit} className="mt-8 overflow-hidden rounded-2xl bg-white">
        <input
          className="w-full border-b border-stone-200 px-4 py-3.5 outline-none"
          type="email"
          placeholder="Emel"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-4 py-3.5 outline-none"
          type="password"
          placeholder="Kata laluan"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" hidden />
      </form>
      {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy || !email || !password}
        className="mt-5 rounded-xl bg-emerald-700 py-3.5 font-medium text-white disabled:opacity-40"
      >
        {busy ? "…" : "Log masuk"}
      </button>
    </Shell>
  );
}