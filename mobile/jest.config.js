module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!.*(react-native|@react-native|expo|@expo|@unimodules|zustand|@testing-library))",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
