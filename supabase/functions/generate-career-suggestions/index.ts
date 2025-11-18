import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const { assessmentData, userId } = await req.json();
    
    const systemPrompt = `You are an expert career counselor and AI advisor. Based on the user's profile, provide personalized career guidance in the following JSON format:
    {
      "careerPath": "A detailed career path recommendation (2-3 sentences)",
      "skillRecommendations": ["skill1", "skill2", "skill3", "skill4"],
      "learningRoadmap": ["step1", "step2", "step3", "step4"],
      "internshipMatches": ["Match reasoning 1", "Match reasoning 2"],
      "resumeTips": ["tip1", "tip2", "tip3"]
    }`;

    const userPrompt = `User Profile:
    - Skills: ${assessmentData.skills?.join(', ') || 'Not specified'}
    - Interests: ${assessmentData.interests?.join(', ') || 'Not specified'}
    - Experience Level: ${assessmentData.experience_level || 'Not specified'}
    - Education: ${assessmentData.education || 'Not specified'}
    - Goals: ${assessmentData.goals || 'Not specified'}
    - LinkedIn: ${assessmentData.linkedin_url || 'Not provided'}
    - GitHub: ${assessmentData.github_url || 'Not provided'}`;

    console.log('Calling AI Gateway for career suggestions...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    console.log('AI suggestions generated successfully');

    // Store the assessment and suggestions in the database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { error: dbError } = await supabase
      .from('user_assessments')
      .insert({
        user_id: userId,
        skills: assessmentData.skills,
        interests: assessmentData.interests,
        experience_level: assessmentData.experience_level,
        education: assessmentData.education,
        goals: assessmentData.goals,
        ai_suggestions: suggestions
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-career-suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});