import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers setup for handling cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// The detailed composite prompt (Prompt 内容保持不变)
const COMPOSITE_PROMPT = `
**[任务指令]**
请参考我上传的两张图片，执行一项专业级的人物替换与背景合成任务。你的核心目标是将用户主体完美融入目标背景中。在此过程中，必须**严格保留用户自拍照中原有的面部表情和身体姿势**，同时保持原背景图的构图比例，并**严格保留目标场景中除非人物以外的所有原始元素**。最后，需要在生成图像的特定位置添加指定的文字水印。

**[图像角色定义]**
*   将包含用户的**全身自拍照**视为唯一的人物主体源。**用户的表情、眼神、肢体动作和姿态必须完全依据此图，不得更改。**
*   将包含模特和背景的**合影**视为目标场景、站位点（仅指脚下位置，而非姿态）、构图比例以及**必须保留的环境元素参考**。**绝不要参考该图中原模特的表情或肢体动作。**

**[执行步骤]**
1.  **主体隔离（准备工作）：** 从用户自拍照中，精准抠出干净、完整的用户人像主体。移除所有原始背景杂质。
2.  **场景准备与严格保留（关键）：** 在目标背景合影中，仅移除原有的模特。
    *   **极其重要：** 除模特本人外，画面中的所有其他元素（包括但不限于：前景桌面的物品、饮料、手机、标志牌、背景墙上的所有文字和图案、道具、光斑、阴影细节等）**必须保持百分之百原样**，不得有任何移动、删除、模糊或修改。你只需修复被模特身体直接遮挡的那部分背景区域。
3.  **构图分析与替换（关键步骤）：**
    *   **分析原构图：** 仔细观察原模特在背景图中的取景范围（是全身、半身还是特写？）以及其在画面中的大小占比。
    *   **匹配与裁剪（核心要求）：** 将第1步抠出的用户主体放置在原模特所在的站位点。
    *   **姿势锁定：在放置过程中，必须完全锁定并保持用户自拍照中原有的表情和姿势，严禁对用户的动作进行任何重绘、扭曲，或模仿背景原模特的姿态。**
    *   仅根据原模特的构图比例，对用户主体进行必要的整体缩放和边缘裁剪，确保用户在最终画面中的大小占比和取景范围与原模特高度一致。
4.  **光影融合与细节：**
    *   忽略用户自拍原本的光线，完全依据新背景场景的现场光照方向、色温和强度，重新渲染用户身上的光影和投影，使其看起来完全融合。
    *   **接触处理：** 重点处理用户身体边缘与保留下来的前景元素（如桌子边缘、地面）的融合，确保遮挡关系正确，脚部接地自然，没有悬浮感。
5.  **水印添加（最终步骤）：**
    *   在图像合成与光影处理完全结束后，在画面的**底部中央**位置添加文字水印。
    *   水印内容为："Dev X: @0xOliviaPp"
    *   水印应清晰可见，字体风格简洁大方，颜色需根据背景色自动调整（例如深色背景用浅色字体，浅色背景用深色字体），以确保可读性且不破坏画面和谐。

**[最终要求]**
生成的照片中只能有用户自己单独站在该背景中。**用户的表情和姿势必须与提供的自拍照完全一致，不能采用背景图原模特的表情姿势。** 人物的大小、比例和整体构图完美复刻了原照片的风格。背景场景（包括所有前景物品和背景细节）必须与原图完全一致，未发生任何改变，看起来完全真实自然。**图像底部中央必须包含指定的文字水印 "Dev X: @0xOliviaPp"。**`;

/**
 * [修改后的辅助函数]
 * Fetch an image from a URL, detect its MIME type, and convert it to raw Base64.
 * Returns an object containing both the mimeType and the base64 data.
 */
