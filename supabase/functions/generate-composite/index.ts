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

// Vibe Checking 模式提示词（单人Drama主角版）
const PROMPT_VIBE = `
**[任务核心指令：AI 创意导演模式 - 单人主角版]**
请执行一项极具视觉冲击力的"单人场景替换与动作重塑"任务。目标是将上传的**用户自拍形象**完美融入**目标背景图**中，并生成一张用户在活动现场**充满自信、夸张、戏剧张力（Drama Vibe）**的单人主角大片。

**关键变更（导演权限）：**
你拥有**动作重绘权**。请完全忽略用户自拍照原本的姿势（Pose），仅提取用户的面部 ID。你需要为用户设计一个全新的、充满"主角能量"的**高动态/夸张姿势**，使其主宰整个画面。

**[风格定义：Social Media Spotlight]**
* **氛围：** 这不是一张普通的打卡照，而是一张像是在红毯或顶级活动现场抓拍的"神图"。
* **关键词：** Confident (自信), Dynamic (动态), Exaggerated (夸张), Main Character Energy (主角能量), Viral (网感).

**[输入素材处理与空间定义]**
1.  **用户源（自拍）：**
    * **核心提取（ID锁定）：** 仅提取用户的**面部生物特征（ID）**。
    * **亚洲特征保护（最高优先级）：** 严格保留用户的亚洲五官比例、眼型、骨相和神态，严禁欧美化或过度磨皮。
    * **配饰保留：** 如果用户自拍中有墨镜、特殊的发饰或夸张的耳环，请务必在新的动作中保留这些增加 Drama 感的元素。
2.  **背景源（含参考模特的现场图）：**
    * **空间锚点（关键）：** 背景图中的**原始模特**仅用于提供**人物站位坐标**和**透视关系（Perspective/Scale）**参考。
    * **处理逻辑：** 分析原模特的脚部位置和身高比例，确定用户在新画面中的三维空间坐标。**分析完成后，必须将原始模特彻底移除。**
    * **品牌保护：** 严格识别并保护背景墙上的所有品牌元素（Binance, Aster, BNB Chain 等），确保 Logo 清晰锐利。

**[单人 Drama 动作剧本（AI 请从中选择一种风格执行）]**

* **剧本 A： "The Queen/King Arrives" (霸气登场)**
    * **动作描述：** 自信的宽站位，双手叉腰，下巴微扬，眼神犀利地看向镜头（或略带不屑地看向侧面）。气场全开。
* **剧本 B： "Look At This!" (夸张展示)**
    * **动作描述：** 身体大幅度侧转，一只手夸张地指向身后背景墙上的Logo，表情极其兴奋或惊讶（张嘴大笑或 "Wow" 的表情）。
* **剧本 C： "Vogue Moment" (时尚大片)**
    * **动作描述：** 极具张力的肢体语言，例如一只手高举扶着后脑勺，另一只手插兜，身体呈现充满活力的线条感（S型或大角度倾斜）。
* **剧本 D： 其他随机Drama动作**

**[执行步骤]**

1.  **空间清理与重建：**
    * 移除原始模特。
    * 完美修复被模特遮挡的背景墙区域，确保品牌 Logo 和墙面纹理完整、真实。

2.  **主角生成与重绘（Director Mode）：**
    * 在确定的**空间锚点**上，生成用户全新的"Drama 动作"身体。
    * 将用户的面部 ID 完美融合到新身体上，确保头身比例协调，表情与动作的夸张程度匹配。

3.  **戏剧化光影渲染（Stage Lighting）：**
    * **拒绝平淡：** 不要使用均匀的漫射光。模拟活动现场的**聚光灯（Spotlight）**效果。
    * **高光与轮廓：** 在用户的头发边缘、肩膀和肢体动作的受光面添加强烈的**轮廓光（Rim Light）**，使人物从背景中"跳脱"出来，增强立体感和戏剧感。
    * 确保新动作在地面上有正确透视的投影。

4.  **水印添加：**
    * 底部中央添加水印：\`"AIGC. Dev X: @0xOliviaPp"\`

**[最终检查]**
* [ ] 画面中是否只剩下用户一人？
* [ ] 用户的面部 ID 是否准确（未变形），且具有明显的亚洲特征？
* [ ] 用户的姿势是否足够夸张、自信（Drama），而不是呆板站立？
* [ ] 背景的品牌 Logo 是否清晰完整？
`;

