// jest.setup.js
import "@testing-library/jest-dom";

// mock next/image so tests use a plain <img> (and never complain about missing src)
jest.mock("next/image", () => {
  return {
    __esModule: true,
    // this mock simply renders a normal <img src={…} alt={…}>, so no missing-src check
    default: ({ src, alt, ...props }) => {
      return <img src={src || ""} alt={alt} {...props} />;
    },
  };
});
