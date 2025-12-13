import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Copy, Info, Check } from 'lucide-react';
import { AssessmentResult } from '../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ResultViewProps {
  result: AssessmentResult;
  originalPrompt: string;
  safePrompt: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, originalPrompt, safePrompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(safePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightPrompt = () => {
    if (result.detections.length === 0) {
      return originalPrompt;
    }
    const pattern = new RegExp(`(${result.detections.map((item) => item.matchedText).join('|')})`, 'gi');
    return originalPrompt.replace(
      pattern,
      `<span class="bg-purple-200 text-purple-800 font-semibold px-1.5 py-0.5 rounded">$&</span>`
    );
  };

  // リスクレベルに応じたアイコン（黄色 + キラキラアニメーション）
  const getIcon = () => {
    switch (result.riskLevel) {
      case 'High': return <XCircle className="w-8 h-8 text-amber-500 animate-sparkle" />;
      case 'Medium': return <AlertTriangle className="w-8 h-8 text-amber-500 animate-sparkle" />;
      case 'Low': return <CheckCircle className="w-8 h-8 text-emerald-500" />;
    }
  };

  const getTitle = () => {
    switch (result.riskLevel) {
      case 'High': return '高リスクを検出';
      case 'Medium': return '著作権リスクを検出';
      case 'Low': return '安全なプロンプトです';
    }
  };

  const getDescription = () => {
    switch (result.riskLevel) {
      case 'High': return '著作権で保護された要素が含まれている可能性が高いです。';
      case 'Medium': return '一部の表現が既存の知的財産権に抵触する可能性があります。';
      case 'Low': return 'このプロンプトに著作権上の問題は検出されませんでした。';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">

      {/* BLOCK 1: ステータス & スコア */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* 左: ステータス表示 */}
        <Card className="md:col-span-2 bg-white/90 shadow-lg p-4 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-1">
            {getIcon()}
            <h2 className="text-xl font-bold text-slate-800">{getTitle()}</h2>
          </div>
          <p className="text-slate-500 font-medium text-sm">{getDescription()}</p>
        </Card>

        {/* 右: スコア表示 */}
        <Card className="bg-slate-900 text-white shadow-lg p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl -mr-8 -mt-8"></div>
          
          <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">RISK SCORE</div>
          <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
            {result.totalScore}
          </div>
          <div className="text-xs font-bold text-slate-400">/ 100</div>
        </Card>
      </div>

      {/* BLOCK 2: 比較セクション */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Left: Your Input */}
        <Card className="border border-purple-200 bg-purple-50/50 shadow-md p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-purple-100 p-1.5 rounded-lg">
              <XCircle className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-bold text-purple-700 tracking-wide uppercase text-xs">YOUR INPUT</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
            <span dangerouslySetInnerHTML={{ __html: highlightPrompt() }} />
          </p>
        </Card>

        {/* Right: Safe Suggestion */}
        <Card className="border border-sky-200 bg-sky-50/50 shadow-md p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-sky-400 to-blue-500"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-sky-100 p-1.5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-sky-600" />
              </div>
              <span className="font-bold text-sky-700 tracking-wide uppercase text-xs">SUGGESTION</span>
            </div>
            <Button 
              size="sm" 
              className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm rounded-full px-3 py-1 text-xs"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
            {safePrompt}
          </p>
        </Card>
      </div>

      {/* BLOCK 3: 詳細情報 */}
      {result.detections.length > 0 && (
        <Card className="border border-slate-200 bg-slate-50/80 shadow-md p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-slate-400 to-slate-500"></div>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-slate-200 p-1.5 rounded-lg">
              <Info className="w-4 h-4 text-slate-600" />
            </div>
            <span className="font-bold text-slate-700 tracking-wide uppercase text-xs">ANALYSIS REPORT</span>
          </div>
          
          {/* 詳細コンテンツ */}
          <div className="space-y-2">
            {result.detections.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex flex-col md:flex-row gap-3">
                  <Badge className="self-start px-3 py-1 text-xs font-bold bg-slate-700 text-white hover:bg-slate-700 rounded-full">
                    {item.item.category}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      「{item.matchedText}」との類似性
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {item.item.description}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">権利者:</span>
                      <span className="text-xs font-bold text-slate-700">{item.item.rightsHolder}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};
