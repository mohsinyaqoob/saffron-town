// Hand-authored GI-tagging blog cluster for Kashmiri saffron.
// Written to the humanizing rules in the plan: no em dashes, no AI tells,
// first-person founder voice, concrete specifics, honest nuance.
// Bodies are markdown; the publish script converts them to Portable Text via
// markdownToBlocks() + blocksToPortableText(). Author is the Founder,
// Mohsin Yaqoob. Facts (2020 GI, application no. 635, districts) are
// web-verified; see plan's "Facts to verify" section.

export type GiPostCategory = "buying-guide" | "about-saffron";

export type GiPost = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  category: GiPostCategory;
  mainImageAlt: string;
  /** Markdown. Blocks separated by blank lines; ## = H2, ### = H3. */
  body: string;
  faqItems: { question: string; answer: string }[];
};

const PILLAR: GiPost = {
  slug: "gi-tagged-kashmiri-saffron",
  title: "GI-Tagged Kashmiri Saffron: What the Tag Really Means for Buyers",
  seoTitle: "GI-Tagged Kashmiri Saffron: What It Means for Buyers",
  seoDescription:
    "Kashmir saffron earned India's GI tag in 2020. Learn what geographical indication proves about origin and purity, and how to check your kesar is genuine.",
  category: "buying-guide",
  mainImageAlt: "GI-tagged Kashmiri Mongra saffron threads from Pampore",
  body: `Kashmiri saffron carries India's GI tag, granted in 2020. A GI tag, short for geographical indication, is a legal mark that ties a product to the place it comes from. For saffron, that place is the Karewa highlands of Kashmir. For you as a buyer, the tag is a promise of origin, and origin is most of what you are paying for when you buy real kesar.

## The Short Answer

Yes, Kashmiri saffron has a GI tag. The Geographical Indications Registry granted it in 2020 to saffron grown in the Karewa uplands of Kashmir, mostly around Pampore in the Pulwama district. The tag certifies where the saffron was grown and that it carries the qualities Kashmir saffron is known for, its long dark-red stigmas, its strong aroma, and its high colouring strength. What the tag cannot do by itself is prove that a loose packet on a shop shelf is pure. That still comes down to the seller and the paperwork they can show you.

## What a GI Tag Actually Certifies

A geographical indication protects a name that belongs to a place. Champagne comes from Champagne. Darjeeling tea comes from Darjeeling. Kashmir saffron comes from a defined stretch of the Kashmir valley, and no trader in another state or country can legally sell ordinary saffron under that name.

The tag links the product to the conditions that make it special. Kashmir saffron grows on Karewas, the raised beds of old lake soil, at altitudes between 1,600 and 1,800 metres. That microclimate is the reason its threads run longer and thicker, and the reason lab tests tend to show high crocin for colour, safranal for aroma, and picrocrocin for the bitter note that real saffron carries.

So the tag says two things at once. This saffron is from Kashmir, and Kashmir saffron means this particular character. What it does not say is that every reseller handling it kept it pure. Hold on to that difference, because it is where most buyers get caught.

## When Kashmir Saffron Got Its GI Tag

Kashmir saffron was registered as a geographical indication in 2020, under application number 635, in the spices class. The case was put together by the Directorate of Agriculture in Kashmir with support from the Spices Board, after years of paperwork and field surveys.

The GI covers saffron grown in specific belts of Pulwama, Budgam, Srinagar and Kishtwar, with Pampore as the historic hub. If you want the full story of how it happened and what changed on the ground, I wrote it up separately in [the 2020 GI story](/blog/kashmir-saffron-gi-tag-2020).

## Why It Matters When You Buy Kesar

For a long time, cheaper saffron from other countries was quietly repacked and sold as Kashmiri. Some of it was decent Iranian saffron wearing the wrong label. Some of it was not saffron at all, just dyed corn silk or coloured threads. Either way, the growers I work with in Pampore were undercut, and buyers paid a Kashmir price for something that was not.

The GI tag gives everyone a legal reference point. It draws a line around what is allowed to be called Kashmir saffron. That line does not enforce itself in every kitchen and every marketplace, but it changes the ground rules, and it gives an honest seller something concrete to stand behind. If you are still weighing the two origins, this comparison of [Kashmiri and Iranian saffron](/blog/kashmiri-saffron-vs-iranian-saffron) breaks down the real differences.

## How to Check Saffron Is Genuinely GI-Tagged

A few checks tell you most of what you need to know.

- Look for a GI certification mark and a clear statement of origin on the pack, not just the word Kashmir printed in a nice font.
- Ask the seller for proof. A serious supplier can show a GI reference and a recent lab report without hesitating.
- Match it against a test. Real saffron releases its colour slowly and smells of honey and dried hay, never of chemicals.

I have laid out the complete buyer checklist in [how to verify GI-tagged saffron](/blog/how-to-verify-gi-tagged-saffron), and the kitchen-table checks in [how to test saffron at home](/blog/how-to-test-saffron-at-home). Every batch we sell ships with its own [lab report](/lab-reports), so you are never taking the origin on trust alone. You can see the current harvest on our [saffron shop page](/shop/saffron).

## GI Tag vs Grade vs Lab Report

These three get mixed up constantly, and sellers sometimes blur them on purpose.

A GI tag is about origin. It answers where.

A grade, like Mongra or A1, is about which part of the flower and how clean the sort is. Mongra is the pure dark stigma with the yellow style trimmed off. It answers what quality class.

A lab report, usually to the ISO 3632 standard, is about measured strength. It puts numbers on crocin, safranal and picrocrocin. It answers how strong.

A genuine purchase lines up all three. Kashmir origin, a stated grade, and a lab report whose numbers back the claim. If a listing shouts about one and stays silent on the other two, slow down.

## What This Means for the Price You Pay

Real GI-tagged Kashmiri saffron is expensive for reasons that do not go away. It takes roughly 150 flowers to make a single gram of dry saffron, every stigma is pulled by hand, and Kashmir's growing area has been shrinking for years. Add the Karewa land and the short autumn window, and small yields are simply the nature of the crop.

So when you see saffron sold as Kashmiri at a price that looks too good, that price is the warning. Nobody is giving away the real thing at a discount. Cheap Kashmir saffron is almost always one of two things, either not Kashmiri or not pure.

## Final Thoughts

The GI tag is one of the better things to happen to Kashmir saffron. It names what makes the spice special and gives honest growers and sellers a standard to point at. Just remember what it is, a proof of origin, and pair it with a grade and a lab report before you buy.

If you want saffron that carries all three, our [Kashmiri Mongra kesar](/shop/saffron) is farm-direct from Pampore and ships with a [lab-tested purity report](/lab-reports). That is the way it should be, nothing to take on faith.`,
  faqItems: [
    {
      question: "Does Kashmiri saffron have a GI tag?",
      answer:
        "Yes. Kashmir saffron was registered as a geographical indication in 2020, covering saffron grown in the Karewa uplands of Pulwama, Budgam, Srinagar and Kishtwar, with Pampore as the main hub.",
    },
    {
      question: "When did Kashmir saffron get its GI tag?",
      answer:
        "In 2020, under GI application number 635 in the spices class. The case was led by the Directorate of Agriculture in Kashmir with support from the Spices Board.",
    },
    {
      question: "Is GI-tagged saffron the same as Grade A1 saffron?",
      answer:
        "No. A GI tag is about origin, where the saffron was grown. A grade like A1 or Mongra is about which part of the flower is used and how clean the sort is. A good pack states both.",
    },
    {
      question: "How can I tell if my saffron is really GI certified?",
      answer:
        "Ask the seller for a GI reference and a recent ISO 3632 lab report, check the pack for a certification mark, and run a simple water and aroma test at home. Genuine saffron colours water slowly and smells of honey and hay.",
    },
  ],
};

