import type { SchemaTypeDefinition } from "sanity";
import { authorType } from "./author";
import { categoryType } from "./category";
import { journalSettingsType } from "./journalSettings";
import { postType } from "./post";
import { seoType } from "./seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [journalSettingsType, postType, authorType, categoryType, seoType],
};
