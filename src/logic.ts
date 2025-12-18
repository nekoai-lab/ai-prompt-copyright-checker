import { DetectionResult, AssessmentResult, LLMDetectionResponse, RiskLevel } from './types';

const SCORES = {
  matchType: { Exact: 50, Variant: 35, Related: 20 },
  riskMultiplier: { High: 2.0, Medium: 1.0, Low: 0.5 }
};

// LLM APIを呼び出す関数
const callLLMAPI = async (prompt: string): Promise<LLMDetectionResponse> => {
  const provider = import.meta.env.VITE_LLM_PROVIDER || 'gemini';
  
  if (provider === 'gemini') {
    return await callGeminiAPI(prompt);
  } else if (provider === 'openai') {
    return await callOpenAIAPI(prompt);
  } else {
    throw new Error(`Unknown LLM provider: ${provider}`);
  }
};

// Google Gemini API呼び出し
const callGeminiAPI = async (prompt: string): Promise<LLMDetectionResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }

  const systemPrompt = `あなたは著作権リスク判定の専門家です。ユーザーが入力した画像生成プロンプトを分析し、既存のキャラクター名、実在の有名人、特定の商標、著作権保護されたスタイルが含まれているか判定してください。

以下のJSON形式で返答してください：
{
  "detections": [
    {
      "name": "検出された項目名（例: 月ねこ）",
      "matchedText": "プロンプト内でマッチしたテキスト",
      "category": "Character | Franchise | Style | Brand",
      "riskLevel": "High | Medium | Low",
      "rightsHolder": "権利者名（例: 架空のキャラクター）",
      "description": "リスクの説明",
      "alternatives": ["安全な代替表現1", "安全な代替表現2"]
    }
  ],
  "safePrompt": "元のプロンプト全体を自然な日本語で再構成した安全なバージョン。検出されたリスクのある要素を、文脈を保ちながら自然な日本語で置き換えた完全なプロンプト。検出がない場合は元のプロンプトと同じ。"
}

重要：
- "safePrompt"は、元のプロンプト全体を自然で読みやすい日本語で再構成してください
- 単語単位の置換ではなく、文全体の意味と文脈を保ちながら、リスクのある要素を安全な表現に置き換えてください
- 日本語として自然で、画像生成プロンプトとして機能する完全な文章にしてください
- 検出されない場合は、元のプロンプトをそのまま返してください

検出されない場合は空配列を返してください。必ず有効なJSONのみを返答してください。`;

  // 最新のGemini APIエンドポイントとモデル名を使用（gemini-2.5-flash）
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nユーザーの入力: ${prompt}`
          }]
        }]
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response format from Gemini API');
  }
  
  const text = data.candidates[0].content.parts[0].text;
  
  // JSONを抽出（マークダウンコードブロックからも抽出可能）
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse JSON from Gemini response');
  }

  try {
    return JSON.parse(jsonMatch[0]) as LLMDetectionResponse;
  } catch (parseError) {
    const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
    throw new Error(`Failed to parse JSON: ${errorMessage}`);
  }
};

// OpenAI API呼び出し
const callOpenAIAPI = async (prompt: string): Promise<LLMDetectionResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
  }

  const systemPrompt = `あなたは著作権リスク判定の専門家です。ユーザーが入力した画像生成プロンプトを分析し、既存のキャラクター名、実在の有名人、特定の商標、著作権保護されたスタイルが含まれているか判定してください。

以下のJSON形式で返答してください：
{
  "detections": [
    {
      "name": "検出された項目名（例: 月ねこ）",
      "matchedText": "プロンプト内でマッチしたテキスト",
      "category": "Character | Franchise | Style | Brand",
      "riskLevel": "High | Medium | Low",
      "rightsHolder": "権利者名（例: 架空のキャラクター）",
      "description": "リスクの説明",
      "alternatives": ["安全な代替表現1", "安全な代替表現2"]
    }
  ],
  "safePrompt": "元のプロンプト全体を自然な日本語で再構成した安全なバージョン。検出されたリスクのある要素を、文脈を保ちながら自然な日本語で置き換えた完全なプロンプト。検出がない場合は元のプロンプトと同じ。"
}

