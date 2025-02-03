import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";

import "swiper/css";
import "swiper/css/effect-cards";
import PlaceHolder from "../../assets/images/placeholder.svg";

import { EffectCards } from "swiper/modules";

const CardSlider = ({ images, authenticated }) => {
  return (
    <>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className={`mySwiper !px-6 !pb-2.5 !pt-0 w-[198px] h-[200px] sm:w-[250px] sm:h-[253px] lg:w-[300px] lg:h-[310px] xl:w-[350px] xl:h-[360px] ${
          authenticated ? "!ml-auto !mr-0" : "!mr-auto !ml-0"
        }`}
      >
        {images.map((image) => (
          <SwiperSlide key={image} className="rounded-[18px] bg-neutral-200">
            <img
              src={image || PlaceHolder}
              className="h-full w-full object-cover"
              alt="Photo Preview"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

CardSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  authenticated: PropTypes.bool.isRequired,
};
export default CardSlider;
