// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleDirectories: ["node_modules", "<rootDir>"], // <-- add this
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // map "@/foo" -> "<rootDir>/foo"
    "^.+\\.module\\.(css|scss)$": "identity-obj-proxy",
  },
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

module.exports = createJestConfig(customJestConfig);
