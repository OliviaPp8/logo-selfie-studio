import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers setup for handling cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 与 CZ 合影的提示词
const PROMPT_WITH_CZ = `
**[任务核心指令]**
请执行一项高难度的"人物替换与虚拟合影生成"任务。你需要将上传的**用户自拍形象图2**融入到**目标背景图1**中，并生成用户与**币安创始人 CZ (Changpeng Zhao)** 并排合影的画面。

**[核心约束：ID一致性与亚洲特征保护]**
* **最高优先级：** 用户的面部必须与上传的自拍照保持**像素级的生物特征一致性**。
* **亚洲面孔保护：** 由于用户具有亚洲面孔特征，请严格依据原图的骨相、眼型（如内眦赘皮、双眼皮/单眼皮细节）和五官比例进行渲染。
* **禁止操作：** 严禁使用通用的"AI亚洲人模型"对用户面部进行重绘、美化或欧美化修改。保留原图的皮肤纹理和真实感，不要过度磨皮。

**[输入素材定义]**
1.  **用户源（自拍照）：** 用户的面部和身体特征基准。
2.  **背景源（含品牌元素的现场图）：**
    * **环境背景：** 这是一个包含币安（Binance）生态元素的活动场景。背景中可能包含关键品牌标识或文字（如：**Binance, Yzi Labs, BNB Chain, Aster, 币安** 等）。
    * **原始模特：** 仅作为站位参考，需从画面中完全移除。

**[执行步骤]**

1.  **场景重构、去人与品牌保护：**
    * **去人：** 移除背景图中的"原始模特"，自动修复被其遮挡的区域。
    * **品牌元素锁定（关键）：** 识别并严格保留背景墙/展板上的品牌关键词（**Binance, Yzi Labs, BNB Chain, Aster** 等）。确保这些 Logo 和文字清晰、不扭曲。如果在修复背景时涉及这些区域，请根据上下文逻辑补全文字，不要使其模糊。

2.  **用户主体植入（高保真模式）：**
    * 将用户植入到原模特的位置。
    * **ID锁定：** 严格锁定用户自拍照的亚洲五官特征、神态和微表情。即使在调整光影时，也不能改变面部的几何结构。
    * **透视适配：** 调整用户的大小和透视，使其完美匹配背景的空间感。

3.  **CZ (Changpeng Zhao) 的生成与融合：**
    * 利用你对 **Changpeng Zhao (CZ)** 的内部知识，在用户身旁（合影距离）生成/重绘 CZ。
    * **形象要求：** 短发、戴眼镜、亚洲面孔、亲切微笑，穿着加密圈风格休闲装（如 Binance Logo 的连帽衫或 Polo 衫）。
    * **环境互动：** CZ 的视线和身体朝向应自然向用户倾斜，形成亲密的并排合影感。
    * **光影生成：** 根据背景现场的光线（通常活动现场有各种色温的射灯），生成 CZ 的面部光影。

4.  **整体光影统一（Relighting）：**
    * 忽略用户自拍原本的布光。
    * 依据背景环境光，对**用户**和**生成的 CZ** 同时进行重打光。
    * **注意：** 如果背景中有明显的品牌色灯光（如币安黄），请在人物边缘添加相应的环境光反射，以增加真实感。
    * 处理好地面投影，确保两人脚部接地自然。

5.  **水印添加：**
    * 在生成图像的**底部中央**添加清晰文字水印。
    * 内容：\`"AIGC. Dev X: @0xOliviaPp"\`
    * 样式：简洁字体，颜色根据背景自动反色，确保可读。

**[最终检查清单]**
* [ ] 用户是否看起来完全像上传的照片（尤其是亚洲面部细节）？（是）
* [ ] 背景中的品牌 Logo（如 Binance 等）是否清晰且未被错误修改？（是）
* [ ] 画面中是否已移除原始模特并加入了 CZ？（是）
* [ ] 水印是否正确添加？（是）
`;

