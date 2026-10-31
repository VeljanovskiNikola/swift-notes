import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const config = vi.hoisted(() => ({ username: "veljanovski" }));

vi.mock("@/config/site", () => ({
  siteConfig: {
    newsletter: {
      get buttondownUsername() {
        return config.username;
      },
    },
  },
}));

import { isValidEmail, subscribe } from "@/lib/newsletter";

describe("isValidEmail", () => {
  it("accepts normal addresses and ignores surrounding spaces", () => {
    expect(isValidEmail("me@example.com")).toBe(true);
    expect(isValidEmail("  me@example.com  ")).toBe(true);
  });

  it("rejects addresses without an @ or a domain dot", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("me")).toBe(false);
    expect(isValidEmail("me@example")).toBe(false);
    expect(isValidEmail("me @example.com")).toBe(false);
  });
});

describe("subscribe", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    config.username = "veljanovski";
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects an invalid email without calling the network", async () => {
    await expect(subscribe("nope")).rejects.toThrow("valid email");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the trimmed email to the Buttondown embed endpoint", async () => {
    await subscribe("  me@example.com ");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://buttondown.com/api/emails/embed-subscribe/veljanovski");
    expect(init.method).toBe("POST");
    expect(init.mode).toBe("no-cors");
    expect((init.body as URLSearchParams).get("email")).toBe("me@example.com");
  });

  it("propagates a network failure so the form can show an error", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(subscribe("me@example.com")).rejects.toThrow("Failed to fetch");
  });

  it("runs in demo mode without a username and makes no request", async () => {
    config.username = "";
    vi.useFakeTimers();
    const pending = subscribe("me@example.com");
    await vi.advanceTimersByTimeAsync(1000);
    await expect(pending).resolves.toBeUndefined();
    vi.useRealTimers();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
