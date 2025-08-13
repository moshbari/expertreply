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
    const { analysis, platform, tone } = await req.json();

    const systemPrompt = `You are an expert analysis improvement advisor. Based on the provided post analysis, generate 3 short, actionable suggestions for improving the analysis.

SUGGESTION RULES:
1. Each suggestion should be 2-4 words maximum
2. Focus on adding depth, context, or insights
3. Be specific to the analysis content provided
4. Consider the platform (${platform}) and tone (${tone})
5. Suggest improvements that would make the analysis more valuable
6. Return ONLY the suggestions, no explanatory text or meta-commentary

Examples of good suggestions:
- "Add competitor data"
- "Include user demographics" 
- "Expand emotional context"
- "Add market trends"
- "Include success metrics"
- "Focus on pain points"

Current Analysis:
${analysis}

Generate exactly 3 short suggestions as a simple list. No explanations or meta-text.`;

    console.log('Generating analysis improvement suggestions for platform:', platform, 'with tone:', tone);

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
          { role: 'user', content: 'Generate 3 short improvement suggestions for this analysis.' }
        ],
        temperature: 0.8,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const suggestionsText = data.choices[0].message.content;
    
    // Parse suggestions from the response
    const suggestions = suggestionsText
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0 && line.length < 30)
      .slice(0, 3);

    // Fallback if parsing fails
    if (suggestions.length < 3) {
      suggestions.push(...[
        "Add more context",
        "Include specific data",
        "Expand key insights"
      ].slice(0, 3 - suggestions.length));
    }

    console.log('Analysis suggestions generated successfully:', suggestions);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analysis-suggestions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});