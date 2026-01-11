"use client";
import React from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/features/Hero";
import MOCK_MOVIES from "@/data/mockMovies";
import CATEGORIES from "@/data/mockCategories";
import { useEffect, useState } from "react";
import ContentRow from "@/components/features/ContentRow";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-black text-white min-h-screen">
        <Header scrolled={scrolled} />

        <main>
          <Hero movie={MOCK_MOVIES[0]} />

          <div className="relative -mt-32 space-y-12 pb-12">
            {CATEGORIES.map((category) => (
              <ContentRow
                key={category.name}
                title={category.name}
                movies={category.movies}
              />
            ))}
          </div>
        </main>

        <Footer />

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  );
}