const VERIFY: GiPost = {
  slug: "how-to-verify-gi-tagged-saffron",
  title: "How to Check Your Kashmiri Saffron Is Genuinely GI-Tagged",
  seoTitle: "How to Verify GI-Tagged Kashmiri Saffron Before Buying",
  seoDescription:
    "A buyer's checklist for GI-tagged Kashmiri saffron: the marks to look for, what a seller should prove, and the quick tests that catch relabelled kesar.",
  category: "buying-guide",
  mainImageAlt: "Checking a pack of GI-tagged Kashmiri saffron before buying",
  body: `Want to be sure your saffron is genuinely GI-tagged Kashmiri kesar before you pay for it? Check three things: the certification and origin details on the pack, a recent lab report from the seller, and a couple of quick tests you can run yourself. Do all three and you will catch almost every relabelled or adulterated batch. Here is the full checklist.

## The Short Answer

To verify GI-tagged Kashmiri saffron, confirm the seller states the Kashmir origin clearly and can show a GI reference, ask for an ISO 3632 lab report from a recent harvest, and run the water and aroma test at home. Genuine Kashmir saffron releases a deep amber colour slowly, smells of honey and dried hay, and never bleeds red the instant it hits warm water. If a seller cannot produce paperwork, treat that as your answer.

## Look for the Certification Mark and Logo

Start with the pack. A GI certification means the saffron comes from the registered Kashmir growing area, so the label should say where the saffron was grown, not just carry the word Kashmir as decoration.

Look for a clear statement of origin, a batch or lot number, a harvest year, and ideally a GI reference. Vague packaging that leans on pretty photos and the word premium, with no origin detail and no batch information, is a quiet red flag. Real supply chains keep records, and honest sellers print them.

## Ask the Seller These Three Questions

You learn a lot from how a seller answers three plain questions.

Where exactly was this grown? A real answer names a place, Pampore or a nearby belt in Pulwama, Budgam, Srinagar or Kishtwar, not just the country.

Can I see a lab report for this batch? A serious seller has one ready and does not get defensive.

What grade is this, and what does the lab say about crocin? If they know their product, they can tell you whether it is Mongra, and roughly what colouring strength it tests at.

Hesitation, deflection, or a sudden change of subject tells you more than any label.

## Match It Against a Lab Report (ISO 3632)

A GI tag proves origin. A lab report proves strength. You want both.

ISO 3632 is the international standard that grades saffron on three numbers: crocin for colour, safranal for aroma, and picrocrocin for the bitter note. Strong Kashmir saffron sits high on colour in particular. When a seller shows you a report, check that the batch on the certificate matches the batch you are buying, and that the date is recent, not a five-year-old document reused for everything.

We publish the [lab reports](/lab-reports) for our harvests for exactly this reason. Paperwork you cannot see is paperwork you cannot trust.

## Do the Physical Checks at Home

Once it arrives, a few minutes at the kitchen table settle most doubts.

Drop a few threads into warm water. Real saffron colours the water slowly, over several minutes, into a warm gold. Fake or dyed material bleeds red almost at once.

Rub a thread between your fingers. Genuine saffron holds together and smells of honey and hay. Sweetened, oily, or perfume-like smells point to adulteration.

I have written the full set of checks in [how to test saffron at home](/blog/how-to-test-saffron-at-home), and a rundown of the usual fakes in [how to identify fake saffron](/blog/how-to-identify-fake-saffron). None of these need special equipment.

## Red Flags That Mean Walk Away

Some signs are strong enough to end the conversation.

- A Kashmir price that is suddenly a bargain. Real kesar is costly for reasons that do not change.
- No batch number, no harvest year, no origin detail on the pack.
- A seller who will not show a lab report, or shows one that does not match the batch.
- Threads that stain water red instantly, or smell sweet and chemical.
- Colour that rubs off on your fingers as powder.

Any one of these is enough to put your money away.

## Buying Online: What a Trustworthy Listing Shows

Online you cannot touch the product, so the listing has to do the work. A listing worth trusting states the Kashmir origin plainly, names the grade, shows or links a recent lab report, and does not hide behind stock photos and the word authentic repeated five times.

It also stands behind the sale. Clear contact details, a real return path, and visible reviews all matter more than a flashy label. You can see how we lay this out on our [saffron shop page](/shop/saffron), where the origin, grade and testing sit up front rather than buried.

## Final Thoughts

Verifying saffron is not complicated once you know the order of it. Read the pack, ask for the report, and test what arrives. Three steps, and the relabelled and adulterated stuff falls away fast.

If you would rather start from a source where the checks are already done, our [Kashmiri Mongra saffron](/shop/saffron) ships farm-direct from Pampore with its own [lab-tested purity report](/lab-reports).`,
  faqItems: [
    {
      question: "How do I know if saffron is GI certified?",
      answer:
        "Check that the pack states a Kashmir growing region and carries batch and harvest details, then ask the seller for a GI reference and a recent ISO 3632 lab report. Genuine sellers provide both without fuss.",
    },
    {
      question: "Can sellers fake a GI tag?",
      answer:
        "A dishonest seller can print anything on a label, which is why a printed claim alone is not enough. Pair it with a batch-matched lab report and a simple home test, and fakes become very hard to hide.",
    },
    {
      question: "Does a GI tag guarantee purity?",
      answer:
        "No. A GI tag certifies origin, not that a specific packet was kept pure through the supply chain. Use a lab report and physical tests to confirm purity.",
    },
    {
      question: "Should GI-tagged saffron come with a lab report?",
      answer:
        "Ideally yes. A GI reference tells you the origin and an ISO 3632 lab report tells you the measured strength. A trustworthy seller can show a recent report that matches the batch you are buying.",
    },
  ],
};

