import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file.');
}

export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from a backend
}) : null;

export const isOpenAIConfigured = () => {
  return !!apiKey;
};