// Vibe Checking + CZ 合影模式提示词（Drama风格 + CZ互动）
const PROMPT_VIBE_WITH_CZ = `
**[任务核心指令：AI 创意导演模式]**

请执行一项极具创意的"虚拟合影生成"任务。目标是生成一张**用户与币安创始人 CZ (Changpeng Zhao)** 在活动现场的**趣味、夸张、高互动性（Drama Vibe）**合影。

**关键变更：** 你拥有**动作重绘权**。请忽略用户自拍照原本的僵硬姿势，仅提取用户的面部 ID。你需要为用户和 CZ 设计一套全新的、充满化学反应的**互动动作**。

**[输入素材处理与空间定义]**

1.  **用户源（自拍）：**
    * **核心提取：** 仅提取用户的**面部生物特征（ID）**。
    * **亚洲特征保护：** 严格保留用户的亚洲五官比例、眼型和神态。

2.  **背景源（含参考模特的现场图）：**
    * **空间锚点（关键）：** 背景图中的**原始模特**仅用于提供**人物站位坐标**和**透视关系（Perspective/Scale）**。
    * **处理逻辑：** 请分析原始模特的脚部接地位置和头顶高度，以此确定用户在三维空间中的正确位置和大小比例。**分析完成后，必须将原始模特从画面中彻底移除**，并在该坐标位置生成新的用户形象。

**[互动剧本设计（请从中随机选择一种风格执行）]**

* **剧本 A： "The Cool Kids" (酷盖搭档)**
    * **用户动作：** 双手抱胸、推墨镜、或者对着镜头比夸张的 "Rock n Roll" / "Peace" 手势。身体自信地侧向 CZ。
    * **CZ 动作：** CZ 配合地比出大拇指，或者比出数字4的手势，或者做一个 "Mind Blown" (脑洞大开) 的手势，表情惊讶或大笑。

* **剧本 B： "The Paparazzi Moment" (躲避狗仔)**
    * **用户动作：** 用手遮挡脸部（但在指缝中露出眼睛），或者做出 "嘘" (Shushing) 的手势。
    * **CZ 动作：** CZ 看起来像是被抓拍，指着镜头笑，或者摊手表示无奈。

* **剧本 C： "Future Tech Vision" (展望未来)**
    * **用户动作：** 手指指向前方或上方，表情夸张兴奋。
    * **CZ 动作：** 顺着用户手指的方向看去，表情配合演出，仿佛看到了币价暴涨。

* **剧本 D： 其他随机Drama场景**

**[执行步骤]**

1.  **空间定位与去人：**
    * **定位：** 锁定原模特在地面的站立点（Anchor Point）。
    * **移除：** 移除原模特，修复背景。
    * **品牌背景：** 识别并重绘背景中的品牌元素（Binance, BNB Chain, Aster 等），确保 Logo 清晰。

2.  **角色生成与重绘：**
    * **CZ 生成：** 在用户旁边的合理透视位置（参考原图透视）生成 CZ。表情必须生动（大笑、惊讶、搞怪）。
    * **用户重塑：** 在**原模特的坐标点**上，生成做着"Drama动作"的用户身体，并完美融合用户的面部 ID。
    * **安全边界：** 两人表现为"好朋友"互动，**严禁**任何亲密/浪漫举动（如亲吻、搂抱腰部）。

3.  **光影与环境渲染：**
    * 使用**高饱和度、高对比度**的灯光，模拟活动现场的闪光灯效果。
    * 确保新生成的夸张动作（如伸出的手、倾斜的身体）在地面上有符合透视关系的投影。

4.  **水印添加：**
    * 底部中央添加水印：\`"AIGC. Dev X: @0xOliviaPp"\`

**[最终检查]**
* [ ] 用户的**站位和大小**是否符合背景原有的透视关系（没有悬浮或比例失调）？
* [ ] 画面中是否已移除原始模特？
* [ ] 用户的面部 ID 是否准确，且动作充满趣味性？
* [ ] CZ 的形象是否生动、互动感强？
`;

/**
 * Parse a base64 data URI and extract MIME type and raw base64 data
 */
function parseDataUri(dataUri: string): { mimeType: string; base64: string } {
  if (dataUri.startsWith("data:")) {
    const matches = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        base64: matches[2],
      };
    }
    // Fallback: try splitting by comma
    const parts = dataUri.split(",");
    if (parts.length === 2) {
      return {
        mimeType: "image/jpeg",
        base64: parts[1],
      };
    }
  }
  // If not a data URI, assume it's raw base64
  return {
    mimeType: "image/jpeg",
    base64: dataUri,
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhoto, companyName, templatePhoto, withCZ, mode } = await req.json();

    if (!userPhoto) {
      return new Response(JSON.stringify({ error: "User photo is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!templatePhoto) {
      return new Response(JSON.stringify({ error: "Template photo is required." }), {
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

    // 根据 mode 和 withCZ 选择提示词（4种组合）
    let activePrompt: string;
    if (mode === "vibe") {
      // Vibe Checking 模式：根据 withCZ 选择 Drama 风格
      activePrompt = withCZ === true ? PROMPT_VIBE_WITH_CZ : PROMPT_VIBE;
    } else {
      // 普通生成模式：根据 withCZ 选择
      activePrompt = withCZ === true ? PROMPT_WITH_CZ : PROMPT_WITHOUT_CZ;
    }
    const promptType = `${mode === "vibe" ? "VIBE" : "NORMAL"}_${withCZ ? "WITH_CZ" : "WITHOUT_CZ"}`;
    console.log(`Processing request for: ${companyName || "Unknown"}, mode: ${mode}, withCZ: ${withCZ}, prompt: ${promptType}`);

    // Parse user photo
    const userData = parseDataUri(userPhoto);
    console.log(`User photo MIME: ${userData.mimeType}`);

    // Parse template photo (now sent as base64 from client)
    const templateData = parseDataUri(templatePhoto);
    console.log(`Template photo MIME: ${templateData.mimeType}`);

    console.log("Images prepared. Calling Google Gemini API...");
    console.log(`Using prompt: ${promptType}`);

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
                    mime_type: userData.mimeType,
                    data: userData.base64,
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
