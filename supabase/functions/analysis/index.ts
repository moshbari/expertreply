import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { post, platform, tone } = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `You are my expert research assistant and ghostwriter. Analyze this social media post using the following structured format:

1. Main Problem: What is the poster asking or struggling with?

2. Emotional State: What is their emotional state or underlying need?

3. Help Needed: What type of help do they need (e.g., mindset, steps, validation)?

4. Root Cause: What is the likely root cause of their issue?

5. Key Insights: Provide 1–2 relevant facts, stats, or insights from credible sources (within the last 2 years).

6. Comment Angle: Suggest an angle for the response (e.g., relatable story, contrarian view, practical steps).

Please format your response with clear numbered sections as shown above. Do not write the final comment yet.

Platform: ${platform}
Tone: ${tone}
Post: ${post}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "OpenAI API error");
    }

    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});