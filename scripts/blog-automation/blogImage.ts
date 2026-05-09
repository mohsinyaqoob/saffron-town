import { GoogleGenAI, Modality } from "@google/genai";
import { with429Retries } from "./geminiRetry";
import type { AutomationEnv } from "./loadEnv";

export type BlogHeroMeta = {
  title: string;
  seoDescription: string;
  keyword: string;
  mainImageAlt: string;
};

export async function generateBlogHeroImageBuffer(
  env: AutomationEnv,
  meta: BlogHeroMeta,
): Promise<{ buffer: Buffer; mimeType: string }> {
  if (!env.geminiApiKey) {
    throw new Error("GEMINI_API_KEY required for image generation");
  }

  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  const context = `${meta.title}. ${meta.seoDescription}`.slice(0, 550);
  const prompt = `Create one editorial **hero photograph** for a premium Kashmiri saffron brand blog (Saffron Town). The shot must **clearly reflect the article topic** — props, dish type, or ingredient story should match the title and keyword, not a generic spice pile.

Article context:
Title: ${meta.title}
Topic keyword: ${meta.keyword}
Summary: ${context}
Hero / alt-text brief: ${meta.mainImageAlt}

**Indian look and feel (authentic, not cliché):** believable North Indian / Kashmiri home or studio table context — e.g. brass katori or hammered metal plate, terracotta or wood surface, soft handloom linen napkin, subtle dried rose or cardamom pods **only if** they fit the topic. Warm late-afternoon window light or soft north-light feel, natural shadows, slight imperfections (crumbs, uneven threads) so it feels **real**, not sterile stock. If saffron appears, show **deep crimson threads** with realistic golden infusion where liquid is part of the scene.

**Visual quality:** photorealistic, magazine-quality food or ingredient photography, shallow depth of field, creamy bokeh, accurate color science, appetizing but not oversaturated. Coherent composition with one clear hero subject.

**Hard bans:** no text, typography, logos, brand marks, watermarks. No readable labels on jars. No recognizable human faces or hands as the focal point (incidental background only if unavoidable and not identifiable). No Taj-Mahal tourism postcard aesthetic or random “festival” clutter unless the topic truly calls for it.`;

  const response = await with429Retries("Gemini image", () =>
    ai.models.generateContent({
      model: env.geminiImageModel,
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    }),
  );

  const parts = response.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find(
    (p) => p.inlineData?.data && p.inlineData?.mimeType,
  );
  const data = imagePart?.inlineData?.data;
  const mimeType = imagePart?.inlineData?.mimeType ?? "image/png";
  if (!data) {
    throw new Error("Gemini image model returned no inline image data");
  }

  return { buffer: Buffer.from(data, "base64"), mimeType };
}
