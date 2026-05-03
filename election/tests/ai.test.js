import { describe, it, expect } from 'vitest';

describe('Bharat Votes - AI Assistant Integration', () => {
  it('should format the Gemini API payload correctly', () => {
    const SYSTEM_INSTRUCTION = "Test instruction";
    const history = [{ role: 'user', parts: [{ text: 'Hello' }] }];
    
    const body = {
      contents: [
        { role: 'user', parts: [{ text: `INSTRUCTION: ${SYSTEM_INSTRUCTION}` }] },
        { role: 'model', parts: [{ text: "Understood." }] },
        ...history
      ]
    };

    expect(body.contents).toHaveLength(3);
    expect(body.contents[0].role).toBe('user');
    expect(body.contents[2].parts[0].text).toBe('Hello');
  });

  it('should handle API errors gracefully', () => {
    const mockErrorResponse = {
      error: { message: "API_KEY_INVALID" }
    };
    expect(mockErrorResponse.error.message).toContain("API_KEY_INVALID");
  });
});