const STORY: GiPost = {
  slug: "kashmir-saffron-gi-tag-2020",
  title: "Kashmir Saffron's GI Tag: The 2020 Milestone and Why It Matters",
  seoTitle: "Kashmir Saffron GI Tag: The 2020 Story for Buyers",
  seoDescription:
    "In 2020 Kashmir saffron won a GI tag after years of effort centred on Pampore. Here is what changed, who it protects, and why it still matters when you buy kesar.",
  category: "about-saffron",
  mainImageAlt: "Saffron harvest in the GI-tagged fields of Pampore, Kashmir",
  body: `Kashmir saffron received its GI tag in 2020, and it mattered more than a line in the news. For the growers around Pampore, it was recognition after years of being undercut by cheaper saffron sold under their name. Here is what led up to the tag, what it set out to protect, and why it still shapes what you should look for when you buy kesar.

## The Short Answer

Kashmir saffron was registered as a geographical indication in 2020, under application number 635. The push was led by the Directorate of Agriculture in Kashmir with support from the Spices Board, and it covers saffron grown in the Karewa uplands of Pulwama, Budgam, Srinagar and Kishtwar. The point of the tag was to protect a name that was being borrowed by cheaper saffron from elsewhere, and to give real Kashmir growers a standard to stand behind.

## What Was Happening Before the Tag

For years, the trade had a quiet problem. Saffron from other countries, often decent Iranian saffron, was being imported, repacked and sold as Kashmiri at a Kashmir price. Some sellers went further and mixed in dyed threads or passed off coloured corn silk as the real thing.

The people who lost were the growers. When anyone could stick the word Kashmir on a jar, the premium that should have reached Pampore leaked away to whoever printed the best label. Buyers lost too, paying for an origin they were not getting. If you want to see how the two origins genuinely differ, I compared [Kashmiri and Iranian saffron](/blog/kashmiri-saffron-vs-iranian-saffron) in detail.

## The Road to Recognition

A GI application is not quick. It asks you to prove that a product's qualities are tied to a specific place, with surveys, history and testing to back it. The Directorate of Agriculture in Kashmir built that case, documenting how saffron grown on the Karewas, at 1,600 to 1,800 metres, develops its long stigmas and high colouring strength.

The Spices Board supported the effort, and in 2020 the Geographical Indications Registry granted the tag under application number 635, in the spices class. Years of fieldwork, condensed into a single legal protection for a name that had been open to anyone.

## What the Tag Protects

The GI tag protects two groups at once.

It protects the growers, by reserving the name Kashmir saffron for saffron actually grown in the registered belts. That gives the people doing the hard work a claim that a distant repacker cannot legally copy.

It protects buyers, by turning a vague marketing word into a defined standard. Kashmir saffron now means something specific about origin and character, not just a nice story on a jar.

## The Pampore Connection

Pampore is the heart of it. The town and the belts around it have grown saffron for centuries, and the Karewa soil there is a large part of why the spice turns out the way it does. Standing in those fields during the short autumn bloom, watching flowers picked by hand before the sun climbs, you understand why the yields are small and the price is what it is.

That is the source we build on. Our saffron comes farm-direct from these growers, which is the whole reason we can trace a batch back to where it grew. You can read more about that on [our story](/our-story).

## Has It Actually Curbed Fakes?

Honestly, the tag helped, but it did not end the problem. A legal name is only as strong as the checks behind it, and relabelled saffron still turns up, especially online and in loose markets where nobody asks for paperwork.

What the tag changed is the ground rules. It gave honest sellers something concrete to show, gave buyers a word with real meaning, and made the fakes easier to challenge. The rest is on all of us to keep asking for proof rather than taking a label at its word.

## What It Means for You Today

When you buy Kashmir saffron now, the GI tag is your starting point, not your finish line. Use it alongside a stated grade and a recent lab report, and you are on solid ground.

If you want saffron that carries the origin and the paperwork together, our [Kashmiri Mongra kesar](/shop/saffron) is farm-direct from Pampore and ships with its own [lab-tested report](/lab-reports). And if you want the practical checklist for vetting any seller, here is [how to verify GI-tagged saffron](/blog/how-to-verify-gi-tagged-saffron).`,
  faqItems: [
    {
      question: "When did Kashmir saffron get its GI tag?",
      answer:
        "In 2020. The Geographical Indications Registry granted it under application number 635, in the spices class, after a case led by the Directorate of Agriculture in Kashmir with support from the Spices Board.",
    },
    {
      question: "Why did Kashmir saffron need a GI tag?",
      answer:
        "Because cheaper saffron from other countries was being repacked and sold as Kashmiri, undercutting real growers and misleading buyers. The tag reserves the name for saffron grown in the registered Kashmir belts.",
    },
    {
      question: "Who can use the Kashmir saffron GI tag?",
      answer:
        "Producers and sellers whose saffron is genuinely grown in the registered growing area of Kashmir and who meet the GI's conditions. It is not meant for saffron grown elsewhere.",
    },
    {
      question: "Where is GI-tagged saffron grown in Kashmir?",
      answer:
        "Mainly in belts of Pulwama, Budgam, Srinagar and Kishtwar, with Pampore as the historic hub, on the raised Karewa lands at altitudes of roughly 1,600 to 1,800 metres.",
    },
  ],
};

