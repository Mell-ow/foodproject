import { render, screen } from "@testing-library/react";
import App from "./App";
import api from "./api";

jest.mock("./api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  }
}));

test("renders cafe branding", async () => {
  api.get.mockImplementation((path) => {
    if (path === "/menu") {
      return Promise.resolve({ data: [] });
    }

    return Promise.reject(new Error("not logged in"));
  });

  render(<App />);

  const brandNodes = await screen.findAllByText(/zan cafe/i);
  expect(brandNodes.length).toBeGreaterThan(0);
});