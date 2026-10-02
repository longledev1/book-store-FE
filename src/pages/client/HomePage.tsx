import React from "react";
import HeroSection from "../../components/client/home/HeroSection";
import AISearchSection from "../../components/client/ai/AISearchSection";
import CategoryGrid from "../../components/client/home/CategoryGrid";
import FeaturedBooks from "../../components/client/home/FeaturedBooks";
import PopularBooks from "../../components/client/home/PopularBooks";
import AIFeatures from "../../components/client/home/AIFeatures";
import FeaturedAuthors from "../../components/client/home/FeaturedAuthors";
import BlogAndNewsletter from "../../components/client/home/BlogAndNewsletter";

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <AISearchSection />
      <CategoryGrid />
      <FeaturedBooks />
      <PopularBooks />
      <AIFeatures />
      <FeaturedAuthors />
      <BlogAndNewsletter />
    </div>
  );
}
