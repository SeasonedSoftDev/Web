import {
  InterBlack,
  InterBlackItalic,
  InterBold,
  InterBoldItalic,
  InterItalic,
  InterLight,
  InterLightItalic,
  InterMedium,
  InterMediumItalic,
  InterRegular,
  InterThin,
  InterThinItalic,
} from 'assets/fonts/inter';

const createFonts: any = () => `
      @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 100;
          src: url(${InterThin});
      }
      @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 100;
          src: url(${InterThinItalic});
      }
      @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 300;
          src: url(${InterLight});
      }
      @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 300;
          src: url(${InterLightItalic});
      }
      @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: url(${InterRegular});
      }
      @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 400;
          src: url(${InterItalic});
      }
      @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 500;
          src: url(${InterMedium});
      }
      @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 500;
          src: url(${InterMediumItalic});
      }
      @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          src: url(${InterBold});
      }
      @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 700;
          src: url(${InterBoldItalic});
      }
      @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 900;
          src: url(${InterBlack});
      }
      @font-face {
          font-family: 'Inter';
          font-style: italic;
          font-weight: 900;
          src: url(${InterBlackItalic});
      }
  `;

export default createFonts;
