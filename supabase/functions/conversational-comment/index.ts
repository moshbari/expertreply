import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { originalComment, platform, tone, customInstructions } = await req.json();

    if (!originalComment) {
      throw new Error('Original comment is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build the prompt for conversational transformation
    let prompt = `Transform the following expert comment into a more conversational, story-driven version that feels natural and engaging.

Original expert comment:
"${originalComment}"

Platform: ${platform}
Desired tone: ${tone}

Requirements:
- Make it more conversational and relatable
- Add storytelling elements where appropriate  
- Keep the core message and expertise intact
- Sound like a real person sharing genuine experience
- Avoid being overly promotional or corporate
- Use natural language and conversational flow
- Include personal touches or relatable scenarios when relevant
- Maintain the same helpful intent but with more personality

${customInstructions ? `
Additional instructions from user:
${customInstructions}
` : ''}

Write the conversational version (4-6 sentences):`;

    console.log('Generating conversational comment with prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at transforming formal expert advice into conversational, story-driven content that feels natural and engaging. You maintain the core expertise while adding personality and relatability.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const conversationalComment = data.choices[0].message.content.trim();

    console.log('Generated conversational comment:', conversationalComment);

    return new Response(
      JSON.stringify({ comment: conversationalComment }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in conversational-comment function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate conversational comment' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});