// API utility functions for ChatGPT integration

export interface AnalysisRequest {
  post: string;
  platform: string;
  tone: string;
}

export interface CommentRequest {
  analysis: string;
  platform: string;
  tone: string;
}

export interface AnalysisResponse {
  analysis: string;
}

export interface CommentResponse {
  comment: string;
}

const SUPABASE_URL = "https://kjabpmcsiluvtxmbbfbg.supabase.co";

export async function analyzePost(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    console.log('Making request to:', `${SUPABASE_URL}/functions/v1/analysis`);
    console.log('Request data:', request);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze post');
    }

    return await response.json();
  } catch (error) {
    console.error('Analysis API error:', error);
    throw error;
  }
}

export async function generateComment(request: CommentRequest): Promise<CommentResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Comment API error:', error);
    throw error;
  }
}