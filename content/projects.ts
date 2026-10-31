/**
 * Projects page data. To add a project, add one object to this list.
 * Tags reuse the colors from src/config/tags.ts when they match.
 */
export interface Project {
  name: string;
  description: string;
  tags: string[];
  url: string;
  /** Link label. Defaults to "View on GitHub". */
  linkLabel?: string;
}

export const projects: Project[] = [
  {
    name: "Pulse",
    description:
      "A lightweight, privacy-focused analytics SDK for iOS apps. Built with Swift concurrency and on-device aggregation.",
    tags: ["Swift", "iOS SDK", "Privacy"],
    url: "https://github.com/",
  },
  {
    name: "Compose",
    description:
      "A SwiftUI component library implementing Material Design 3 tokens with native Apple platform conventions.",
    tags: ["SwiftUI", "Design System", "Open Source"],
    url: "https://github.com/",
  },
  {
    name: "Synth",
    description:
      "A real-time audio synthesizer app exploring CoreAudio and MIDI integration with a SwiftUI-driven interface.",
    tags: ["CoreAudio", "MIDI", "SwiftUI"],
    url: "https://github.com/",
  },
  {
    name: "Relay",
    description:
      "An async networking layer built on top of URLSession with automatic retry, caching, and request deduplication.",
    tags: ["Networking", "Concurrency", "Swift Package"],
    url: "https://github.com/",
  },
];
