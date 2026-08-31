import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/features/Hero";
import ContentRow from "@/components/features/ContentRow";
import Landing from "@/components/features/Landing";
import { auth } from "@/auth";
import { getFeatured, getRows } from "@/lib/api";

/**
 * `/` is public but session-dependent, so it is not covered by the proxy
 * matcher — it decides for itself what to render.
 *
 * Calling auth() reads cookies, which makes this route dynamic. The ISR
 * caching inside src/lib/api.ts is unaffected: the fetches stay cached, only
 * the shell re-renders per request. The signed-out path makes no API call at
 * all, because getFeatured/getRows are never reached.
 */
export default async function Home() {
  const session = await auth();

  if (!session?.user) return <Landing />;

  const [featured, rows] = await Promise.all([getFeatured(), getRows()]);

  return (
    <div className="bg-black text-white min-h-screen">
      <Header />

      <main>
        {featured && <Hero movie={featured} />}

        <div className="relative -mt-32 space-y-12 pb-12">
          {rows.map((row) => (
            <ContentRow key={row.id} title={row.title} movies={row.items} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
