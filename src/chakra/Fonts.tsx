import { Global } from "@emotion/react";

const Fonts = () => (
  <Global
    styles={`
    /* Poly sans fonts */
    @font-face {
        font-family: PolySans, sans-serif';
        src: url('/fonts/PolySans-Slim.otf') format('opentype');
        font-weight: 100 200 300;
        font-style: normal;
      }

      @font-face {
        font-family: PolySans, sans-serif;
        src: url('/fonts/PolySans-Neutral.otf') format('opentype');
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: PolySans, sans-serif;
        src: url('/fonts/PolySans-Median.otf') format('opentype');
        font-weight: 500 600;
        font-style: normal;
      }

      @font-face {
        font-family: PolySans, sans-serif;
        src: url('/fonts/PolySans-Bulky.otf') format('opentype');
        font-weight: 700 800;
        font-style: normal;
      }

      /* Mono sans fonts */
      @font-face {
       font-family: 'Mona-sans', sans-serif;
       src: url('/fonts/Mona-Sans-SemiBold.otf') format('opentype');
       font-weight: 600;
       font-style: normal;
     } 
      `}
  />
);

export default Fonts;
