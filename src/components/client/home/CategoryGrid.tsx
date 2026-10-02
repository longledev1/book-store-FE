import React from "react";
import { Cpu, TrendingUp, Feather, Brain, Atom, Heart, History, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryItem {
  name: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  iconColorClass: string;
  path: string;
}

const categoriesList: CategoryItem[] = [
  {
    name: "Công Nghệ",
    count: "1,240 đầu sách",
    icon: Cpu,
    colorClass: "bg-blue-50",
    iconColorClass: "text-blue-500",
    path: "/books?category=technology"
  },
  {
    name: "Kinh Doanh",
    count: "2,560 đầu sách",
    icon: TrendingUp,
    colorClass: "bg-emerald-50",
    iconColorClass: "text-emerald-500",
    path: "/books?category=business"
  },
  {
    name: "Tiểu Thuyết",
    count: "3,120 đầu sách",
    icon: Feather,
    colorClass: "bg-amber-50",
    iconColorClass: "text-amber-500",
    path: "/books?category=novels"
  },
  {
    name: "Tâm Lý Học",
    count: "1,850 đầu sách",
    icon: Brain,
    colorClass: "bg-indigo-50",
    iconColorClass: "text-indigo-500",
    path: "/books?category=psychology"
  },
  {
    name: "Khoa Học",
    count: "980 đầu sách",
    icon: Atom,
    colorClass: "bg-cyan-50",
    iconColorClass: "text-cyan-500",
    path: "/books?category=science"
  },
  {
    name: "Thiếu Nhi",
    count: "1,420 đầu sách",
    icon: Heart,
    colorClass: "bg-rose-50",
    iconColorClass: "text-rose-500",
    path: "/books?category=kids"
  },
  {
    name: "Lịch Sử",
    count: "1,150 đầu sách",
    icon: History,
    colorClass: "bg-orange-50",
    iconColorClass: "text-orange-500",
    path: "/books?category=history"
  },
  {
    name: "Ngoại Ngữ",
    count: "890 đầu sách",
    icon: Globe,
    colorClass: "bg-teal-50",
    iconColorClass: "text-teal-500",
    path: "/books?category=languages"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-b border-slate-100 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
        
        {/* Headings */}
        <div className="text-center space-y-3">
          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest block">
            Phân loại chi tiết
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-dark tracking-tight">
            Khám Phá Theo Danh Mục Sách
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Tìm kiếm theo sở thích cá nhân với 8 nhóm danh mục lớn được tuyển chọn kỹ lưỡng.
          </p>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesList.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={category.path}
                className="group p-6 flex flex-col items-start text-left bg-white border border-slate-200/50 rounded-3xl shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Icon wrapper inside colored square */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0 ${category.colorClass} transition-colors group-hover:scale-105 duration-300`}>
                  <IconComponent className={`w-5.5 h-5.5 ${category.iconColorClass}`} />
                </div>

                {/* Category title */}
                <h4 className="font-bold text-base text-neutral-dark mb-1 group-hover:text-primary transition-colors duration-200">
                  {category.name}
                </h4>

                {/* Book count */}
                <span className="text-xs text-slate-400 font-medium">
                  {category.count}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
