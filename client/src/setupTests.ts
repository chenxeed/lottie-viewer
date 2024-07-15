// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock createObjectURL as it doesn't exist in JSDOM
URL.createObjectURL = () => "12345";

// Mock IntersectionObserver as it doesn't exist in JSDOM
class FakeIntersectionObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
  public root: any;
  public rootMargin;
  public thresholds: any;
  public takeRecords() {
    return [];
  }

  constructor() {
    this.root = null;
    this.rootMargin = "";
    this.thresholds = [];
  }
}

// eslint-disable-next-line no-restricted-globals
self.IntersectionObserver = FakeIntersectionObserver;