const EXPLAINER: GiPost = {
  slug: "what-is-a-gi-tag",
  title: "What Is a GI Tag? Geographical Indication Explained Simply",
  seoTitle: "What Is a GI Tag? Geographical Indication Explained",
  seoDescription:
    "GI tag means geographical indication, a legal mark tying a product to its place of origin. Here is how it works in India and why it matters when you buy saffron.",
  category: "about-saffron",
  mainImageAlt: "GI-tagged Indian products including Kashmir saffron",
  body: `A GI tag, or geographical indication, is a legal mark that ties a product to the place it comes from and the reputation that place has earned. Think Darjeeling tea, Alphonso mangoes, or Kashmir saffron. The name belongs to the region, and only producers from there can use it. Here is how GI tags work in India, and why one matters when you shop for saffron.

## The Short Answer

GI stands for geographical indication. A GI tag is a legal recognition that a product comes from a specific place and owes its qualities to that place. Once a product is GI-tagged, its name is protected, and sellers from other regions cannot legally use it. In India, GI tags are granted by the Geographical Indications Registry. Kashmir saffron, Darjeeling tea and Banarasi sarees are all examples.

## GI Tag in Plain Words

Some products are inseparable from where they grow. The soil, the climate, the altitude, and generations of local know-how all shape the result, and you cannot fully copy it somewhere else.

A GI tag puts a legal fence around that. It says this name belongs to this place, and it gives local producers the exclusive right to use it. That protects their livelihood, and it protects you from paying a premium name price for an ordinary product dressed up to look the part.

## What a GI Tag Does and Does Not Guarantee

It helps to be clear about the limits.

A GI tag guarantees origin. It confirms the product comes from the registered region and meets the qualities tied to it.

A GI tag does not, on its own, guarantee that a specific packet in front of you is pure or unadulterated. A dishonest reseller can still misuse a name, which is why a printed claim should always be backed by proof like a lab report.

So treat a GI tag as a strong signal of origin, and pair it with your own checks before you buy.

## Famous GI-Tagged Products in India

India has hundreds of GI-tagged products. A few you will recognise:

- Darjeeling tea, from the hills of West Bengal.
- Alphonso mango, from Maharashtra's Konkan coast.
- Banarasi sarees, woven around Varanasi.
- Mysore silk and Mysore sandalwood, from Karnataka.
- Kashmir saffron, grown in the Karewa uplands of the Kashmir valley.

Each name is tied to a place, and each tag exists to stop that name being borrowed by producers elsewhere.

## Who Grants GI Tags in India

GI tags in India are registered by the Geographical Indications Registry, which sits under the office of the Controller General of Patents, Designs and Trade Marks. The registry is based in Chennai.

Getting a tag is a process. Applicants have to document the product's history, its link to the region, and the qualities that come from that place, often with support from bodies like the Spices Board for products such as saffron. For the specific story of how Kashmir saffron earned its tag in 2020, I wrote it up in [the 2020 GI story](/blog/kashmir-saffron-gi-tag-2020).

## Why It Matters When You Shop for Saffron

Saffron is one of the most faked spices in the world, so origin is not a small detail. Kashmir saffron carries a GI tag, which gives you a legal reference point when a seller claims their kesar is Kashmiri.

But the tag is a starting point, not the whole answer. A confident purchase pairs the GI origin with a stated grade and a recent lab report. For the full method, see [how to verify GI-tagged saffron](/blog/how-to-verify-gi-tagged-saffron), or read what the tag really means in [our guide to GI-tagged Kashmiri saffron](/blog/gi-tagged-kashmiri-saffron). When you are ready, our [Kashmiri Mongra kesar](/shop/saffron) ships farm-direct with its paperwork attached.

## Final Thoughts

A GI tag is a simple idea doing important work. It keeps a place's name honest, protects the people who earned it, and gives you a reliable signal when you shop. For saffron, where fakes are common, that signal is worth understanding, and worth pairing with a quick check of your own.`,
  faqItems: [
    {
      question: "What is the full form of GI tag?",
      answer:
        "GI stands for geographical indication. It is a legal mark that identifies a product as coming from a specific place and having qualities or a reputation tied to that place.",
    },
    {
      question: "What does a GI tag guarantee?",
      answer:
        "It guarantees origin, that the product comes from the registered region and meets the qualities linked to it. It does not by itself guarantee that a particular packet is pure, so pair it with a lab report and your own checks.",
    },
    {
      question: "Which spice from Kashmir has a GI tag?",
      answer:
        "Kashmir saffron. It was registered as a geographical indication in 2020, covering saffron grown in the Karewa uplands of Pulwama, Budgam, Srinagar and Kishtwar.",
    },
    {
      question: "Who issues GI tags in India?",
      answer:
        "The Geographical Indications Registry, under the Controller General of Patents, Designs and Trade Marks, based in Chennai. Sector bodies like the Spices Board support applications for products such as saffron.",
    },
  ],
};

/** Publish order: pillar first so supporting posts can link to it. */
export const GI_POSTS: GiPost[] = [PILLAR, VERIFY, STORY, EXPLAINER];
