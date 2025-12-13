import { useState } from 'react';
import { analyzePrompt } from './logic';
import { AssessmentResult } from './types';
import { ResultView } from './components/ResultView';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [safePrompt, setSafePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!prompt) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const { result, safePrompt: generatedSafePrompt } = await analyzePrompt(prompt);
      setResult(result);
      setSafePrompt(generatedSafePrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans min-h-screen bg-gray-50/50">
      <header className="text-center pt-10 mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">🎨 AI画像生成プロンプト著作権チェッカー</h1>
        <p className="text-gray-500 mt-2">意図しない権利侵害を防ぎ、安全なクリエイティブ活動を。</p>
      </header>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-2">プロンプトを入力</label>
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          placeholder="例: 森の中を歩くピカチュウのような動物..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={5000}
          disabled={loading}
        />
        <div className="flex justify-between mt-3 items-center">
          <span className="text-xs text-gray-400 font-mono">{prompt.length} / 5000</span>
          <button
            onClick={handleAnalyze}
            disabled={!prompt || loading}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                分析中...
              </>
            ) : (
              'リスク判定を実行'
            )}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}
      </section>

      {result && <ResultView result={result} originalPrompt={prompt} safePrompt={safePrompt} />}
    </div>
  );
}

