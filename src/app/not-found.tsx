import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container size="prose" className="py-16 text-center">
      <p className="gradient-text mx-auto mb-2 w-fit text-5xl font-extrabold">404</p>
      <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
      <p className="text-muted mb-8">This page doesn&apos;t exist or has moved.</p>
      <BackLink />
    </Container>
  );
}
