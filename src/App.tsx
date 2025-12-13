import { useState } from 'react';
import { analyzePrompt } from './logic';
import { AssessmentResult } from './types';
import { ResultView } from './components/ResultView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Cat } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [safePrompt, setSafePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-3">
        {/* Header - コンパクトヒーロー */}
        <header className="flex flex-col items-center justify-center text-center px-4 pb-2">
          {/* キャラクター画像 - 1.5倍サイズ */}
          <div className="relative w-[7.5rem] h-[7.5rem] mb-3">
            <div className="absolute inset-0 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-xl shadow-purple-500/20 -z-10"></div>
            {!imageError ? (
              <img
                src="/tsukinek.png"
                alt="月ねこ"
                className="w-[7.5rem] h-[7.5rem] rounded-full border-4 border-white shadow-xl shadow-purple-500/40 object-cover relative z-10"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-[7.5rem] h-[7.5rem] rounded-full border-4 border-white shadow-xl shadow-purple-500/40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative z-10">
                <Cat className="w-14 h-14 text-purple-600" strokeWidth={2} />
              </div>
            )}
          </div>
          
          {/* タイトル */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              月ねこAI
            </h1>
            <p className="text-2xl md:text-3xl font-black tracking-wider bg-gradient-to-r from-slate-600 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
              プロンプト著作権チェッカー
            </p>
          </div>
        </header>

        {/* Input Section */}
        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-purple-500/10 rounded-2xl">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-gray-900 font-bold text-lg">プロンプトを入力</CardTitle>
            <CardDescription className="text-gray-600 font-medium text-xs">
              画像生成プロンプトを入力して、著作権リスクをチェックします
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <Textarea
              placeholder="例: 森の中を歩く月ねこのような動物..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={5000}
              disabled={loading}
              className="min-h-[80px] resize-none text-base text-gray-900 placeholder:text-gray-400 transition-all duration-200 rounded-xl shadow-inner"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {prompt.length} / 5000
              </span>
              <Button
                onClick={handleAnalyze}
                disabled={!prompt || loading}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 border-0 rounded-xl px-6 py-5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>分析中...</span>
                  </>
                ) : (
                  'リスク判定を実行'
                )}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200/50 text-red-800 rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && <ResultView result={result} originalPrompt={prompt} safePrompt={safePrompt} />}
      </div>
    </div>
  );
}
