import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Saffron Town | The Purists of Premium Kashmiri Saffron",
  description:
    "Discover the story of Saffron Town. We are disrupting the market by delivering only the freshest, pure Premium Mongra Saffron straight from Kashmiri harvesters to your home. No old stocks. Just unmatched quality.",
  openGraph: {
    title: "About Saffron Town | The Purists of Premium Kashmiri Saffron",
    description:
      "Discover the story of Saffron Town. Fresh harvests, pure Mongra.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-rose-200">
      {/* Hero Section */}
      <section
        className="relative w-full py-20 px-4 md:px-8 lg:py-32 flex flex-col items-center justify-center bg-white"
        aria-labelledby="about-hero-title"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1
            id="about-hero-title"
            className="text-4xl md:text-6xl font-serif text-amber-900 tracking-tight leading-tight"
          >
            We <span className="italic text-rose-700">Refuse</span> to Accept
            the Industry Standard.
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Yes, we are a new face in the market. But we aren&apos;t here to
            play by the old rules. The global saffron market is flooded with
            stale, adulterated, and aged stocks. We didn&apos;t start this
            journey to blend in. We exist because we believe you deserve better:{" "}
            <strong className="font-semibold text-rose-800">
              100% Fresh Harvest Premium Mongra Saffron
            </strong>
            , delivered with absolute transparency.
          </p>
        </div>
      </section>

      {/* Story & Harvesters Section */}
      <section
        className="w-full py-16 px-4 md:px-8 bg-amber-50"
        aria-label="Our Story"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full h-80 md:h-[500px] relative rounded-2xl overflow-hidden shadow-2xl group">
            <Image
              src="/gen/kashmiri_harvesters_about.png"
              alt="Kashmiri saffron harvesters picking crocus flowers in the misty morning fields of Pampore"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-amber-950">
              The Journey from Pampore to You
            </h2>
            <p className="text-neutral-700 leading-relaxed text-lg">
              Saffron Town was born from a simple realization: Indian households
              from across the country were paying exorbitant prices for subpar,
              old-stock kesar. We asked ourselves, why should you settle for
              last year&apos;s harvest when the earth gives us something new,
              potent, and magical every single year?
            </p>
            <p className="text-neutral-700 leading-relaxed text-lg">
              Our partners are generational farmers right in the heart of
              Kashmir. They handpick the delicate Crocus sativus at dawn. We
              then meticulously select only the thickest, reddest stigmas—known
              as <strong>Premium Mongra</strong>. No yellow tails. No floral
              waste. Just the purest golden essence.
            </p>
          </div>
        </div>
      </section>

      {/* Freshness Guarantee Graphic / Graph */}
      <section
        className="w-full py-20 px-4 md:px-8 bg-white"
        aria-label="Freshness Comparison"
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-amber-950 mb-4">
            Why &quot;Fresh Harvest&quot; Actually Matters
          </h2>
          <p className="text-center text-neutral-600 max-w-2xl mb-12">
            Most saffron sits in wholesale warehouses or retail shelves for 1-3
            years losing its Crocin (color), Safranal (aroma), and Picrocrocin
            (flavor). At Saffron Town, we guarantee current-season harvests
            only. Literal freshness.
          </p>

          {/* A purely CSS/HTML comparative bar chart for accessibility & aesthetics */}
          <section
            className="w-full bg-neutral-50 rounded-2xl p-6 md:p-10 shadow-sm border border-neutral-100 flex flex-col space-y-8"
            aria-label="Saffron Potency Chart"
          >
            <div className="space-y-2">
              <div className="flex justify-between text-sm md:text-base font-medium text-neutral-800">
                <span>Saffron Town (Fresh Harvest Mongra)</span>
                <span className="text-rose-700 font-bold">100% Potency</span>
              </div>
              <div
                className="w-full bg-neutral-200 h-6 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={100}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-gradient-to-r from-rose-500 to-rose-700 h-full w-full rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm md:text-base font-medium text-neutral-600">
                <span>Average Retail Saffron (1-2 Years Old)</span>
                <span className="text-amber-600 font-semibold">
                  60% Potency
                </span>
              </div>
              <div
                className="w-full bg-neutral-200 h-6 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={60}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-amber-500 h-full w-[60%] rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm md:text-base font-medium text-neutral-500">
                <span>Adulterated / Fake Saffron</span>
                <span className="text-neutral-400 font-semibold">
                  &lt; 10% Potency
                </span>
              </div>
              <div
                className="w-full bg-neutral-200 h-6 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={10}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="bg-neutral-400 h-full w-[10%] rounded-full"></div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* The Product & Quality Standards Table */}
      <section
        className="w-full py-16 px-4 md:px-8 bg-neutral-900 text-neutral-50"
        aria-label="Our Product Standards"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-rose-300">
              Premium Mongra: The Gold Standard
            </h2>
            <p className="text-neutral-300 leading-relaxed text-lg">
              We never compromise. By focusing exclusively on the
              &quot;Mongra&quot; grade—the highest quality attainable—we ensure
              you receive only the most potent parts of the stigma. See how our
              strict quality control compares against industry norms.
            </p>

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-xl border border-neutral-700">
              <table
                className="w-full text-left border-collapse"
                aria-label="Saffron Quality Comparison Table"
              >
                <thead>
                  <tr className="bg-neutral-800 text-rose-200 text-sm uppercase tracking-wider">
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Feature
                    </th>
                    <th scope="col" className="px-6 py-4 font-semibold">
                      Saffron Town
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-semibold text-neutral-400"
                    >
                      Market Standard
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700 text-neutral-300">
                  <tr className="hover:bg-neutral-800/50 transition-colors">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white"
                    >
                      Harvest Date
                    </th>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">
                      Current Season (Fresh)
                    </td>
                    <td className="px-6 py-4">Often 1-3 years old</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/50 transition-colors">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white"
                    >
                      Grade
                    </th>
                    <td className="px-6 py-4 text-rose-400 font-semibold">
                      Pure Mongra (Deep Red)
                    </td>
                    <td className="px-6 py-4">Lacha/Mixed (Yellow tails)</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/50 transition-colors">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white"
                    >
                      Testing
                    </th>
                    <td className="px-6 py-4">ISO 3632 Lab Tested</td>
                    <td className="px-6 py-4">Unverified / Rare</td>
                  </tr>
                  <tr className="hover:bg-neutral-800/50 transition-colors">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white"
                    >
                      Origin
                    </th>
                    <td className="px-6 py-4">Pampore, Kashmir</td>
                    <td className="px-6 py-4">Mixed / Imported</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-[400px] md:h-[600px] relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 order-1 lg:order-2 group">
            <Image
              src="/gen/fresh_mongra_harvest.png"
              alt="Extreme close up of fresh, deep red Premium Mongra Saffron threads next to a purple crocus flower"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        className="w-full py-20 px-4 md:px-8 bg-amber-50"
        aria-label="Our Fulfillment Timeline"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-center text-amber-950 mb-12">
            How We Do It: The Freshness Timeline
          </h2>
          <div className="relative border-l-2 border-rose-200 ml-4 md:ml-6 space-y-12">
            <div className="relative pl-8">
              <div
                className="absolute w-6 h-6 bg-rose-600 rounded-full -left-[13px] top-1 border-4 border-amber-50"
                aria-hidden="true"
              ></div>
              <h3 className="text-xl font-bold text-rose-900">
                1. The Autumn Harvest
              </h3>
              <p className="mt-2 text-neutral-700">
                For a brief window in late Autumn, our Kashmiri partners
                carefully harvest the crocus flowers strictly before sunrise to
                preserve the delicate essential oils.
              </p>
            </div>

            <div className="relative pl-8">
              <div
                className="absolute w-6 h-6 bg-rose-500 rounded-full -left-[13px] top-1 border-4 border-amber-50"
                aria-hidden="true"
              ></div>
              <h3 className="text-xl font-bold text-rose-900">
                2. Processing &amp; Sorting
              </h3>
              <p className="mt-2 text-neutral-700">
                The red stigmas are separated from the yellow styles by hand. It
                takes roughly 150,000 flowers to produce just one kilogram of
                Mongra saffron.
              </p>
            </div>

            <div className="relative pl-8">
              <div
                className="absolute w-6 h-6 bg-rose-400 rounded-full -left-[13px] top-1 border-4 border-amber-50"
                aria-hidden="true"
              ></div>
              <h3 className="text-xl font-bold text-rose-900">
                3. Moisture Control
              </h3>
              <p className="mt-2 text-neutral-700">
                The threads are naturally dried to optimal moisture levels,
                sealing their potency and assuring that beautiful crimson color
                remains intact.
              </p>
            </div>

            <div className="relative pl-8">
              <div
                className="absolute w-6 h-6 bg-amber-500 rounded-full -left-[13px] top-1 border-4 border-amber-50"
                aria-hidden="true"
              ></div>
              <h3 className="text-xl font-bold text-rose-900">
                4. Direct to Your Kitchen
              </h3>
              <p className="mt-2 text-neutral-700">
                We bypass traditional wholesale markets. Once sealed in
                air-tight glass jars, the fresh harvest is shipped directly to
                homes across India, retaining maximum potency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="w-full py-24 bg-rose-900 text-center px-4"
        aria-labelledby="cta-title"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <h2
            id="cta-title"
            className="text-4xl md:text-5xl font-serif text-white leading-tight"
          >
            Ready to Taste True Freshness?
          </h2>
          <p className="text-rose-200 text-lg">
            Stop compromising with tired, dull saffron. Elevate your culinary
            and wellness journey today with Saffron Town.
          </p>
          <a
            href="/shop"
            className="inline-block bg-white text-rose-900 font-bold py-4 px-10 rounded-full hover:bg-rose-50 transition-colors shadow-lg focus:ring-4 focus:ring-rose-300 focus:outline-none"
            aria-label="Shop Premium Mongra Saffron"
          >
            Shop Premium Mongra
          </a>
        </div>
      </section>
    </main>
  );
}
