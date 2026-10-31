"use client";

import { useState, type FormEvent } from "react";
import { isValidEmail, subscribe } from "@/lib/newsletter";
import { toast } from "@/lib/toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await subscribe(email);
      setEmail("");
      toast({
        title: "You're subscribed!",
        description: "Thanks for subscribing. New posts will land in your inbox.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-border animate-fade-in w-full max-w-[560px] rounded-xl p-8 text-center">
      <h2 className="mb-2 text-xl font-bold">Stay in the loop</h2>
      <p className="text-muted mb-6 text-sm">
        Get new posts delivered to your inbox. No spam, unsubscribe anytime.
      </p>
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex max-w-md flex-col items-center gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="your@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted focus:ring-primary h-10 w-full rounded-md border px-4 text-sm focus:ring-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-10 cursor-pointer rounded-md bg-gradient-to-r from-[#9b3fd1] to-[hsl(210,90%,45%)] px-6 text-sm font-medium whitespace-nowrap text-white transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-50"
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
