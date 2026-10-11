import { readFileSync } from "node:fs";

const source = JSON.parse(
  readFileSync(new URL("./source/content.json", import.meta.url), "utf8"),
);
const translations = {
  "source-1": "Why v4?",
  "source-3":
    "Since 2019, Tailwind CSS has become one of the most popular utility-first CSS frameworks. But the JIT engine introduced in v3, the growing complexity of ",
  "source-6":
    ", and the PostCSS dependency gave the team plenty of reasons to build something new from the ground up.",
  "source-8": "The main goal of v4 is simple: ",
  "source-9":
    "more speed, less configuration, and greater use of CSS standards",
  "source-10": ". And spoiler: it largely delivers.",
  "source-13": "At the heart of v4 is ",
  "source-15":
    ", a new build engine written in Rust. This change brings a dramatic improvement in compilation times:",
  "source-21":
    "These figures come from Tailwind’s own benchmark tests. The ratios can vary with the size of a real project, but the overall trend is consistent.",
  "source-22": "The CSS-First Approach",
  "source-24":
    "In v3, configuration lived in JavaScript. v4 changes that approach: configuration now lives directly in your CSS file, starting with ",
  "source-26": ".",
  "source-30": "With Vite, you can use the ",
  "source-33": " plugin instead of a PostCSS setup.",
  "source-34": "The @theme Directive",
  "source-37":
    " makes each variable available as both a CSS custom property and a Tailwind utility class.",
  "source-41":
    "v4 encourages OKLCH color definitions. Modern browsers with support for the wide P3 color gamut can display much more vivid colors.",
  "source-42": "New Features",
  "source-44":
    "v4 is more than a refactor: it introduces new utilities and variants:",
  "source-50": "Migrating to v4",
  "source-52":
    "An official migration tool is available for upgrading from v3 to v4. It handles most breaking changes automatically:",
  "source-55": "A summary of the main differences between v3 and v4:",
  "source-69": " and similar utilities have been removed. Instead, use the ",
  "source-71":
    " syntax. The migration tool converts most of these automatically.",
  "source-72": "Conclusion",
  "source-74":
    "Tailwind CSS v4 is both a technical rewrite and a shift in approach. CSS-first configuration relies more closely on modern web standards such as cascade layers, custom properties, and OKLCH.",
  "source-76":
    "The difference in build speed is noticeable during everyday development. On larger projects, nearly instant incremental builds make the workflow much smoother.",
  "source-78":
    "Starting a new project? Use v4 directly. For an existing project, try the migration tool and review any changes it makes.",
};

const body = structuredClone(source.posts[0].body);
function translateSpans(value) {
  if (!value || typeof value !== "object") return;
  if (value._type === "span" && translations[value._key])
    value.text = translations[value._key];
  for (const child of Object.values(value))
    if (Array.isArray(child)) child.forEach(translateSpans);
    else if (child && typeof child === "object") translateSpans(child);
}
translateSpans(body);
for (const block of body) {
  if (block._type === "benchmark")
    block.items.forEach((item, index) => {
      item.label = index === 0 ? "Initial build" : "Incremental build";
      item.before = item.before.replace("1.500", "1,500");
      item.improvement = item.improvement.replace("daha hızlı", "faster");
    });
  if (block._type === "notice")
    block.title =
      {
        "source-19": "How was this measured?",
        "source-39": "The OKLCH color space",
        "source-63": "Breaking changes",
      }[block._key] || block.title;
  if (block._type === "codeBlock") {
    block.language = block.language
      .replace("(eski)", "(old)")
      .replace("(yeni)", "(new)");
    block.code = block.code
      .replace("tek dosya, hepsi burada", "everything in one file")
      .replace("Bu tanım şunları üretir:", "This definition generates:")
      .replace("Otomatik migration", "Automatic migration")
      .replace("Manuel kurulum (yeni proje)", "Manual setup (new project)")
      .replace("Animasyonlar", "Animations");
  }
  if (block._type === "featureList") {
    const descriptions = [
      "Textareas can grow to fit their content with a single utility class.",
      "Animate elements appearing from display: none using native CSS.",
      "Negation variants such as not-hover:opacity-50 are now built in.",
      "Apply styles to elements with the inert attribute.",
    ];
    block.items.forEach((item, index) => {
      item.title = item.title.replace("desteği", "support");
      item.description = descriptions[index];
      item.badge = index === 0 ? "New utility" : "New variant";
    });
  }
  if (block._type === "comparisonTable") {
    block.columns = ["Feature", "v3", "v4"];
    const rows = [
      ["Configuration", "tailwind.config.js", "CSS @theme directive"],
      ["Build tooling", "PostCSS", "Vite plugin / CLI / PostCSS"],
      ["Initial build", "~1.5s", "~35ms"],
      ["Incremental build", "~150ms", "~4ms"],
      ["CSS variables", "Manual", "Automatically generated"],
      ["dark: variant", "class / media", "+ @custom-variant"],
    ];
    block.rows.forEach((row, index) => {
      row.cells = rows[index];
    });
  }
}

