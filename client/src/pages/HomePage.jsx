import { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  EffectCreative,
  Mousewheel,
  Autoplay,
} from "swiper/modules";
import "swiper/css/mousewheel";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useSliderControl } from "../utils/useSliderControl";
import { homeCarouselData } from "../constants/homeCarousel";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState("men");
  const [isLastSlide, setIsLastSlide] = useState(false);
  const { swiperRef } = useSliderControl(isLastSlide);

  return (
    <div className="h-screen overflow-hidden relative">
      <div className="h-screen sticky top-0 z-10">
        <div className="flex lg:flex-row flex-col h-screen">
          <div className="lg:w-[20%] w-full flex lg:flex-col items-center flex-row justify-center bg-transparent">
            <div className="flex lg:flex-col flex-row w-full">
              {Object.keys(homeCarouselData).map((category) => (
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
                    <span className="font-sf-heavy text-sm sm:text-base lg:text-xl tracking-wider block">
                      {category === "sales"
                        ? "SALES & CLEARANCE"
                        : category.toUpperCase()}
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

          <div className="flex-1 h-full overflow-hidden">
            <div className="swiper-container relative h-full">
              <Swiper
                direction="vertical"
                effect="creative"
                mousewheel={true}
                speed={2000}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  waitForTransition: true,
                }}
                creativeEffect={{
                  prev: {
                    translate: [0, "-100%", 0],
                    scale: 0.95,
                    opacity: 0,
                  },
                  next: {
                    translate: [0, "100%", 0],
                    scale: 0.95,
                    opacity: 0,
                  },
                }}
                pagination={{
                  clickable: true,
                  renderBullet: (index, className) => {
                    return `<span class="${className} w-0.5 h-8 transition-colors"></span>`;
                  },
                }}
                ref={swiperRef}
                onSlideChange={(swiper) => {
                  setIsLastSlide(swiper.isEnd);
                }}
                modules={[EffectCreative, Pagination, Mousewheel, Autoplay]}
                className="h-full [perspective:1200px]"
              >
                {homeCarouselData[activeCategory].map((slide) => (
                  <SwiperSlide
                    key={slide.title}
                    className="h-screen [transform-style:preserve-3d] [transition-property:transform,opacity] [transform-origin:center_center]"
                  >
                    <div className="relative h-full group">
                      <picture className="block h-full object-cover">
                        <img
                          src={slide.imagePath}
                          alt={slide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </picture>

                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

                      <div className="absolute bottom-10 sm:bottom-16 lg:bottom-20 left-6 sm:left-12 lg:left-20 z-10">
                        <h2 className="font-sf-heavy text-xl sm:text-3xl lg:text-4xl text-white mb-2">
                          {slide.title}
                        </h2>
                        <p className="font-sf-light text-sm sm:text-base text-white/80 mb-4 sm:mb-6">
                          {slide.description}
                        </p>
                        <button className="inline-block px-6 sm:px-7 lg:px-8 py-2 sm:py-2.5 lg:py-3 bg-white text-black hover:bg-black hover:text-white transition-all duration-300 font-sf-medium text-xs sm:text-sm tracking-wider">
                          Explore Collection
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="swiper-pagination !opacity-100 !right-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
