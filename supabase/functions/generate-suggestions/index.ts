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
    const { comment, platform, tone } = await req.json();

    if (!comment) {
      throw new Error('Comment is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Analyze the following comment and generate 3 specific, actionable suggestions to make it more conversational and story-driven.

Comment: "${comment}"
Platform: ${platform}
Tone: ${tone}

Generate exactly 3 suggestions that are:
- Specific and actionable (not generic advice)
- Different from each other
- Focused on making the comment more conversational, personal, or story-driven
- Concise (under 40 characters each)

Format as JSON array with exactly 3 strings. Examples:
["Add a personal anecdote", "Include specific numbers/stats", "Make it more casual & friendly"]

Return only the JSON array, no other text.`;

    console.log('Generating suggestions with prompt:', prompt);

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
            content: 'You are an expert at generating specific, actionable suggestions to improve social media comments. Always return valid JSON arrays with exactly 3 concise suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const suggestionsText = data.choices[0].message.content.trim();
    
    // Parse the JSON array from the response
    let suggestions;
    try {
      suggestions = JSON.parse(suggestionsText);
      if (!Array.isArray(suggestions) || suggestions.length !== 3) {
        throw new Error('Invalid suggestions format');
      }
    } catch (parseError) {
      console.error('Failed to parse suggestions:', suggestionsText);
      // Fallback suggestions
      suggestions = [
        "Add a personal example",
        "Include relatable details", 
        "Make it more conversational"
      ];
    }

    console.log('Generated suggestions:', suggestions);

    return new Response(
      JSON.stringify({ suggestions }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-suggestions function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate suggestions' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});