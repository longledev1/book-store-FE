import React from "react";
import HeroSection from "../../components/client/HeroSection";
import AISearchSection from "../../components/client/AISearchSection";
import CategoryGrid from "../../components/client/CategoryGrid";
import FeaturedBooks from "../../components/client/FeaturedBooks";
import PopularBooks from "../../components/client/PopularBooks";
import AIFeatures from "../../components/client/AIFeatures";
import FeaturedAuthors from "../../components/client/FeaturedAuthors";
import BlogAndNewsletter from "../../components/client/BlogAndNewsletter";

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
