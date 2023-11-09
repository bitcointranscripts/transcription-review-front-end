import React, { FC } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import CarouseCardSlide, { ICarouselCardSlide } from "./CarouselCardSlide";

interface ICarouselCards {
  stepContents: Array<ICarouselCardSlide>;
}
const CarouselCards: FC<ICarouselCards> = ({ stepContents }) => {
  return (
    <Splide
      options={{
        arrows: false,
        padding: { left: 0, right: 50 },
        rewind: true,
        pagination: true,
        gap: "12px",
        perPage: 1,
      }}
      style={{ overflow: "scroll", maxWidth: "300px" }}
    >
      {stepContents.map((content) => (
        <SplideSlide key={content.heading} style={{ width: "100%" }}>
          <CarouseCardSlide {...content} />
        </SplideSlide>
      ))}
      {/* <SplideSlide></SplideSlide> */}
    </Splide>
  );
};

export default CarouselCards;
