import type { IconType } from "react-icons";
import {
  FaCss3,
  FaGithub,
  FaInstagram,
  FaJs,
  FaLinkedin,
  FaNodeJs,
  FaPhp,
  FaReact,
} from "react-icons/fa";
import {
  SiGit,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { Profile } from "../sanity/types";

const skills: Record<string, [IconType, string]> = {
  JavaScript: [FaJs, "text-yellow-400"],
  TypeScript: [SiTypescript, "text-blue-400"],
  React: [FaReact, "text-cyan-400"],
  "Next.js": [SiNextdotjs, "text-white"],
  Tailwind: [SiTailwindcss, "text-sky-400"],
  CSS: [FaCss3, "text-blue-400"],
  "Node.js": [FaNodeJs, "text-green-500"],
  PHP: [FaPhp, "text-indigo-400"],
  Laravel: [SiLaravel, "text-red-500"],
  MongoDB: [SiMongodb, "text-green-400"],
  MySQL: [SiMysql, "text-blue-400"],
  Git: [SiGit, "text-orange-400"],
};

export function Skills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const match = skills[item];
        const Icon = match?.[0];
        return (
          <div
            key={item}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/10 rounded text-white/70 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            {Icon && <Icon aria-hidden="true" focusable="false" className={`${match[1]} text-sm`} />}
            <span className="text-sm">{item}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SocialLinks({
  profile,
  instagram = false,
}: {
  profile: Profile;
  instagram?: boolean;
}) {
  const links = [
    {
      href: profile.github,
      label: "GitHub",
      Icon: FaGithub,
      color: "text-white",
    },
    {
      href: profile.linkedin,
      label: "LinkedIn",
      Icon: FaLinkedin,
      color: "text-[#0A66C2]",
    },
    ...(instagram
      ? [
          {
            href: profile.instagram,
            label: "Instagram",
            Icon: FaInstagram,
            color: "text-[#E1306C]",
          },
        ]
      : []),
  ];
  return (
    <div className="social-links flex flex-wrap items-center gap-3 mt-4">
      {links
        .filter((link) => link.href)
        .map(({ href, label, Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 bg-black/20 rounded border border-white/5 hover:bg-black/30 transition-colors"
          >
            <Icon aria-hidden="true" focusable="false" className={color} />
            <span className="text-sm text-white/80">{label}</span>
          </a>
        ))}
    </div>
  );
}
