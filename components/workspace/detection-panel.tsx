'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, FileSearch, FileEdit, FileText, Image } from 'lucide-react'
import { useDetection } from '@/hooks/useDetection'

const exampleText = `人工智能技术正在以前所未有的速度发展，深刻改变着我们的生活方式。从智能语音助手到自动驾驶汽车，AI的应用已经渗透到各个领域。机器学习算法能够从海量数据中学习模式，并做出准确的预测。深度神经网络的突破使得计算机视觉和自然语言处理取得了重大进展。`

export function DetectionPanel() {
  const [mode, setMode] = useState<'detect' | 'rewrite'>('detect')
  const [detectionType, setDetectionType] = useState<'text' | 'image'>('text')
  const [inputText, setInputText] = useState('')
  const { isProcessing, result, detect, reset } = useDetection()

  const handleDetect = async () => {
    await detect(inputText, {
      enableFragmentAnalysis: true,
      splitStrategy: 'paragraph',
    })
  }

  const handleModeChange = (newMode: 'detect' | 'rewrite') => {
    setMode(newMode)
    reset()
  }

  const handleDetectionTypeChange = (type: 'text' | 'image') => {
    setDetectionType(type)
    reset()
    setInputText('')
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* 顶部检测类型切换 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => handleDetectionTypeChange('text')}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              detectionType === 'text'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <FileText className="w-5 h-5 inline-block mr-2" />
            文本检测
          </button>
          <button
            onClick={() => handleDetectionTypeChange('image')}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              detectionType === 'image'
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Image className="w-5 h-5 inline-block mr-2" />
            图片检测
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            {detectionType === 'text' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">输入文本</h3>
                  <button
                    onClick={() => setInputText(exampleText)}
                    className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4 inline mr-1.5" />
                    试用样本
                  </button>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'detect' ? '粘贴或输入文本进行AI检测...' : '粘贴或输入文本进行AI降重...'}
                  className="w-full h-96 bg-black/30 border border-white/10 rounded-xl p-4 text-white leading-relaxed placeholder-white/30 focus:outline-none focus:border-orange-400/50 resize-none"
                />

                <div className="flex items-center justify-between mt-4">
                  <div className="text-white/40 text-sm">{inputText.length} / 5000 字符</div>
                  <Button
                    onClick={handleDetect}
                    disabled={!inputText.trim() || isProcessing}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    {isProcessing ? '处理中...' : mode === 'detect' ? '开始检测' : '开始降重'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">上传图片</h3>
                </div>

                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl bg-black/30">
                  <Image className="w-16 h-16 text-white/40 mb-4" />
                  <p className="text-white/60 text-sm mb-2">图片检测功能</p>
                  <p className="text-white/40 text-xs">敬请期待...</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-white/40 text-sm">支持 JPG、PNG 格式</div>
                  <Button
                    disabled
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 opacity-50"
                  >
                    开发中
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* 结果区 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              {mode === 'detect' ? '检测结果' : '降重结果'}
            </h3>
            {!result ? (
              <div className="h-96 flex flex-col items-center justify-center text-white/40">
                {mode === 'detect' ? <FileSearch className="w-16 h-16 mb-4" /> : <FileEdit className="w-16 h-16 mb-4" />}
                <p>结果将在这里显示</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-400/30">
                    <div className="text-orange-400 text-xs mb-1">AI生成概率</div>
                    <div className="text-3xl font-bold text-white">{Math.round(result.aiProbability)}%</div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                    <div className="text-green-400 text-xs mb-1">人工创作概率</div>
                    <div className="text-3xl font-bold text-white">{Math.round(100 - result.aiProbability)}%</div>
                  </div>
                </div>

                {/* 分析结果 */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="text-white/70 text-sm mb-2">分析说明</div>
                  <p className="text-white/90 text-sm leading-relaxed">{result.analysis}</p>
                </div>

                {/* 分片结果 */}
                {result.fragments && result.fragments.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10 max-h-72 overflow-y-auto space-y-2">
                    <div className="text-white/70 text-sm mb-2">
                      分片分析 ({result.totalFragments} 片段)
                    </div>
                    {result.fragments.map((fragment, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg text-sm ${
                          fragment.category === 'ai'
                            ? 'bg-orange-500/20 border border-orange-400/30'
                            : fragment.category === 'human'
                            ? 'bg-green-500/20 border border-green-400/30'
                            : 'bg-gray-500/20 border border-gray-400/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${fragment.categoryColor}`}>
                            {fragment.categoryDescription}
                          </span>
                          <span className="text-xs text-white/60">{Math.round(fragment.aiProbability)}% AI</span>
                        </div>
                        <p className="text-white/90 leading-relaxed">{fragment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 底部模式切换 */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handleModeChange('detect')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm ${
              mode === 'detect'
                ? 'bg-orange-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileSearch className="w-4 h-4 inline-block mr-2" />
            AI检测
          </button>
          <button
            onClick={() => handleModeChange('rewrite')}
            className={`px-6 py-2.5 rounded-full font-medium transition-all text-sm ${
              mode === 'rewrite'
                ? 'bg-orange-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileEdit className="w-4 h-4 inline-block mr-2" />
            AI降重
          </button>
        </div>
      </div>
    </div>
  )
}

