export type RiskLevel = 'High' | 'Medium' | 'Low';
export type Category = 'Character' | 'Franchise' | 'Style' | 'Brand';

export interface CopyrightItem {
  id: string;
  name: string;
  variants: string[];
  relatedTerms: string[];
  category: Category;
  riskLevel: RiskLevel;
  rightsHolder: string;
  description: string;
  alternatives: string[];
}

export interface DetectionResult {
  itemId: string;
  matchedText: string;
  matchType: 'Exact' | 'Variant' | 'Related';
  item: CopyrightItem;
  score: number;
}

export interface AssessmentResult {
  totalScore: number;
  riskLevel: RiskLevel;
  detections: DetectionResult[];
  processedAt: string;
}

// LLM APIレスポンス用の型
export interface LLMDetectionResponse {
  detections: Array<{
    name: string;
    matchedText: string;
    category: Category;
    riskLevel: RiskLevel;
    rightsHolder: string;
    description: string;
    alternatives: string[];
  }>;
  safePrompt?: string; // 元のプロンプト全体を自然な日本語で再構成した安全なバージョン
}

