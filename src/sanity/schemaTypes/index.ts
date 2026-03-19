import type { SchemaTypeDefinition } from "sanity";
import { authorType } from "./author";
import { categoryType } from "./category";
import { postType } from "./post";
import { seoType } from "./seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, authorType, categoryType, seoType],
};
