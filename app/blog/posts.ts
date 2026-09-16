export const categories = ["All stories", "Dairy", "Poultry", "Livestock", "Farm management"] as const;
export type Category = (typeof categories)[number];

type Section = { id: string; title: string; paragraphs: string[]; checklist?: string[] };
export type Post = {
  body?: string;
  author?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  slug: string;
  title: string;
  category: Exclude<Category, "All stories">;
  excerpt: string;
  image: string;
  imageAlt: string;
  date: string;
  takeaway: string;
  sections: Section[];
  sources?: { title: string; href: string }[];
  relatedHref: string;
  relatedLabel: string;
  views?: number;
};

// Initial seed content only. After first startup, manage articles in /studio.
// Dates describe publication on this site, not the publication dates of source material.
export const posts: Post[] = [
  {
    slug: "a-better-dairy-feeding-routine",
    title: "Better milk starts with a better daily routine.",
    category: "Dairy",
    excerpt: "Before changing your feed, take a closer look at the everyday habits around water, forage and record keeping.",
    image: "/molaplus/service-cows.webp",
    imageAlt: "A dairy cow and calf standing in a green pasture",
    date: "2026-09-14",
    takeaway: "Build a clear picture of your current routine before deciding what needs to change.",
    sections: [
      { id: "start-with-observation", title: "Start with what you can observe", paragraphs: ["A feeding programme is easier to discuss when you can describe what actually happens on the farm. Choose an ordinary day and follow the routine from the first feed to the final milking. Write down the feed offered, who provides it and anything that interrupts the schedule.", "Keep the notes simple enough for someone else to use. A notebook near the milking area can be more useful than a detailed system that nobody has time to complete."] },
      { id: "water-and-feed", title: "Give water and feed a daily check", paragraphs: ["Suitable feed and water, reliable supplies and appropriate storage are foundations of good dairy farming. Check the water points and inspect stored feed as part of the daily walk around the farm. Record shortages or quality concerns so they can be addressed rather than forgotten.", "If you are unsure about a feed or water source, discuss it with a qualified local adviser before using it. Bring the product label or supplier details to that conversation."] },
      { id: "keep-useful-records", title: "Make your records useful", paragraphs: ["Use the same units each day and identify each animal consistently. The aim is to make tomorrow's discussion more specific: what changed, when did it change, and which animals were affected?"], checklist: ["Note the date, animal identification and milk recorded.", "Record the feed supplied and any changes to the routine.", "Keep supplier, batch and purchase details together.", "List questions to raise at your next farm consultation."] },
      { id: "review-your-routine", title: "Review before you change", paragraphs: ["At the end of the week, sit down with the person responsible for feeding. Compare what was planned with what happened. Agree on one practical process improvement, such as assigning responsibility for checking water points or keeping feed delivery notes in one place.", "Take the records to a nutrition adviser when reviewing your feeding programme. A supplement decision should sit within that wider conversation about your animals, available feed and farm conditions."] },
    ],
    sources: [{ title: "FAO — Good dairy farming practices", href: "https://www.fao.org/dairy-production-products/production/farm-practices/en/" }],
    relatedHref: "/products/super-milk-booster", relatedLabel: "Explore Super Milk Booster",
  },
  {
    slug: "a-practical-poultry-house-checklist",
    title: "Small checks. A more consistent poultry routine.",
    category: "Poultry",
    excerpt: "A practical walk-through to help your team keep feeding, water checks and flock observations on track.",
    image: "/molaplus/service-poultry.webp", imageAlt: "Poultry on a farm",
    date: "2026-09-14", takeaway: "A checklist works best when every task has an owner and a clear place to record concerns.",
    sections: [
      { id: "walk-the-house", title: "Make the first walk count", paragraphs: ["Begin with a repeatable route through the poultry house. Carry a notebook and use the same headings each day: feed, water, equipment and observations. This gives the next person on duty something concrete to work from.", "Before entering, follow the farm's biosecurity arrangements. Keeping disease out requires consistent routines for people, equipment and birds, with a plan suited to the particular farm."] },
      { id: "check-the-basics", title: "Check the basics, then record exceptions", paragraphs: ["Check that birds have access to feed and water and that the equipment is working. Use feed appropriate to the birds' stage and discuss feeding or flock-health questions with a qualified adviser. A daily checklist is a management tool, not a way to diagnose illness."], checklist: ["Check feeders and drinkers along the full walking route.", "Record equipment faults and who will follow them up.", "Write down feed deliveries and batch details.", "Record unusual behaviour and contact your adviser about concerns."] },
      { id: "handover", title: "Close the loop at handover", paragraphs: ["A note saying 'drinker checked' tells the next shift very little if a repair is still needed. Write down the location of the issue, the action taken and what remains to be done.", "Keep an agreed contact list where the team can find it. Include the farm manager, equipment support and the veterinarian or extension adviser responsible for flock health. Review open tasks at the end of each day."] },
    ],
    sources: [{ title: "University of Minnesota Extension — Poultry biosecurity", href: "https://extension.umn.edu/poultry/poultry-biosecurity" }, { title: "University of Minnesota Extension — Raising layer chicks and pullets", href: "https://extension.umn.edu/agriculture/animals-and-livestock/poultry/raising-layer-chicks-and-pullets" }],
    relatedHref: "/products#poultry-microbes", relatedLabel: "Explore poultry products",
  },
  {
    slug: "make-your-next-farm-consultation-count",
    title: "Make your next farm consultation count.",
    category: "Farm management", excerpt: "The records, photos and questions that turn a general conversation into a useful farm visit.",
    image: "/molaplus/service-cows.webp", imageAlt: "Dairy cattle at pasture",
    date: "2026-09-14", takeaway: "Arrive with a clear question, a short history and the records you already have.",
    sections: [
      { id: "set-a-goal", title: "Start with one clear question", paragraphs: ["It is tempting to ask an adviser to look at everything. Begin instead with the decision you need help making. Perhaps you want to review the feeding routine, plan a new group of animals or organise the way your team keeps records.", "Describe what success would look like in practical terms. A useful goal might be a written feeding plan to discuss with the team, or a clear list of information to collect before making a purchase."] },
      { id: "prepare-your-records", title: "Bring what you already know", paragraphs: ["You do not need a perfect record system to have a useful conversation. Bring recent notes and be clear about any gaps. Photos of packaging and feeding equipment can help explain the setup, especially when the first conversation is by phone."], checklist: ["Animal numbers, groups and stages of production.", "Current feed names, labels and quantities recorded.", "Recent production notes and the dates of any changes.", "Your available budget, practical constraints and main questions."] },
      { id: "agree-next-steps", title: "Leave with a plan you can use", paragraphs: ["Before the visit ends, summarise the agreed next steps in your own words. Confirm who is responsible for each task and when you will review progress. Ask which observations should prompt an earlier call.", "Keep the plan with your farm records and share it with the people doing the daily work. A clear handover helps the advice become part of the routine, rather than another document in a drawer."] },
    ],
    relatedHref: "/consultancy", relatedLabel: "Arrange a farm consultation",
  },
  {
    slug: "simple-records-for-your-livestock-farm",
    title: "A farm notebook you will actually use.",
    category: "Livestock", excerpt: "Keep track of feed, stock and everyday decisions with a simple record system your whole team can follow.",
    image: "/molaplus/service-pigs.webp", imageAlt: "Pigs on a livestock farm",
    date: "2026-09-14", takeaway: "Consistency matters more than complexity. Start small and keep the same format.",
    sections: [
      { id: "one-place", title: "Give your records a home", paragraphs: ["Choose one place for the daily farm record. It could be a bound notebook or a shared spreadsheet, depending on what the people doing the work can reliably access. Avoid splitting essential notes between loose paper, personal phones and memory.", "Write the farm contact details on the first page and agree how animals or groups will be identified. Using the same names throughout makes the record easier to follow later."] },
      { id: "daily-page", title: "Keep the daily page short", paragraphs: ["Set aside a few minutes at handover to complete the page. Use clear units, write the date in full and distinguish between a measurement and an estimate. If a detail is missing, leave a note rather than guessing."], checklist: ["Date and the name of the person making the entry.", "Animal or group identification and movements.", "Feed received, issued and remaining where measured.", "Observations, actions taken and tasks still open."] },
      { id: "weekly-review", title: "Put the notes to work", paragraphs: ["Once a week, review the open tasks and purchases. Mark completed actions and carry unresolved questions into the following week. Keep receipts and supplier information with the relevant entry.", "When speaking with an adviser, use the notebook to explain the sequence of events. It is a record of what happened on your farm, not a diagnosis or a substitute for professional advice. Its value is in making the next conversation more precise."] },
    ],
    relatedHref: "/consultancy", relatedLabel: "Talk about your farm's needs",
  },
  {
    slug: "before-you-buy-a-farm-supplement",
    title: "Five questions to ask before buying a supplement.",
    category: "Dairy", excerpt: "Go beyond the pack size. Get clear on the product, its instructions and how it fits your current feeding plan.",
    image: "/molaplus/milk-booster-5kg-cutout.webp", imageAlt: "MolaPlus Super Milk Booster 5kg package",
    date: "2026-09-14", takeaway: "Take the label and your current feeding plan into the conversation with your adviser.",
    sections: [
      { id: "right-product", title: "What exactly am I buying?", paragraphs: ["Ask for the full product name and the pack size, then check them against the label. Similar-looking packs can be intended for different uses. Make sure you understand which animals the product is intended for and keep a copy of the instructions.", "Write down the batch details and keep your receipt. If you need to follow up with the supplier, these details make it easier to identify the product you purchased."] },
      { id: "five-questions", title: "Take these questions to the supplier", paragraphs: ["Use this short list before you place the order. Where the answer depends on your animals or existing ration, ask your nutrition adviser to help you decide."], checklist: ["Is this product suitable for my animals and their stage of production?", "How does it fit with what I am already feeding?", "What do the label instructions say about use and storage?", "What pack sizes are available, and what is the confirmed total cost?", "Who should I contact if I have a question after purchase?"] },
      { id: "plan-your-order", title: "Confirm the practical details", paragraphs: ["Before paying, confirm availability, collection or delivery arrangements and the total amount with the supplier. Share a working phone number and clear directions if you need delivery.", "MolaPlus's order form lets you send the products and quantities you want along with your delivery details. The team then calls to confirm stock, price, delivery cost and payment instructions. Keep the order reference for that conversation."] },
    ],
    relatedHref: "/products", relatedLabel: "Browse the MolaPlus range",
  },
  {
    slug: "plan-your-next-feed-order",
    title: "A little planning before the next feed order.",
    category: "Farm management", excerpt: "A simple stock check and a clear supplier conversation can make your next order easier to organise.",
    image: "/molaplus/full-product-range.webp", imageAlt: "The MolaPlus range of farm nutrition products",
    date: "2026-09-14", takeaway: "Count what you have, list what you need and confirm the details before payment.",
    sections: [
      { id: "stock-check", title: "Start with a physical stock check", paragraphs: ["Before opening a new order, walk through the store and list the products on hand. Record the pack sizes and distinguish unopened packs from partially used ones. Check your list against the notes from the last delivery.", "Keep any questions about damaged packaging or unclear labels separate from the quantities you intend to use. Discuss those concerns with the supplier rather than assuming every pack is ready for use."] },
      { id: "write-your-order", title: "Make the order easy to confirm", paragraphs: ["Use full product names and units. 'Two bags' is less useful than a product name, a stated bag size and a quantity. If several people request supplies, bring their lists together before calling the supplier."], checklist: ["List each product, pack size and quantity separately.", "Confirm current stock and the quoted price.", "Agree the delivery or collection details.", "Keep the order reference, receipt and supplier contact together."] },
      { id: "receive-delivery", title: "Check the delivery against the request", paragraphs: ["When the order arrives, compare the products and quantities with the confirmed request. Record any differences and contact the supplier with the order details. File the delivery note where the person responsible for stock can find it.", "Finish by updating the stock record. That small final step gives you a better starting point when it is time to order again, and helps the next person understand what is available."] },
    ],
    relatedHref: "/order", relatedLabel: "Plan your MolaPlus order",
  },
];

export function getPost(slug: string) { return posts.find((post) => post.slug === slug); }
export function readingMinutes(post: Post) {
  const words = [post.excerpt, post.body ?? "", ...post.sections.flatMap((s) => [s.title, ...s.paragraphs, ...(s.checklist ?? [])])].join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
export type PostSummary = Pick<Post, "slug" | "title" | "category" | "excerpt" | "image" | "imageAlt" | "date" | "tags" | "author" | "views"> & { minutes: number };
export function summarize(post: Post): PostSummary {
  const { slug, title, category, excerpt, image, imageAlt, date, tags, author, views } = post;
  return { slug, title, category, excerpt, image, imageAlt, date, tags, author, views, minutes: readingMinutes(post) };
}
