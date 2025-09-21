import Image from "next/image";
import { GitHubLogoIcon, TwitterLogoIcon, InstagramLogoIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-28 pb-12 sm:pt-36">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="relative size-28 sm:size-32 rounded-full ring-1 ring-white/20 overflow-hidden">
            <Image
              src="/me.jpg"
              alt="Tom Seidel"
              fill
              sizes="128px"
              priority
              className="object-cover"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Tom Seidel
            </h1>
            <div className="space-y-1">
              <p className="text-base sm:text-lg text-white/70 max-w-2xl">
                AI-focused Full Stack Engineer
              </p>
              <p className="text-base sm:text-lg text-white/70 max-w-2xl">
                Building the next wave of agentic AI – and taking you along for the journey
              </p>
            </div>
          </div>
          {/* Links */}
          <nav aria-label="Social links" className="flex items-center gap-8 sm:gap-10">
            <a aria-label="GitHub" className="text-white/70 hover:text-white transition-colors" href="https://github.com/tom-seidel" target="_blank" rel="noopener noreferrer">
              <GitHubLogoIcon className="size-5 sm:size-7" />
            </a>
            <a aria-label="X (Twitter)" className="text-white/70 hover:text-white transition-colors" href="https://x.com/itsTomSeidel" target="_blank" rel="noopener noreferrer">
              <TwitterLogoIcon className="size-5 sm:size-7" />
            </a>
            <a aria-label="Instagram" className="text-white/70 hover:text-white transition-colors" href="https://www.instagram.com/tom_sei" target="_blank" rel="noopener noreferrer">
              <InstagramLogoIcon className="size-5 sm:size-7" />
            </a>
            <a aria-label="E-Mail" className="text-white/70 hover:text-white transition-colors" href="mailto:hi@tomseidel.com">
              <EnvelopeClosedIcon className="size-5 sm:size-7" />
            </a>
          </nav>
        </div>
      </section>
    </main>
  );
}