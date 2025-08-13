import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post, currentAnalysis, improvementInstructions, platform, tone } = await req.json();

    const systemPrompt = `You are an expert research assistant and ghostwriter. Your task is to improve an existing post analysis based on user feedback and instructions.

IMPROVEMENT RULES:
1. Build upon the current analysis - don't completely rewrite unless needed
2. Address the specific improvement instructions provided
3. Maintain the same analytical depth and structure
4. Keep it focused on the original post content
5. Use the same tone and platform consideration as the original

Current Analysis:
${currentAnalysis}

Improvement Instructions:
${improvementInstructions}

Platform: ${platform}
Tone: ${tone}

Please provide an improved analysis that addresses the user's specific feedback while maintaining the analytical framework. Keep the same section structure but enhance the content based on the improvement instructions.`;

    const userPrompt = `Original Post: ${post}

Please improve the analysis based on the instructions provided, maintaining the analytical depth while addressing the specific improvements requested.`;

    console.log('Improving analysis for platform:', platform, 'with tone:', tone);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const improvedAnalysis = data.choices[0].message.content;

    console.log('Analysis improvement completed successfully');

    return new Response(JSON.stringify({ analysis: improvedAnalysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in improve-analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});