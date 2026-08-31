import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Logo from "@/components/shared/logo";
import LoginForm from "@/components/auth/LoginForm";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign In — LuminFlix",
  description: "Sign in to LuminFlix.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect(ROUTES.PROFILES);

  const { callbackUrl } = await searchParams;

  return (
    <div className="bg-luminflix-black text-white min-h-screen flex flex-col">
      <div className="px-4 md:px-12 py-6">
        <Link href={ROUTES.HOME} aria-label="LuminFlix home">
          <Logo />
        </Link>
      </div>

      <main className="flex-1 flexCenter px-4 pb-16">
        <div className="w-full max-w-md bg-black/75 rounded-lg p-8 md:p-12">
          <h1 className="large-30 mb-6">Sign In</h1>

          <LoginForm callbackUrl={callbackUrl ?? ROUTES.PROFILES} />

          {/* With no signup route, a visitor has no other way in — so the demo
              credentials have to be on the page. */}
          <div className="mt-8 rounded border border-zinc-700 bg-zinc-900/60 p-4">
            <p className="small-14 text-gray-300 mb-3">
              LuminFlix is a demo and has no database, so there is no sign-up or
              password reset. Use one of these accounts:
            </p>
            <ul className="small-14 text-gray-400 space-y-1 font-mono">
              <li>demo@luminflix.com · luminflix2024</li>
              <li>guest@luminflix.com · watchnow2024</li>
            </ul>
          </div>

          <p className="small-14 text-gray-500 mt-6">
            <Link href={ROUTES.ABOUT} className="hover:text-white transition">
              About LuminFlix
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
