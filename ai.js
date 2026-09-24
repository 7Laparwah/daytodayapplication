import express from 'express';
import { CONFIG } from '../config.js';

const router = express.Router();

// Fallback Natural Language Parser if no API key set
function fallbackParseVoiceText(text) {
  text = text.toLowerCase();
  
  // Extract amount
  const amountMatch = text.match(/(?:₹|rs\.?|rupees|inr)?\s*(\d+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  // Type: income vs expense
  const isIncome = /got|received|credited|earned|salary|income|gift/i.test(text);
  const type = isIncome ? 'income' : 'expense';

  // Category guessing
  let category = 'General';
  if (/food|tea|coffee|dinner|lunch|pizza|burger|zomato|swiggy|grocery|milk/i.test(text)) category = 'Food';
  else if (/petrol|fuel|cab|uber|ola|bus|auto|train|flight|travel/i.test(text)) category = 'Travel';
  else if (/light|electricity|water|wifi|recharge|bill|mobile|rent/i.test(text)) category = 'Bills';
  else if (/movie|game|netflix|party|fun|shopping/i.test(text)) category = 'Entertainment';
  else if (/salary|freelance|bonus|interest|dividend/i.test(text)) category = 'Salary';

  // Extract title
  let title = text
    .replace(/(?:added|logged|spent|received|paid|for|rs|rupees|₹|\d+)/gi, '')
    .trim();
  if (!title || title.length < 2) title = category + ' Transaction';
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    title,
    amount,
    type,
    category,
    paymentMode: 'UPI',
    note: `Voice logged: "${text}"`
  };
}

// POST voice parse endpoint
router.post('/parse-voice', async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ success: false, message: 'Transcript required' });
  }

  // If Gemini API key is configured on server, try Gemini REST API
  if (CONFIG.GEMINI_API_KEY) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract structured JSON from expense text: "${transcript}". Response MUST be ONLY raw JSON with schema: {"title": string, "amount": number, "type": "expense"|"income", "category": string, "paymentMode": string, "note": string}`
            }]
          }]
        })
      });
      const data = await response.json();
      const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawJsonText) {
        const cleanJson = rawJsonText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return res.json({ success: true, parsed });
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local NLP parser:', e.message);
    }
  }

  // Fallback local NLP parsing
  const parsed = fallbackParseVoiceText(transcript);
  return res.json({ success: true, parsed, mode: 'local-nlp' });
});

export default router;