async function fetchImageAndDetectType(
  url: string
): Promise<{ mimeType: string; base64: string }> {
  console.log(`Downloading template image from: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch template image. Status: ${response.status} ${response.statusText}`
    );
  }

  // 1. 动态获取 Content-Type
  const mimeType = response.headers.get("content-type") || "image/jpeg"; // Default to jpeg if missing
  console.log(`Detected template image MIME type: ${mimeType}`);

  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  // 2. 返回类型和数据
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
    const { userPhoto, companyName, templateUrl } = await req.json();

    if (!userPhoto) {
      return new Response(JSON.stringify({ error: "User photo is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!templateUrl) {
      return new Response(
        JSON.stringify({ error: "Template not available." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) {
      console.error("CRITICAL: GOOGLE_API_KEY is not set.");
      return new Response(
        JSON.stringify({ error: "AI service configuration error." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing request for: ${companyName || "Unknown"}`);

    // --- 修复核心：动态处理用户上传图片的 MIME Type ---
    let userPhotoRawBase64 = userPhoto;
    let userMimeType = "image/jpeg"; // 默认回退值

    if (userPhoto.startsWith("data:")) {
      // 使用正则提取真实的 MIME type
      const matches = userPhoto.match(
        /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/
      );
      if (matches && matches.length === 3) {
        userMimeType = matches[1];
        userPhotoRawBase64 = matches[2];
        console.log(`Detected user photo MIME type: ${userMimeType}`);
      } else {
        console.warn(
          "Could not parse user photo data URI correctly, falling back to default jpeg treatment."
        );
        // Fallback for simple split if regex fails, though less accurate
        userPhotoRawBase64 = userPhoto.split(",")[1];
      }
    }

    // --- 修复核心：动态处理模板图片的 MIME Type ---
    let templateData: { mimeType: string; base64: string };
    try {
      // 使用新的辅助函数
      templateData = await fetchImageAndDetectType(templateUrl);
    } catch (fetchError) {
      console.error("Error downloading template image:", fetchError);
      return new Response(
        JSON.stringify({
          error: `Failed to download template image: ${
            fetchError instanceof Error ? fetchError.message : "Unknown error"
          }`,
        }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(
      "Images prepared. Calling Google Gemini API...",
      userMimeType,
      templateData.mimeType,
      userPhotoRawBase64.slice(0, 30) + "...",
      templateData.base64.slice(0, 30) + "..."
    );

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: COMPOSITE_PROMPT },
                {
                  inline_data: {
                    // --- 使用动态获取的类型 ---
                    mime_type: userMimeType,
                    data: userPhotoRawBase64,
                  },
                },
                {
                  inline_data: {
                    // --- 使用动态获取的类型 ---
                    mime_type: templateData.mimeType,
                    data: templateData.base64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      // --- 增加详细的错误日志 ---
      const errorText = await response.text();
      console.error(`Google API FAILED. Status: ${response.status}`);
      console.error(`Google API Error Response Body: ${errorText}`); // 这里会打印出 400 的具体原因

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Return a more informative error to the client if possible, or stick to generic
      return new Response(
        JSON.stringify({
          error: `AI service failed with status ${response.status}. Check backend logs for details.`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    console.log("Google API response received. Parsing...");

    const parts = data.candidates?.[0]?.content?.parts;
    let generatedImageDataUri = null;

    if (parts && Array.isArray(parts)) {
      for (const part of parts) {
        if (part.inline_data && part.inline_data.data) {
          console.log(
            `Found generated image. MimeType: ${part.inline_data.mime_type}`
          );
          generatedImageDataUri = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
          break; // Found image, stop searching
        }
      }
    }

    if (!generatedImageDataUri) {
      console.error(
        "Google API response OK, but no image found in output:",
        JSON.stringify(data).substring(0, 200) + "..."
      );
      return new Response(
        JSON.stringify({
          error:
            "AI successfully responded but did not generate an image. Please try again.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        image: generatedImageDataUri,
        message: "Image generated successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unhandled error in Edge Function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
