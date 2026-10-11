import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { documentInternationalization } from "@sanity/document-internationalization";

const singletons = new Set(["profile", "siteSettings"]);

export default defineConfig({
  name: "arda-portfolio",
  title: "Arda Portfolio",
  projectId: "w78zoc2a",
  dataset: "production",
  plugins: [
    documentInternationalization({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "tr", title: "Türkçe" },
      ],
      schemaTypes: ["post", "project"],
      languageField: "locale",
      metadataOmnisearchVisibility: false,
      callback: async ({ newDocument, destinationLanguageId, client }) => {
        if (newDocument._type === "post")
          await client
            .patch(newDocument._id)
            .set({
              author: {
                _type: "reference",
                _ref: destinationLanguageId === "en" ? "profile-en" : "profile",
              },
            })
            .commit();
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Profile")
              .child(
                S.list()
                  .title("Profile")
                  .items(
                    ["en", "tr"].map((locale) =>
                      S.listItem()
                        .title(locale === "en" ? "English" : "Türkçe")
                        .child(
                          S.document()
                            .schemaType("profile")
                            .documentId(
                              locale === "en" ? "profile-en" : "profile",
                            )
                            .initialValueTemplate(`profile-${locale}`),
                        ),
                    ),
                  ),
              ),
            S.listItem()
              .title("Site settings")
              .child(
                S.list()
                  .title("Site settings")
                  .items(
                    ["en", "tr"].map((locale) =>
                      S.listItem()
                        .title(locale === "en" ? "English" : "Türkçe")
                        .child(
                          S.document()
                            .schemaType("siteSettings")
                            .documentId(
                              locale === "en"
                                ? "siteSettings-en"
                                : "siteSettings",
                            )
                            .initialValueTemplate(`siteSettings-${locale}`),
                        ),
                    ),
                  ),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !singletons.has(item.getId() || "") &&
                item.getId() !== "translation.metadata",
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates
        .filter((template) => !singletons.has(template.schemaType))
        .map((template) =>
          template.id === "post-tr"
            ? {
                ...template,
                value: {
                  locale: "tr",
                  author: { _type: "reference", _ref: "profile" },
                },
              }
            : template,
        ),
      ...["profile", "siteSettings"].flatMap((schemaType) =>
        ["en", "tr"].map((locale) => ({
          id: `${schemaType}-${locale}`,
          title: `${schemaType} (${locale})`,
          schemaType,
          value: { locale },
        })),
      ),
    ],
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter(
        (option) =>
          !["profile", "siteSettings"].some((type) =>
            option.templateId.startsWith(type),
          ),
      ),
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action || "",
              ),
          )
        : actions,
  },
});
