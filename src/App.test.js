import { render, screen, act } from "@testing-library/react";
import App from "./App";

describe("fetchPodcasts", () => {});

test("renders learn react link", async () => {
  render(<App />);
  const linkElement = screen.getByText(/Loading.../i);
  expect(linkElement).toBeInTheDocument();
});
