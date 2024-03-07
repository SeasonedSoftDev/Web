const createTypography = () => ({
  heading: {
    fontSize: 64,
    fontWeight: 100,
    fontFamily: '"Poppins", sans-serif',
    lineHeight: 1.5,
  },
  subHeading: {
    fontSize: 32,
    fontWeight: 300,
    fontFamily: '"Poppins", sans-serif',
    lineHeight: 1.5,
  },
  text: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: '"Poppins", sans-serif',
    lineHeight: 1.75,
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: '"Poppins", sans-serif',
    lineHeight: 1.5,
  },
  note: {
    fontSize: 12,
    fontWeight: 500,
    fontFamily: '"Poppins", sans-serif',
    lineHeight: 1.5,
  },
  link: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: '"Poppins", sans-serif',
    lineHeight: 1.75,
  },
});

export type TypographyType = keyof ReturnType<typeof createTypography>;

export default createTypography;