重要：
- "safePrompt"は、元のプロンプト全体を自然で読みやすい日本語で再構成してください
- 単語単位の置換ではなく、文全体の意味と文脈を保ちながら、リスクのある要素を安全な表現に置き換えてください
- 日本語として自然で、画像生成プロンプトとして機能する完全な文章にしてください
- 検出されない場合は、元のプロンプトをそのまま返してください

検出されない場合は空配列を返してください。必ず有効なJSONのみを返答してください。`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // または 'gpt-4', 'gpt-3.5-turbo'
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `ユーザーの入力: ${prompt}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from OpenAI API');
  }
  
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content) as LLMDetectionResponse;
  } catch (parseError) {
    const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
    throw new Error(`Failed to parse JSON: ${errorMessage}`);
  }
};

// LLMレスポンスをDetectionResultに変換
const convertToDetectionResult = (llmResponse: LLMDetectionResponse): DetectionResult[] => {
  // detectionsが存在しない、または配列でない場合は空配列を返す
  if (!llmResponse.detections || !Array.isArray(llmResponse.detections)) {
    return [];
  }
  
  return llmResponse.detections.map((detection, index) => {
    const itemId = `llm_${Date.now()}_${index}`;
    
    // スコア計算
    const baseScore = SCORES.matchType.Exact; // LLM検出は基本的にExactとして扱う
    const multiplier = SCORES.riskMultiplier[detection.riskLevel] || 1;
    const score = baseScore * multiplier;

    return {
      itemId,
      matchedText: detection.matchedText,
      matchType: 'Exact',
      item: {
        id: itemId,
        name: detection.name,
        variants: [],
        relatedTerms: [],
        category: detection.category,
        riskLevel: detection.riskLevel,
        rightsHolder: detection.rightsHolder,
        description: detection.description,
        alternatives: detection.alternatives
      },
      score
    };
  });
};

// メインの分析関数（非同期）
export const analyzePrompt = async (prompt: string): Promise<{ result: AssessmentResult; safePrompt: string }> => {
  // LLM APIを呼び出し
  const llmResponse = await callLLMAPI(prompt);
  
  // DetectionResultに変換
  const detections = convertToDetectionResult(llmResponse);

  // スコア計算
  let rawScore = 0;
  detections.forEach(d => { rawScore += d.score; });
  
  const totalScore = Math.min(100, Math.round(rawScore));
  
  // リスクレベル判定（Highリスク検出があれば即座にHigh判定）
  let riskLevel: RiskLevel = 'Low';
  const hasHighRisk = detections.some(d => d.item.riskLevel === 'High');
  if (hasHighRisk || totalScore >= 70) riskLevel = 'High';
  else if (totalScore >= 40) riskLevel = 'Medium';

  const result: AssessmentResult = {
    totalScore,
    riskLevel,
    detections,
    processedAt: new Date().toISOString()
  };

  // 安全なプロンプトを生成（LLMが生成したものを優先）
  const safePrompt = generateSafePrompt(prompt, detections, llmResponse.safePrompt);

  return {
    result,
    safePrompt
  };
};

// 安全なプロンプト生成（LLMが生成した安全なプロンプトを使用）
export const generateSafePrompt = (originalPrompt: string, detections: DetectionResult[], llmSafePrompt?: string): string => {
  // LLMが生成した安全なプロンプトがある場合はそれを使用
  if (llmSafePrompt && llmSafePrompt.trim() !== '') {
    return llmSafePrompt;
  }
  
  // フォールバック: LLMが安全なプロンプトを生成しなかった場合の従来のロジック
  let safePrompt = originalPrompt;
  detections.forEach(d => {
    if (d.item.alternatives.length > 0) {
      // より柔軟な置換（大文字小文字を無視）
      const regex = new RegExp(d.matchedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      safePrompt = safePrompt.replace(regex, () => {
        // 元の大文字小文字を保持
        return `【${d.item.alternatives[0]}】`;
      });
    }
  });
  return safePrompt;
};
