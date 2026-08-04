import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton, SignInButton } from "@clerk/nextjs";
import { Link, Zap, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Link,
    title: "One link for everything",
    description:
      "Collect all your important links — social profiles, projects, content — into a single shareable URL.",
  },
  {
    icon: Zap,
    title: "Instant setup",
    description:
      "Create your page in seconds. No coding required — just add links and go live immediately.",
  },
  {
    icon: Palette,
    title: "Make it yours",
    description:
      "Customize your page to match your style and stand out with a personal touch.",
  },
  {
    icon: Globe,
    title: "Share anywhere",
    description:
      "Put your links2 URL in your social bio, email signature, or anywhere you need a single point of entry.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-8 px-6 py-32 text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            All your links, <span className="text-primary">one place</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            links2 lets you create a single landing page for all the links you
            want to share — your portfolio, social profiles, latest project, and
            more.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg">Get started for free</Button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Everything you need
            </h2>
            <p className="mt-3 text-muted-foreground">
              Simple by design. Powerful where it counts.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Ready to share your links?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Join and create your page in under a minute.
        </p>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <Button size="lg">Create your page</Button>
        </SignUpButton>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} links2. All rights reserved.
      </footer>
    </div>
  );
}
