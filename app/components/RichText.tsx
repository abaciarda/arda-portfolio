import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import CodeBlock from "../blog/components/CodeBlock";
import InfoBox from "../blog/components/InfoBox";
import Badge from "../blog/components/Badge";
import ComparisonTable from "../blog/components/ComparisonTable";
import type { Color, RichTextNode } from "../sanity/types";

export function headingId(block: Pick<PortableTextBlock, "_key">) {
  return `heading-${block._key}`;
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground/60 font-light leading-relaxed mb-4">
        {children}
      </p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={headingId(value)}
        className="text-xl font-semibold mt-10 mb-3 scroll-mt-24"
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={headingId(value)}
        className="text-lg font-semibold mt-6 mb-3 scroll-mt-24"
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-sky-400/50 pl-4 my-6 text-foreground/60">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-foreground/80 font-medium">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="text-sky-400/80 bg-sky-500/10 px-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href =
        typeof value?.href === "string" &&
        /^(https?:\/\/|mailto:|\/(?!\/)|#)/.test(value.href)
          ? value.href
          : "#";
      return (
        <a
          href={href}
          className="text-sky-400 underline underline-offset-4"
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 text-foreground/60 space-y-2">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 text-foreground/60 space-y-2">
        {children}
      </ol>
    ),
  },
  types: {
    codeBlock: ({ value }: { value: { code: string; language: string } }) => (
      <CodeBlock code={value.code} language={value.language} />
    ),
    notice: ({
      value,
    }: {
      value: {
        type: "tip" | "warning" | "info";
        title: string;
        body: RichTextNode[];
      };
    }) => (
      <InfoBox type={value.type} title={value.title}>
        <RichText value={value.body} />
      </InfoBox>
    ),
    badge: ({ value }: { value: { label: string; color: Color } }) => (
      <Badge color={value.color}>{value.label}</Badge>
    ),
    comparisonTable: ({
      value,
    }: {
      value: { columns: string[]; rows: { _key: string; cells: string[] }[] };
    }) => <ComparisonTable columns={value.columns} rows={value.rows} />,
    benchmark: ({
      value,
    }: {
      value: {
        items: {
          _key: string;
          label: string;
          before: string;
          after: string;
          improvement: string;
        }[];
      };
    }) => (
      <div className="grid sm:grid-cols-2 gap-3 my-6">
        {value.items.map((item) => (
          <div
            key={item._key}
            className="border border-foreground/10 p-4 rounded flex flex-col gap-2"
          >
            <p className="text-[10px] uppercase tracking-widest text-foreground/30">
              {item.label}
            </p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-foreground/30 font-mono line-through">
                  {item.before}
                </p>
                <p className="text-lg font-semibold text-sky-400 font-mono">
                  {item.after}
                </p>
              </div>
              <Badge color="green">{item.improvement}</Badge>
            </div>
          </div>
        ))}
      </div>
    ),
    featureList: ({
      value,
    }: {
      value: {
        items: {
          _key: string;
          title: string;
          description: string;
          badge: string;
          color: Color;
        }[];
      };
    }) => (
      <div className="flex flex-col gap-3 my-6">
        {value.items.map((item) => (
          <div
            key={item._key}
            className="p-4 border border-foreground/10 rounded"
          >
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <code className="text-sky-400/80 bg-sky-500/10 px-1.5 py-0.5 rounded text-xs font-mono">
                {item.title}
              </code>
              <Badge color={item.color}>{item.badge}</Badge>
            </div>
            <p className="text-sm text-foreground/50 font-light">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    ),
    articleImage: ({
      value,
    }: {
      value: { url: string; alt: string; caption?: string };
    }) =>
      value.url ? (
        <figure className="my-6">
          <Image
            src={value.url}
            alt={value.alt || ""}
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 100vw, 800px"
            className="w-full h-auto rounded"
          />
          {value.caption && (
            <figcaption className="text-xs text-foreground/40 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
};

export default function RichText({ value }: { value: RichTextNode[] }) {
  return <PortableText value={value} components={components} />;
}