const paragraph = (text, key) => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key + "-text", text, marks: [] }],
});
const profile = {
  ...source.profile,
  greeting: "Hi, I’m Arda 👋",
  role: "Jr. Full-Stack Web Developer",
  summary:
    "Hi, I’m Arda Abacı, a 19-year-old Junior Full-Stack Developer. I build modern, responsive interfaces with HTML, CSS, Tailwind CSS, and React/Next.js. On the backend, I work with Node.js APIs and database integrations while developing my understanding of full-stack architecture.",
  introduction:
    "I’m a Junior Full-Stack Developer building scalable frontend interfaces and backend services with modern web technologies.",
  biography: [
    paragraph(
      "Hi, I’m Arda Abacı. I’m 19 years old and work as a Junior Full-Stack Developer. My interest in software began when I was young, wondering how the systems in the games I played worked. That curiosity gradually turned into a desire to build things.",
      "source-79",
    ),
    paragraph(
      "I took my first steps into web development in middle school, creating simple websites with WordPress and web hosting. That experience showed me that the web was a place where I could create things, and it marked the beginning of my software journey.",
      "source-81",
    ),
  ],
  education: [
    paragraph(
      "I’m currently a second-year Computer Engineering student at Istanbul Arel University. I study algorithms, data structures, and the fundamentals of software engineering, applying what I learn through practical projects.",
      "source-83",
    ),
    paragraph(
      "I completed high school at Nezihe Hasan Kılıç Anadolu High School, where I first began exploring software development seriously.",
      "source-85",
    ),
  ],
  focus: [
    paragraph(
      "On the frontend, I build modern, responsive interfaces with React and Next.js. I focus on component architecture, reusable structures, and interface performance.",
      "source-87",
    ),
    paragraph(
      "On the backend, I work with Node.js REST APIs, data modeling, and system design. I also have experience with PHP and Laravel, including MVC architecture, routing, and authentication.",
      "source-89",
    ),
  ],
};

const descriptions = [
  "A personal portfolio website built with modern frontend technologies.",
  "Fon Radar is a web application for visualizing financial data and investment fund analysis.",
  "A closed-source e-commerce and corporate website built with Laravel. The project includes product and category management, CRUD operations, a responsive interface, SEO improvements, and performance optimization for modamix.com.tr.",
  "A console-based banking simulation developed using object-oriented programming principles.",
  "A modern blog platform built with Next.js 16, TypeScript, and Tailwind CSS 4. It includes MongoDB and Mongoose for data management, Better Auth authentication, Cloudinary images, and a comprehensive admin panel, with an emphasis on responsive design and SEO.",
  "A closed-source CMS built with Next.js 15, TypeScript, Tailwind CSS, and SCSS. MySQL and Redis support storage and caching, while NextAuth v4 handles authentication. Its modular architecture includes user and content management, social features, badges, news, multiple languages, and an admin panel.",
  "A closed-source corporate website built with Laravel 12, MySQL, and JavaScript. An admin panel provides dynamic content management, alongside a responsive interface and SEO improvements.",
];
const projects = source.projects.map((project, index) => ({
  ...project,
  description: descriptions[index],
}));
const settings = {
  ...source.settings,
  description:
    "A personal portfolio and technical blog built with modern web technologies. Explore my React, Next.js, and Node.js projects.",
  navigation: source.settings.navigation.map((item, index) => ({
    ...item,
    label: ["Home", "Projects", "Blog", "About Me"][index],
  })),
  projectsTitle: "Projects I’ve Contributed To",
  projectsIntroduction:
    "My contributions to open-source projects and personal work across full-stack development, backend API design, frontend interfaces, and component architecture.",
  blogTitle: "Latest Blog Posts",
  blogIntroduction:
    "Explore my experiences, technical notes, and articles about web development.",
};
export const englishContent = {
  profile,
  settings,
  projects,
  posts: [
    {
      ...source.posts[0],
      title: "Tailwind CSS v4: A Faster, CSS-First Approach",
      excerpt:
        "A closer look at CSS-first configuration, the Oxide engine, and the new @theme directive in Tailwind CSS v4.",
      category: "Design",
      tags: ["tailwindcss", "css", "frontend", "performance"],
      body,
    },
  ],
};
