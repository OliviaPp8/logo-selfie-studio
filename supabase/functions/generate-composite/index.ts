import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COMPOSITE_PROMPT = `**[任务指令]**

请参考我上传的两张图片，执行一项专业级的人物替换与背景合成任务。你的核心目标是让用户完美替代原模特，保持原有的构图比例，并且**严格保留目标场景中除非人物以外的所有原始元素**。

**[图像角色定义]**

*   将第一张图片（用户的**全身自拍照**）视为唯一的人物主体源。

*   将第二张图片（包含模特和背景的**合影**）视为目标场景、位置、构图以及**必须保留的环境元素参考**。

**[执行步骤]**

1.  **主体隔离（准备工作）：** 从用户自拍照中，精准抠出干净、完整的用户人像主体。移除所有原始背景杂质。

2.  **场景准备与严格保留（关键）：** 在目标背景合影中，仅移除原有的模特。

    *   **极其重要：** 除模特本人外，画面中的所有其他元素（包括但不限于：前景桌面的物品、饮料、手机、标志牌、背景墙上的所有文字和图案、道具、光斑等）**必须保持百分之百原样**，不得有任何移动、删除、模糊或修改。你只需修复被模特身体直接遮挡的那部分背景区域。

3.  **构图分析与替换（关键步骤）：**

    *   **分析原构图：** 仔细观察原模特在背景图中的取景范围（是全身、半身还是特写？）以及其在画面中的大小比例。

    *   **匹配与裁剪：** 将第1步抠出的用户主体放置在原模特的位置。根据原模特的构图，对用户主体进行必要的缩放和裁剪。如果原模特是半身像，请相应地裁剪用户为半身像。确保用户在最终画面中的大小占比和取景范围与原模特高度一致。

4.  **光影融合与细节：**

    *   忽略用户自拍的光线，完全依据新背景场景的现场光照方向、色温和强度，重新渲染用户身上的光影。

    *   **接触处理：** 重点处理用户身体边缘与保留下来的前景元素（如桌子边缘）的融合，确保遮挡关系正确，没有悬浮感。

**[最终要求]**

生成的照片中只能有用户自己单独站在该背景中。其大小、比例和构图完美复刻了原照片的风格。**背景场景（包括所有前景物品和背景细节）必须与原图完全一致，未发生任何改变**，看起来完全真实自然。`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPhoto, companyName, templateUrl } = await req.json();

    if (!userPhoto) {
      return new Response(
        JSON.stringify({ error: 'User photo is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!templateUrl) {
      return new Response(
        JSON.stringify({ error: 'Template not available for this company yet.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing composite request for company: ${companyName}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: COMPOSITE_PROMPT
              },
              {
                type: 'image_url',
                image_url: {
                  url: userPhoto
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: templateUrl
                }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received successfully');

    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImage) {
      console.error('No image in AI response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'No image was generated. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        image: generatedImage,
        message: data.choices?.[0]?.message?.content || 'Image generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-composite function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
