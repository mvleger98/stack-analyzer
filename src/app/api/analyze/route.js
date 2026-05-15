export async function POST(request) {
  const { supplements } = await request.json();

  if (!supplements || supplements.length === 0) {
    return Response.json({ error: "No supplements provided" }, { status: 400 });
  }

  const prompt = `You are a supplement science expert. Analyze this supplement stack and return ONLY valid JSON, no markdown, no explanation.

Supplements: ${supplements.join(", ")}

Return this exact JSON structure:
{
  "overall": "One sentence summary of this stack overall.",
  "score": 85,
  "scoreLabel": "Well-Optimized",
  "items": [
    {
      "name": "Supplement Name",
      "emoji": "💊",
      "dose": "Recommended dose (e.g. 5g/day)",
      "evidence": "Strong|Moderate|Limited|Weak",
      "timing": "Morning|Evening|Night|With food|Anytime|Pre-workout",
      "summary": "2-3 sentence evidence-based summary of benefits and use.",
      "warnings": ["Any specific warning or note, or empty array"]
    }
  ],
  "interactions": [
    {
      "supplements": "Supplement A + Supplement B",
      "severity": "Note|Caution|Avoid",
      "note": "Explanation of the interaction or synergy."
    }
  ],
  "timingPlan": {
    "Morning": ["Supplement A"],
    "With food": ["Supplement B"],
    "Evening": [],
    "Night": ["Supplement C"]
  },
  "missing": ["Commonly recommended supplement missing from stack, max 3"]
}

Score 0-100. scoreLabel options: Needs Work / Decent Foundation / Well-Optimized / Elite Stack.
Be specific, evidence-based, and practical. Only include timing buckets that have supplements.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    
    if (data.error) {
      console.error("Anthropic API error:", data.error);
      return Response.json({ error: data.error.message || "API error" }, { status: 500 });
    }

    const text = data.content?.map((b) => b.type === "text" ? b.text : "").join("") || "";
    console.log("Raw API response:", text.substring(0, 200));
    
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    if (!clean) {
      return Response.json({ error: "Empty response from AI" }, { status: 500 });
    }
    
    const parsed = JSON.parse(clean);

    return Response.json(parsed);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
