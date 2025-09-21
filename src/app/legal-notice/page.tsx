import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Notice | Tom Seidel",
  description: "Impressum / Legal Notice for tomseidel.com",
};

export default function LegalNoticePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Legal Notice</h1>

      <section className="space-y-4 text-sm leading-relaxed text-white/80">
        <p>
          Information in accordance with § 5 DDG (Digital Services Act of Germany):
        </p>
        <p>
          Tom Seidel<br />
          Werner-Heisenberg-Weg 15<br />
          59399 Olfen<br />
          Germany
        </p>
        <p>
          Contact:<br />
          Phone: <a href="tel:+4915735627962" className="underline hover:text-white">+49 1573 5627962</a><br />
          E-Mail: <a href="mailto:hi@tomseidel.com" className="underline hover:text-white">hi@tomseidel.com</a>
        </p>

        <h2 className="mt-10 text-base font-medium">Responsible for content according to § 55 Abs. 2 RStV:</h2>
        <p>
          Tom Seidel (same address as above)
        </p>

        <h2 className="mt-10 text-base font-medium">Liability for content</h2>
        <p>
          As a service provider, I am responsible for my own content on these pages according to § 7 paragraph 1 DDG. According to §§ 8 to 10 DDG, however, I am not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
        </p>

        <h2 className="mt-10 text-base font-medium">Liability for links</h2>
        <p>
          My website contains links to external websites of third parties, over whose content I have no influence. Therefore, I cannot assume any liability for these external contents. The respective provider or operator of the sites is always responsible for the content of the linked pages.
        </p>

        <h2 className="mt-10 text-base font-medium">Copyright</h2>
        <p>
          The content and works created by the site operator on these pages are subject to German copyright law. Duplication, editing, distribution, and any kind of use beyond the scope of copyright require the written consent of the respective author or creator.
        </p>
      </section>

      <div className="mt-12">
        <a href="../" className="text-sm underline text-white/70 hover:text-white">Back to homepage</a>
      </div>
    </main>
  );
}
