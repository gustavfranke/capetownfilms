import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, prompt, body } = await req.json();
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
    }

    let messages;
    let systemPrompt;

    if (action === "generate") {
      systemPrompt = "You are a wedding videographer named Gustav Franke writing blog content for your website gustavfranke.com. Write in first person, confident and cinematic. You film weddings in Cape Town and destination weddings worldwide. Your style is documentary at heart, cinematic in execution. Write naturally — no AI-isms, no puffery, no 'stands as a testament to', no excessive adjectives. Sound like a real person who loves their craft.";
      messages = [{ role: "user", content: prompt }];
    } else if (action === "humanize") {
      systemPrompt = "You are a writing editor. Remove all signs of AI-generated writing. Rules: no 'stands as / serves as / marks a pivotal moment / testament / underscores / highlights its importance / evolving landscape / groundbreaking / seamless / nestled / tapestry / vibrant / fostering / cultivating / showcasing'. No em dashes. No rule-of-three. No -ing superficial analyses appended to sentences. No promotional language. Vary sentence length. Use 'is/are' not 'serves as/functions as'. Sound like a real person wrote this for their own website. Keep first-person voice throughout. Be specific, not vague.";
      messages = [{ role: "user", content: `Humanize this wedding videography blog post. Return ONLY the humanized body text, no commentary:\n\n${body}` }];
    } else {
      return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    if (action === "generate") {
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Response.json({ result: parsed });
      }
      return Response.json({ result: { title: "", body: text, slug: "", meta_title: "", meta_description: "", excerpt: "" } });
    } else {
      return Response.json({ result: text });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});