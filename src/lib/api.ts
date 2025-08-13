// API utility functions for ChatGPT integration
import { cleanAnalysisText } from '@/utils/textCleaning';

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

export interface ConversationalCommentRequest {
  originalComment: string;
  platform: string;
  tone: string;
  customInstructions?: string;
}

export interface ConversationalCommentResponse {
  comment: string;
}

export interface SuggestionsRequest {
  comment: string;
  platform: string;
  tone: string;
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export interface AnalysisSuggestionsRequest {
  analysis: string;
  platform: string;
  tone: string;
}

export interface AnalysisSuggestionsResponse {
  suggestions: string[];
}

export interface ImproveAnalysisRequest {
  post: string;
  currentAnalysis: string;
  improvementInstructions: string;
  platform: string;
  tone: string;
}

export interface ImproveAnalysisResponse {
  analysis: string;
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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
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
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
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

export async function generateConversationalComment(request: ConversationalCommentRequest): Promise<ConversationalCommentResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/conversational-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate conversational comment');
    }

    return await response.json();
  } catch (error) {
    console.error('Conversational comment API error:', error);
    throw error;
  }
}

export async function generateSuggestions(request: SuggestionsRequest): Promise<SuggestionsResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate suggestions');
    }

    return await response.json();
  } catch (error) {
    console.error('Suggestions API error:', error);
    throw error;
  }
}

export async function generateAnalysisSuggestions(request: AnalysisSuggestionsRequest): Promise<AnalysisSuggestionsResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/analysis-suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate analysis suggestions');
    }

    return await response.json();
  } catch (error) {
    console.error('Analysis suggestions API error:', error);
    throw error;
  }
}

export async function improveAnalysis(request: ImproveAnalysisRequest): Promise<ImproveAnalysisResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/improve-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJwbWNzaWx1dnR4bWJiZmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MTcwOTgsImV4cCI6MjA3MDQ5MzA5OH0.KFx4TVE4Nc0NtDiTMC3rwTXadD9maygfri_L-0qRhME',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to improve analysis');
    }

    const data = await response.json();
    
    // Clean the response to remove any unwanted meta-commentary
    const cleanedData = {
      ...data,
      analysis: data.analysis ? cleanAnalysisText(data.analysis) : data.analysis
    };

    return cleanedData;
  } catch (error) {
    console.error('Improve analysis API error:', error);
    throw error;
  }
}