// 不与 CZ 合影的提示词（单人替换）
const PROMPT_WITHOUT_CZ = `
**[任务核心指令]**
请执行一项高难度的"人物替换"任务。你需要将上传的**用户自拍形象图2**融入到**目标背景图1**中，替换原有模特，生成用户单独站在该场景中的照片。

**[核心约束：ID一致性与亚洲特征保护]**
* **最高优先级：** 用户的面部必须与上传的自拍照保持**像素级的生物特征一致性**。
* **亚洲面孔保护：** 由于用户具有亚洲面孔特征，请严格依据原图的骨相、眼型（如内眦赘皮、双眼皮/单眼皮细节）和五官比例进行渲染。
* **禁止操作：** 严禁使用通用的"AI亚洲人模型"对用户面部进行重绘、美化或欧美化修改。保留原图的皮肤纹理和真实感，不要过度磨皮。

**[输入素材定义]**
1.  **用户源（自拍照）：** 用户的面部和身体特征基准。
2.  **背景源（含品牌元素的现场图）：**
    * **环境背景：** 这是一个包含币安（Binance）生态元素的活动场景。背景中可能包含关键品牌标识或文字（如：**Binance, Yzi Labs, BNB Chain, Aster, 币安** 等）。
    * **原始模特：** 仅作为站位参考，需从画面中完全移除。

**[执行步骤]**

1.  **场景重构、去人与品牌保护：**
    * **去人：** 移除背景图中的"原始模特"，自动修复被其遮挡的区域。
    * **品牌元素锁定（关键）：** 识别并严格保留背景墙/展板上的品牌关键词（**Binance, Yzi Labs, BNB Chain, Aster** 等）。确保这些 Logo 和文字清晰、不扭曲。如果在修复背景时涉及这些区域，请根据上下文逻辑补全文字，不要使其模糊。

2.  **用户主体植入（高保真模式）：**
    * 将用户植入到原模特的位置。
    * **ID锁定：** 严格锁定用户自拍照的亚洲五官特征、神态和微表情。即使在调整光影时，也不能改变面部的几何结构。
    * **透视适配：** 调整用户的大小和透视，使其完美匹配背景的空间感。

3.  **整体光影统一（Relighting）：**
    * 忽略用户自拍原本的布光。
    * 依据背景环境光，对**用户**进行重打光。
    * **注意：** 如果背景中有明显的品牌色灯光（如币安黄），请在人物边缘添加相应的环境光反射，以增加真实感。
    * 处理好地面投影，确保脚部接地自然。

4.  **水印添加：**
    * 在生成图像的**底部中央**添加清晰文字水印。
    * 内容：\`"AIGC. Dev X: @0xOliviaPp"\`
    * 样式：简洁字体，颜色根据背景自动反色，确保可读。

**[最终检查清单]**
* [ ] 用户是否看起来完全像上传的照片（尤其是亚洲面部细节）？（是）
* [ ] 背景中的品牌 Logo（如 Binance 等）是否清晰且未被错误修改？（是）
* [ ] 画面中是否只有用户一人（原模特已移除）？（是）
* [ ] 水印是否正确添加？（是）
`;

/**
 * Fetch an image from a URL, detect its MIME type, and convert it to raw Base64.
 * Returns an object containing both the mimeType and the base64 data.
 */
async function fetchImageAndDetectType(url: string): Promise<{ mimeType: string; base64: string }> {
  console.log(`Downloading template image from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch template image. Status: ${response.status} ${response.statusText}`);
  }

  // 动态获取 Content-Type
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  console.log(`Detected template image MIME type: ${mimeType}`);

  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  return {
    mimeType: mimeType,
    base64: btoa(binary),
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhoto, companyName, templateUrl, withCZ } = await req.json();

    if (!userPhoto) {
      return new Response(JSON.stringify({ error: "User photo is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!templateUrl) {
      return new Response(JSON.stringify({ error: "Template not available." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY2") || Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) {
      console.error("CRITICAL: GOOGLE_API_KEY2 (or fallback GOOGLE_API_KEY) is not set.");
      return new Response(JSON.stringify({ error: "AI service configuration error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 根据 withCZ 选择提示词
    const activePrompt = withCZ === true ? PROMPT_WITH_CZ : PROMPT_WITHOUT_CZ;
    console.log(`Processing request for: ${companyName || "Unknown"}, withCZ: ${withCZ}`);

    // 动态处理用户上传图片的 MIME Type
    let userPhotoRawBase64 = userPhoto;
    let userMimeType = "image/jpeg";

    if (userPhoto.startsWith("data:")) {
      const matches = userPhoto.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        userMimeType = matches[1];
        userPhotoRawBase64 = matches[2];
        console.log(`Detected user photo MIME type: ${userMimeType}`);
      } else {
        console.warn("Could not parse user photo data URI correctly, falling back to default jpeg treatment.");
        userPhotoRawBase64 = userPhoto.split(",")[1];
      }
    }

    // 动态处理模板图片的 MIME Type
    let templateData: { mimeType: string; base64: string };
    try {
      templateData = await fetchImageAndDetectType(templateUrl);
    } catch (fetchError) {
      console.error("Error downloading template image:", fetchError);
      return new Response(
        JSON.stringify({
          error: `Failed to download template image: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("Images prepared. Calling Google Gemini API...");
    console.log(`User MIME: ${userMimeType}, Template MIME: ${templateData.mimeType}`);
    console.log(`Using prompt: ${withCZ ? "WITH_CZ" : "WITHOUT_CZ"}`);

    // Call Google Gemini API
    const response = await fetch(
      `https://llmapi.arcane-ai.net/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: activePrompt },
                {
                  inline_data: {
                    mime_type: userMimeType,
                    data: userPhotoRawBase64,
                  },
                },
                {
                  inline_data: {
                    mime_type: templateData.mimeType,
                    data: templateData.base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google API FAILED. Status: ${response.status}`);
      console.error(`Google API Error Response Body: ${errorText}`);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ error: `AI service failed with status ${response.status}. Check backend logs for details.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    console.log("Google API response received. Parsing...");

    const parts = data.candidates?.[0]?.content?.parts;
    let generatedImageDataUri: string | null = null;

    if (parts && Array.isArray(parts)) {
      for (const part of parts) {
        const inline = (part as any).inlineData || (part as any).inline_data;
        const mimeType = inline?.mimeType || inline?.mime_type;
        const b64 = inline?.data;

        if (mimeType && b64) {
          console.log(`Found generated image. MimeType: ${mimeType}`);
          generatedImageDataUri = `data:${mimeType};base64,${b64}`;
          break;
        }
      }
    }

    if (!generatedImageDataUri) {
      console.error(
        "Google API response OK, but no image found in output:",
        JSON.stringify(data).substring(0, 500) + "...",
      );
      return new Response(
        JSON.stringify({ error: "AI successfully responded but did not generate an image. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        image: generatedImageDataUri,
        message: "Image generated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Unhandled error in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
