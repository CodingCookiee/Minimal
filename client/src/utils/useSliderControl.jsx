import { useEffect, useRef } from "react";

export const useSliderControl = (isLastSlide) => {
  const swiperRef = useRef(null);

  const handleWheel = (e) => {
    if (!isLastSlide) {
      e.preventDefault();

      // Handle vertical scrolling for slider
      if (swiperRef.current && swiperRef.current.swiper) {
        if (e.deltaY > 0) {
          swiperRef.current.swiper.slideNext();
        } else {
          swiperRef.current.swiper.slidePrev();
        }
      }
    }
  };

  useEffect(() => {
    const options = { passive: false };
    window.addEventListener("wheel", handleWheel, options);

    return () => {
      window.removeEventListener("wheel", handleWheel, options);
    };
  }, [isLastSlide]);

  return { swiperRef };
};
