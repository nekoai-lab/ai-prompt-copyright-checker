import { useState } from 'react';
import { AlertTriangle, CheckCircle, AlertOctagon, ArrowRight, Copy, Check, Info } from 'lucide-react';
import { AssessmentResult } from '../types';

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

  const theme = {
    High: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', bar: 'bg-red-500', icon: <AlertOctagon className="w-8 h-8 text-red-600" />, badge: 'bg-red-100 text-red-700' },
    Medium: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', bar: 'bg-orange-500', icon: <AlertTriangle className="w-8 h-8 text-orange-600" />, badge: 'bg-orange-100 text-orange-700' },
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', bar: 'bg-green-500', icon: <CheckCircle className="w-8 h-8 text-green-600" />, badge: 'bg-green-100 text-green-700' }
  }[result.riskLevel];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Score Dashboard */}
      <div className={`${theme.bg} ${theme.border} border-2 rounded-2xl p-6 shadow-sm`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm">{theme.icon}</div>
            <div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${theme.badge}`}>RISK LEVEL: {result.riskLevel.toUpperCase()}</div>
              <h2 className={`text-xl font-bold ${theme.text}`}>{result.riskLevel === 'Low' ? '安全なプロンプトです' : '著作権リスクが検出されました'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/60 p-4 rounded-xl min-w-[200px]">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-1"><span>Risk Score</span><span className="font-bold text-gray-900">{result.totalScore}/100</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all duration-1000 ${theme.bar}`} style={{ width: `${result.totalScore}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Before / After Comparison */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
        {/* Before */}
        <div className="bg-white border-2 border-red-100 rounded-xl p-4 flex flex-col relative">
          <div className="absolute -top-3 left-4 bg-red-100 text-red-700 px-3 py-1 text-xs font-bold rounded-full">YOUR INPUT</div>
          <div className="flex-grow mt-2 text-gray-700 font-mono text-sm whitespace-pre-wrap leading-relaxed">
             {result.detections.length > 0 ? (
               <span dangerouslySetInnerHTML={{ __html: originalPrompt.replace(new RegExp(`(${result.detections.map(d => d.matchedText).join('|')})`, 'gi'), '<span class="bg-red-100 text-red-600 font-bold px-1 rounded">$&</span>') }} />
            ) : originalPrompt}
          </div>
        </div>
        
        {/* Arrow */}
        <div className="flex items-center justify-center py-2 md:py-0"><div className="bg-gray-100 p-2 rounded-full text-gray-400"><ArrowRight size={24} /></div></div>
        
        {/* After (Safe) */}
        <div className="bg-white border-2 border-green-100 rounded-xl p-4 flex flex-col relative shadow-sm ring-4 ring-green-50/50">
          <div className="absolute -top-3 left-4 bg-green-100 text-green-700 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={12} /> SAFE SUGGESTION</div>
          <div className="flex-grow mt-2 text-gray-800 font-mono text-sm whitespace-pre-wrap leading-relaxed">
             {safePrompt}
          </div>
          <button onClick={handleCopy} className={`mt-4 w-full py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${copied ? 'bg-green-600 text-white shadow-inner' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'}`}>{copied ? <><Check size={18} /> コピーしました！</> : <><Copy size={18} /> 安全なプロンプトをコピー</>}</button>
        </div>
      </div>

      {/* Detailed List */}
      {result.detections.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Info size={18} /> 検出されたリスクの詳細</h3>
          <div className="grid gap-3">
            {result.detections.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-sm">"{item.matchedText}"</span><span className="text-xs text-gray-400">→</span><span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.item.category}</span></div>
                  <p className="text-sm text-gray-600">{item.item.description}</p>
                </div>
                <div className="text-xs text-right sm:min-w-[140px] border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                  <div className="text-gray-400 mb-1">権利者情報</div>
                  <div className="font-medium text-gray-800">{item.item.rightsHolder}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
