import "@testing-library/jest-dom";

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: (rest: any) => {
    // eslint-disable-next-line
    return <img {...rest} />;
  },
}));
