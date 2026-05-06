import type { StructureResolver } from "sanity/structure";
import { JOURNAL_SETTINGS_DOCUMENT_ID } from "./queries";

// https://www.sanity.io/docs/structure-builder-cheat-sheet

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Journal settings")
        .id("journal-settings")
        .icon(() => "⚙️")
        .child(
          S.document()
            .schemaType("journalSettings")
            .documentId(JOURNAL_SETTINGS_DOCUMENT_ID),
        ),
      S.divider(),
      S.listItem()
        .title("Blog Posts")
        .icon(() => "📝")
        .child(S.documentTypeList("post").title("Blog Posts")),
      S.divider(),
      S.listItem()
        .title("Authors")
        .icon(() => "👤")
        .child(S.documentTypeList("author").title("Authors")),
      S.listItem()
        .title("Categories")
        .icon(() => "🏷️")
        .child(S.documentTypeList("category").title("Categories")),
    ]);
