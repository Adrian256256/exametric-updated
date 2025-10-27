import { openai, isOpenAIConfigured } from '../lib/openai';

export interface EvaluationResult {
  isCorrect: boolean;
  score: number; // 0-100
  feedback: string;
  transcription?: string; // For audio answers
}

/**
 * Transcribe audio to text using OpenAI Whisper API
 */
export async function transcribeAudio(audioDataUrl: string): Promise<string> {
  if (!isOpenAIConfigured() || !openai) {
    throw new Error('OpenAI API is not configured. Please add your API key to the .env file.');
  }

  try {
    // Convert base64 data URL to a File object
    const response = await fetch(audioDataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'audio.webm', { type: blob.type });

    // Use Whisper API to transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please check your OpenAI API key and try again.');
  }
}

/**
 * Evaluate a text answer against the correct answer using GPT-4
 */
export async function evaluateTextAnswer(
  question: string,
  userAnswer: string,
  correctAnswer?: string
): Promise<EvaluationResult> {
  if (!isOpenAIConfigured() || !openai) {
    throw new Error('OpenAI API is not configured. Please add your API key to the .env file.');
  }

  try {
    const prompt = correctAnswer
      ? `You are evaluating a student's answer to a question. 
Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Please evaluate the student's answer and provide:
1. Whether it is correct (fully correct, partially correct, or incorrect)
2. A score from 0-100
3. Brief, constructive feedback

Respond in the following JSON format:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "your feedback here"
}`
      : `You are evaluating a student's answer to an open-ended question.
Question: ${question}
Student's Answer: ${userAnswer}

Please evaluate the quality and completeness of the answer and provide:
1. A score from 0-100 based on relevance, completeness, and clarity
2. Constructive feedback

Respond in the following JSON format:
{
  "isCorrect": true,
  "score": 0-100,
  "feedback": "your feedback here"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    
    return {
      isCorrect: result.isCorrect || false,
      score: result.score || 0,
      feedback: result.feedback || 'No feedback available',
    };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw new Error('Failed to evaluate answer. Please try again.');
  }
}

/**
 * Evaluate an audio answer (transcribe first, then evaluate)
 */
export async function evaluateAudioAnswer(
  question: string,
  audioDataUrl: string,
  correctAnswer?: string
): Promise<EvaluationResult> {
  try {
    // First, transcribe the audio
    const transcription = await transcribeAudio(audioDataUrl);
    
    // Then evaluate the transcribed text
    const evaluation = await evaluateTextAnswer(question, transcription, correctAnswer);
    
    // Add the transcription to the result
    return {
      ...evaluation,
      transcription,
    };
  } catch (error) {
    console.error('Error evaluating audio answer:', error);
    throw error;
  }
}

/**
 * Batch evaluate all answers
 */
export async function evaluateAllAnswers(
  answers: Array<{
    question: string;
    userAnswer: string | { type: 'audio'; url: string; duration: number };
    correctAnswer?: string;
  }>,
  onProgress?: (completed: number, total: number) => void
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];
  
  for (let i = 0; i < answers.length; i++) {
    const { question, userAnswer, correctAnswer } = answers[i];
    
    try {
      let result: EvaluationResult;
      
      if (typeof userAnswer === 'string') {
        result = await evaluateTextAnswer(question, userAnswer, correctAnswer);
      } else {
        result = await evaluateAudioAnswer(question, userAnswer.url, correctAnswer);
      }
      
      results.push(result);
    } catch (error) {
      console.error(`Error evaluating answer ${i + 1}:`, error);
      results.push({
        isCorrect: false,
        score: 0,
        feedback: 'Error evaluating this answer',
      });
    }
    
    if (onProgress) {
      onProgress(i + 1, answers.length);
    }
  }
  
  return results;
}
