import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("men");

  const categorySlides = {
    men: [
      {
        image:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=560&h=900",
        title: "Premium Essentials",
        subtitle: "2025 Collection",
        link: "/category/men-essentials",
      },
      {
        image:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=560&h=900",
        title: "Premium Essentials",
        subtitle: "New Arrivals",
        link: "/category/men-essentials",
      },
      {
        image:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=560&h=900",
        title: "Premium Essentials",
        subtitle: "New Arrivals",
        link: "/category/men-essentials",
      },
    ],
    women: [
      {
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=560&h=900",
        title: "Women's Collection",
        subtitle: "Discover More",
        link: "/category/women",
      },
      {
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=560&h=900",
        title: "Women's Collection",
        subtitle: "Discover More",
        link: "/category/women",
      },
      {
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=560&h=900",
        title: "Women's Collection",
        subtitle: "Discover More",
        link: "/category/women",
      },
    ],
    kids: [
      {
        image:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=560&h=900",
        title: "Kids Collection",
        subtitle: "New Season",
        link: "/category/kids",
      },
      {
        image:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=560&h=900",
        title: "Kids Collection",
        subtitle: "New Season",
        link: "/category/kids",
      },
      {
        image:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=1920&h=900",
        mobileImage:
          "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=560&h=900",
        title: "Kids Collection",
        subtitle: "New Season",
        link: "/category/kids",
      },
    ],
  };

  return (
    <div className="flex lg:flex-row flex-col h-screen">
      {/* Navigation Panel */}
      <div className="lg:w-[20%] w-full flex lg:flex-col items-center flex-row justify-center bg-transparent">
        <div className="flex lg:flex-col flex-row w-full">
          {Object.keys(categorySlides).map((category) => (
            <motion.div
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`cursor-pointer lg:mt-0 mt-24 flex-1 lg:py-16 py-4 flex items-center justify-center group relative ${
                activeCategory === category
                  ? "bg-dark-primary text-light-primary dark:bg-light-primary dark:text-dark-primary"
                  : "bg-light-primary text-dark-primary dark:bg-dark-primary dark:text-light-primary"
              }`}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative z-10 text-center">
                <span className="font-sf-heavy text-sm sm:text-base lg:text-xl tracking-wider block ">
                  {category.toUpperCase()}
                </span>
                <span className="font-sf-light text-[8px] sm:text-[10px] lg:text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity lg:rotate-[-90deg] lg:mt-4">
                  VIEW COLLECTION
                </span>
              </div>
              <div className="absolute inset-0 bg-black-200/5 dark:bg-white-700/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden">
        <Swiper
          direction="vertical"
          effect="creative"
          creativeEffect={{
            prev: { translate: [0, "-100%", 0], scale: 0.95, opacity: 0 },
            next: { translate: [0, "100%", 0], scale: 0.95, opacity: 0 },
          }}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} w-1 h-8 bg-black-300/20 dark:bg-white-700/20"></span>`;
            },
          }}
          modules={[EffectCreative, Pagination]}
          className="h-full"
        >
          {categorySlides[activeCategory].map((slide, index) => (
            <SwiperSlide key={index} className="h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-full group"
              >
                <picture className="h-full">
                  <source
                    media="(max-width: 768px)"
                    srcSet={slide.mobileImage}
                  />
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover filter group-hover:scale-105 transition-transform duration-700"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black-200/30 dark:to-black-200/50" />
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-10 sm:bottom-16 lg:bottom-20 left-6 sm:left-12 lg:left-20"
                >
                  <h2 className="font-sf-heavy text-xl sm:text-3xl lg:text-4xl text-light-primary mb-2">
                    {slide.title}
                  </h2>
                  <p className="font-sf-light text-sm sm:text-base text-light-primary/80 mb-4 sm:mb-6">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-block px-6 sm:px-7 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-light-primary text-dark-primary hover:bg-dark-primary hover:text-light-primary dark:bg-dark-primary dark:text-light-primary dark:hover:bg-light-primary dark:hover:text-dark-primary transition-all duration-300 font-sf-medium text-xs sm:text-sm tracking-wider"
                  >
                    Explore Collection
                  </a>
                </motion.div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomePage;
