import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/features/Hero";
import ContentRow from "@/components/features/ContentRow";
import { getFeatured, getRows } from "@/lib/api";

export default async function Home() {
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
