import { siteConfig } from "@/config/site";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * The ONE place that sends a signup somewhere.
 * Swap the body of this function to use another provider
 * (ConvertKit, Mailchimp, your own API...). The form doesn't change.
 */
export async function subscribe(email: string): Promise<void> {
  const clean = email.trim();
  if (!isValidEmail(clean)) throw new Error("Please enter a valid email address.");

  const username = siteConfig.newsletter.buttondownUsername;

  if (!username) {
    // Demo mode: no provider set. Pretend it worked so the UI can be tested.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return;
  }

  // Buttondown's public embed endpoint. It doesn't send CORS headers,
  // so the response is opaque: a network failure is the only error we can see.
  const body = new URLSearchParams({ email: clean, embed: "1" });
  await fetch(`https://buttondown.com/api/emails/embed-subscribe/${username}`, {
    method: "POST",
    mode: "no-cors",
    body,
  });
}
