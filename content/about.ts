import type { IconName } from "@/components/Icon";

/** About page copy. Edit text here; the page layout stays the same. */
export const about = {
  intro: [
    "I'm an iOS developer passionate about building thoughtful, performant software. I write about Swift, SwiftUI, app architecture, and the creative side of programming.",
  ],
  topicsTitle: "What I write about",
  topics: [
    {
      icon: "smartphone",
      title: "iOS Development",
      description: "Building native experiences for Apple platforms",
    },
    {
      icon: "zap",
      title: "Swift Concurrency",
      description: "async/await, actors, and structured concurrency",
    },
    {
      icon: "layers",
      title: "App Architecture",
      description: "MVVM, composable patterns, and clean code",
    },
    {
      icon: "music",
      title: "Music & Code",
      description: "Intersections of creativity and engineering",
    },
  ] satisfies { icon: IconName; title: string; description: string }[],
};
