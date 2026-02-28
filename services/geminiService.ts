export const generateRecipeIdea = async (ingredients: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/gemini/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients })
  });

  if (!response.ok) {
    throw new Error('Failed to generate recipe idea');
  }

  return response.json();
};

export const suggestStepImagePrompt = async (stepDescription: string) => {
  // Can be moved to backend as well, mocking for now as it's a minor feature.
  return `A high quality, appetizing real-life photo of cooking step: ${stepDescription}`;
};
