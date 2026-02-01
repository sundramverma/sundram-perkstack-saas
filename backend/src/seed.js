const mongoose = require("mongoose");
require("dotenv").config();
const Deal = require("./models/Deal");

mongoose.connect(process.env.MONGO_URI);

const deals = [
  // 🔒 HOSTING / CLOUD
  {
    title: "AWS Credits",
    description: "Get $1000 AWS credits for early-stage startups",
    category: "Hosting",
    partner: "Amazon Web Services",
    discount: "$1000 Free Credits",
    isLocked: true,
    eligibility: "Verified startups only",
  },
  {
    title: "Google Cloud Credits",
    description: "$2000 Google Cloud credits for startups",
    category: "Hosting",
    partner: "Google Cloud",
    discount: "$2000 Credits",
    isLocked: true,
    eligibility: "Verified startups only",
  },
  {
    title: "DigitalOcean",
    description: "$500 credits on DigitalOcean",
    category: "Hosting",
    partner: "DigitalOcean",
    discount: "$500 Credits",
    isLocked: false,
    eligibility: "All startups",
  },

  // 🧰 TOOLS / PRODUCTIVITY
  {
    title: "Notion Pro",
    description: "Free Notion Pro for 6 months",
    category: "Tools",
    partner: "Notion",
    discount: "6 Months Free",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "Slack Pro",
    description: "Slack Pro free for 3 months",
    category: "Tools",
    partner: "Slack",
    discount: "3 Months Free",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "GitHub Team",
    description: "GitHub Team free for startups",
    category: "Tools",
    partner: "GitHub",
    discount: "Free Team Plan",
    isLocked: true,
    eligibility: "Verified startups only",
  },

  // 🎨 DESIGN
  {
    title: "Figma Professional",
    description: "Figma Pro free for early-stage startups",
    category: "Design",
    partner: "Figma",
    discount: "12 Months Free",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "Canva Pro",
    description: "Canva Pro free for startups",
    category: "Design",
    partner: "Canva",
    discount: "6 Months Free",
    isLocked: false,
    eligibility: "All startups",
  },

  // 📈 MARKETING
  {
    title: "HubSpot Starter",
    description: "HubSpot CRM free for startups",
    category: "Marketing",
    partner: "HubSpot",
    discount: "Free Starter Plan",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "Mailchimp",
    description: "Mailchimp marketing credits",
    category: "Marketing",
    partner: "Mailchimp",
    discount: "$300 Credits",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "Ahrefs",
    description: "Ahrefs SEO tools at 50% off",
    category: "Marketing",
    partner: "Ahrefs",
    discount: "50% Discount",
    isLocked: true,
    eligibility: "Verified startups only",
  },

  // 💰 FINANCE
  {
    title: "Stripe Atlas",
    description: "Stripe Atlas startup incorporation perks",
    category: "Finance",
    partner: "Stripe",
    discount: "Exclusive Startup Benefits",
    isLocked: true,
    eligibility: "Verified startups only",
  },
  {
    title: "Razorpay",
    description: "Zero processing fees for first 3 months",
    category: "Finance",
    partner: "Razorpay",
    discount: "0% Fees (3 Months)",
    isLocked: false,
    eligibility: "All startups",
  },

  // 📊 ANALYTICS / DEV
  {
    title: "Mixpanel",
    description: "Mixpanel analytics free credits",
    category: "Tools",
    partner: "Mixpanel",
    discount: "$500 Credits",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "Sentry",
    description: "Error monitoring free for startups",
    category: "Tools",
    partner: "Sentry",
    discount: "12 Months Free",
    isLocked: false,
    eligibility: "All startups",
  },
  {
    title: "Postman",
    description: "Postman Team plan free",
    category: "Tools",
    partner: "Postman",
    discount: "Free Team Plan",
    isLocked: false,
    eligibility: "All startups",
  },
];

(async () => {
  try {
    await Deal.deleteMany();
    await Deal.insertMany(deals);
    console.log("✅ 20+ Deals seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
})();
