'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, FileSearch, FileEdit, FileText, Image, Upload, X, FileType, Download, Copy } from 'lucide-react'
import { useDetection } from '@/hooks/useDetection'
import { useHumanize } from '@/hooks/useHumanize'
import { TextDiffViewer } from './text-diff-viewer'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'

const exampleText = `人工智能技术正在以前所未有的速度发展，深刻改变着我们的生活方式。从智能语音助手到自动驾驶汽车，AI的应用已经渗透到各个领域。机器学习算法能够从海量数据中学习模式，并做出准确的预测。深度神经网络的突破使得计算机视觉和自然语言处理取得了重大进展。`

// 根据AI概率获取样式和描述
const getProbabilityStyles = (probability: number, detectionType: 'text' | 'image' = 'text') => {
  if (probability < 50) {
    return {
      label: detectionType === 'image' ? '非人工生成' : '人工创作',
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-400/30',
      ringColor: 'ring-green-400/20',
      iconColor: 'text-green-400',
    }
  } else if (probability < 80) {
    return {
      label: '疑似AI',
      color: 'text-orange-400',
      bgGradient: 'from-orange-500/20 to-orange-600/10',
      borderColor: 'border-orange-400/30',
      ringColor: 'ring-orange-400/20',
      iconColor: 'text-orange-400',
    }
  } else {
    return {
      label: 'AI生成',
      color: 'text-red-400',
      bgGradient: 'from-red-500/20 to-red-600/10',
      borderColor: 'border-red-400/30',
      ringColor: 'ring-red-400/20',
      iconColor: 'text-red-400',
    }
  }
}

// 分片类别的样式映射（兼容旧版）
const getCategoryStyles = (category: 'ai' | 'human' | 'uncertain') => {
  switch (category) {
    case 'ai':
      return {
        description: 'AI生成',
        color: 'text-red-400',
        bgClass: 'bg-red-500/20 border border-red-400/30',
      }
    case 'human':
      return {
        description: '人工创作',
        color: 'text-green-400',
        bgClass: 'bg-green-500/20 border border-green-400/30',
      }
    case 'uncertain':
      return {
        description: '疑似AI',
        color: 'text-orange-400',
        bgClass: 'bg-orange-500/20 border border-orange-400/30',
      }
  }
}

export function DetectionPanel() {
  const [mode, setMode] = useState<'detect' | 'rewrite'>('detect')
  const [detectionType, setDetectionType] = useState<'text' | 'image'>('text')
  const [textInputMode, setTextInputMode] = useState<'input' | 'file'>('input') // 文本输入方式
  const [rewriteModel, setRewriteModel] = useState<'0' | '1' | '2'>('0') // 改写模型
  
  // 为不同检测类型维护独立的输入状态
  const [textInput, setTextInput] = useState('')
  const [textFile, setTextFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  
  // 保存检测时的原始内容用于海报展示
  const [detectedContent, setDetectedContent] = useState<{
    type: 'text' | 'image'
    text?: string
    imageUrl?: string
  } | null>(null)
  
  const { isProcessing: isDetecting, result: detectionResult, detect, detectFile, reset: resetDetection } = useDetection()
  const { isProcessing: isRewriting, result: rewriteResult, humanize, reset: resetRewrite } = useHumanize()
  
  // 统一的处理状态和结果
  const isProcessing = mode === 'detect' ? isDetecting : isRewriting
  const result = mode === 'detect' ? detectionResult : null

  const handleDetect = async () => {
    if (mode === 'rewrite') {
      // AI降重模式 - 仅支持文本
      if (textInputMode === 'input') {
        // 直接输入文本
        await humanize(textInput, rewriteModel)
      } else {
        // 文件上传 - 读取文件内容后改写
        if (textFile) {
          const reader = new FileReader()
          reader.onload = async (e) => {
            const text = e.target?.result as string
            await humanize(text, rewriteModel)
          }
          reader.readAsText(textFile)
        }
      }
    } else {
      // AI检测模式
      if (detectionType === 'text') {
        // 文本检测
        if (textInputMode === 'input') {
          // 直接输入文本
          setDetectedContent({ type: 'text', text: textInput })
          await detect(textInput, {
            enableFragmentAnalysis: true,
            splitStrategy: 'paragraph',
          })
        } else {
          // 文件上传
          if (textFile) {
            // 读取文件内容
            const reader = new FileReader()
            reader.onload = (e) => {
              const text = e.target?.result as string
              setDetectedContent({ type: 'text', text })
            }
            reader.readAsText(textFile)
            
            await detectFile(textFile, {
              type: 'text',
              enableFragmentAnalysis: true,
              splitStrategy: 'paragraph',
            })
          }
        }
      } else {
        // 图像检测
        if (imageFile) {
          // 保存图片 URL
          const imageUrl = URL.createObjectURL(imageFile)
          setDetectedContent({ type: 'image', imageUrl })
          
          await detectFile(imageFile, {
            type: 'image',
            enableFragmentAnalysis: false, // 图像不需要分片分析
          })
        }
      }
    }
  }

  const handleModeChange = (newMode: 'detect' | 'rewrite') => {
    setMode(newMode)
    setDetectedContent(null)
    resetDetection()
    resetRewrite()
    // 切换到降重模式时，自动切换到文本模式
    if (newMode === 'rewrite') {
      setDetectionType('text')
    }
  }

  const handleDetectionTypeChange = (type: 'text' | 'image') => {
    setDetectionType(type)
    setDetectedContent(null)
    resetDetection()
    resetRewrite()
  }

  const handleTextInputModeChange = (mode: 'input' | 'file') => {
    setTextInputMode(mode)
    setDetectedContent(null)
    resetDetection()
    resetRewrite()
  }

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTextFile(file)
    }
  }

  // 拖拽上传处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) {
      setTextFile(file)
    }
  }

  // 移除文件
  const handleRemoveFile = () => {
    setTextFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 图像文件选择处理
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 验证图片类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      setImageFile(file)
    }
  }

  // 图像拖拽上传处理
  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      setImageFile(file)
    }
  }

  // 移除图像
  const handleRemoveImage = () => {
    setImageFile(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  // 导出海报
  const handleExportPoster = async () => {
    if (!posterRef.current || !result) return
    
    setIsExporting(true)
    toast.info('正在生成图片...', { duration: 2000 })
    
    try {
      // 创建一个完全隔离的 iframe 来渲染海报
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.left = '-9999px'
      iframe.style.top = '0'
      iframe.style.width = '800px'
      iframe.style.height = '2000px'
      document.body.appendChild(iframe)
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) {
        throw new Error('无法创建 iframe')
      }
      
      // 写入基础 HTML 结构，不引入任何外部样式
      iframeDoc.open()
      iframeDoc.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;"></body></html>')
      iframeDoc.close()
      
      // 克隆海报内容到 iframe
      const clonedPoster = posterRef.current.cloneNode(true) as HTMLElement
      
      // 重置克隆元素的位置样式
      clonedPoster.style.position = 'relative'
      clonedPoster.style.left = '0'
      clonedPoster.style.top = '0'
      
      // 如果有图片，转换为 base64 以确保在 iframe 中能正确加载
      if (detectedContent?.type === 'image' && detectedContent.imageUrl) {
        const imgElements = clonedPoster.querySelectorAll('img[alt="检测图片"]')
        if (imgElements.length > 0) {
          const img = imgElements[0] as HTMLImageElement
          // 创建临时 canvas 转换为 base64
          const tempCanvas = document.createElement('canvas')
          const tempImg = document.createElement('img')
          tempImg.crossOrigin = 'anonymous'
          tempImg.src = detectedContent.imageUrl
          
          await new Promise((resolve, reject) => {
            tempImg.onload = () => {
              tempCanvas.width = tempImg.width
              tempCanvas.height = tempImg.height
              const ctx = tempCanvas.getContext('2d')
              ctx?.drawImage(tempImg, 0, 0)
              img.src = tempCanvas.toDataURL('image/png')
              resolve(null)
            }
            tempImg.onerror = reject
          })
        }
      }
      
      iframeDoc.body.appendChild(clonedPoster)
      
      // 等待 iframe 渲染完成
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 在 iframe 中使用 html2canvas
      const canvas = await html2canvas(clonedPoster, {
        scale: 2,
        backgroundColor: '#0f0f0f',
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: 800,
        windowHeight: 2000,
      })
      
      // 清理 iframe
      document.body.removeChild(iframe)
      
      // 转换为图片并下载
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `DragonAI检测报告_${new Date().getTime()}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          toast.success('图片已导出', { duration: 3000 })
        }
      }, 'image/png')
    } catch (error) {
      console.error('导出失败:', error)
      toast.error('导出失败，请稍后重试', { duration: 3000 })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* 顶部检测类型切换 - 仅在检测模式下显示 */}
        {mode === 'detect' && (
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
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            {(detectionType === 'text' || mode === 'rewrite') ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {mode === 'detect' ? '文本检测' : 'AI降重'}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTextInputModeChange('input')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        textInputMode === 'input'
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      直接输入
                    </button>
                    <button
                      onClick={() => handleTextInputModeChange('file')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        textInputMode === 'file'
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      文件上传
                    </button>
                  </div>
                </div>

                {/* 降重模式下显示模型选择 */}
                {mode === 'rewrite' && (
                  <div className="mb-4">
                    <label className="text-white/60 text-sm block mb-3">改写模型</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setRewriteModel('0')}
                        className={`px-3 py-3 rounded-lg text-xs font-medium transition-all border ${
                          rewriteModel === '0'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-lg scale-105'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                        }`}
                      >
                        <div className="font-bold mb-1">质量优先</div>
                        <div className="text-[10px] opacity-80 leading-tight">Quality</div>
                      </button>
                      <button
                        onClick={() => setRewriteModel('1')}
                        className={`px-3 py-3 rounded-lg text-xs font-medium transition-all border ${
                          rewriteModel === '1'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-lg scale-105'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                        }`}
                      >
                        <div className="font-bold mb-1">平衡模式</div>
                        <div className="text-[10px] opacity-80 leading-tight">Balance</div>
                      </button>
                      <button
                        onClick={() => setRewriteModel('2')}
                        className={`px-3 py-3 rounded-lg text-xs font-medium transition-all border ${
                          rewriteModel === '2'
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400 shadow-lg scale-105'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/10'
                        }`}
                      >
                        <div className="font-bold mb-1">增强模式</div>
                        <div className="text-[10px] opacity-80 leading-tight">Enhanced</div>
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-white/50">
                      {rewriteModel === '0' && '注重改写质量，结果更自然'}
                      {rewriteModel === '1' && '平衡速度和质量'}
                      {rewriteModel === '2' && '深度改写，效果更明显'}
                    </div>
                  </div>
                )}

                {textInputMode === 'input' ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">输入文本内容</span>
                      <button
                        onClick={() => setTextInput(exampleText)}
                        className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                      >
                        <Sparkles className="w-4 h-4 inline mr-1.5" />
                        试用样本
                      </button>
                    </div>

                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder={mode === 'detect' ? '粘贴或输入文本进行AI检测...' : '粘贴或输入文本进行AI降重...'}
                      className="w-full h-96 bg-black/30 border border-white/10 rounded-xl p-4 text-white leading-relaxed placeholder-white/30 focus:outline-none focus:border-orange-400/50 resize-none"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">
                        <span className={textInput.length < 100 ? 'text-orange-400' : 'text-white/40'}>
                          {textInput.length} / 5000 字符
                        </span>
                        {textInput.length < 100 && (
                          <span className="text-orange-400/80 text-xs ml-2">(至少需要100字)</span>
                        )}
                      </div>
                      <Button
                        onClick={handleDetect}
                        disabled={!textInput.trim() || isProcessing || textInput.length < 100}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      >
                        {isProcessing ? '处理中...' : mode === 'detect' ? '开始检测' : '开始降重'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-white/60 text-sm block mb-2">上传文档文件</span>
                    
                    {/* 文件上传区域 */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="relative h-96 border-2 border-dashed border-white/20 rounded-xl bg-black/30 hover:border-orange-400/50 transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.pdf,.doc,.docx,.md,.rtf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {!textFile ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          <Upload className="w-16 h-16 text-white/40 mb-4" />
                          <p className="text-white/60 text-sm mb-2">拖拽文件到这里或</p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            选择文件
                          </Button>
                          <p className="text-white/40 text-xs mt-4">
                            支持格式：TXT, PDF, DOC, DOCX, MD, RTF
                          </p>
                          <p className="text-white/40 text-xs">最大文件大小：10MB</p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                          <div className="bg-white/5 rounded-xl p-6 w-full max-w-md border border-white/10">
                            <div className="flex items-start gap-3">
                              <FileType className="w-10 h-10 text-orange-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{textFile.name}</p>
                                <p className="text-white/60 text-sm mt-1">{formatFileSize(textFile.size)}</p>
                              </div>
                              <button
                                onClick={handleRemoveFile}
                                className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="mt-4 border-white/20 text-white hover:bg-white/10"
                          >
                            重新选择
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">
                        {textFile ? (
                          <span className="text-white/60">
                            文件已选择 · {formatFileSize(textFile.size)}
                          </span>
                        ) : (
                          <span className="text-white/40">请选择或拖拽文件</span>
                        )}
                      </div>
                      <Button
                        onClick={handleDetect}
                        disabled={!textFile || isProcessing}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      >
                        {isProcessing ? '处理中...' : mode === 'detect' ? '开始检测' : '开始降重'}
                      </Button>
                    </div>
                    
                    {textFile && textFile.size > 1024 * 1024 && (
                      <div className="mt-2 text-xs text-orange-400/80 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>大文件检测需要较长时间，请耐心等待</span>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">图像检测</h3>
                </div>

                {/* 图像上传区域 */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleImageDrop}
                  onClick={() => !imageFile && imageInputRef.current?.click()}
                  className="relative h-96 border-2 border-dashed border-white/20 rounded-xl bg-black/30 hover:border-orange-400/50 transition-colors overflow-hidden cursor-pointer"
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  
                  {!imageFile ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pointer-events-none">
                      <Image className="w-16 h-16 text-white/40 mb-4" />
                      <p className="text-white/60 text-sm mb-2">点击或拖拽图片到这里上传</p>
                      <p className="text-white/40 text-xs mt-4">
                        支持格式：JPG, PNG, GIF, WEBP
                      </p>
                      <p className="text-white/40 text-xs">最大文件大小：10MB</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      {/* 图片预览 */}
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="预览"
                          className="max-w-full max-h-full object-contain rounded-lg"
                          onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-white font-medium truncate text-sm">{imageFile.name}</p>
                        <p className="text-white/60 text-xs mt-1">{formatFileSize(imageFile.size)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    {imageFile ? (
                      <span className="text-white/60">
                        图片已选择 · {formatFileSize(imageFile.size)}
                      </span>
                    ) : (
                      <span className="text-white/40">请选择或拖拽图片</span>
                    )}
                  </div>
                  <Button
                    onClick={handleDetect}
                    disabled={!imageFile || isProcessing}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  >
                    {isProcessing ? '处理中...' : '开始检测'}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* 结果区 */}
          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {mode === 'detect' ? '检测结果' : '降重结果'}
              </h3>
              {(result || rewriteResult) && mode === 'detect' && (
                <Button
                  onClick={handleExportPoster}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                  className="border-orange-400/30 text-orange-400 hover:bg-orange-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? '生成中...' : '导出分享'}
                </Button>
              )}
            </div>
            {mode === 'rewrite' ? (
              // 降重模式结果展示
              !rewriteResult ? (
                <div className="h-96 flex flex-col items-center justify-center text-white/40">
                  <FileEdit className="w-16 h-16 mb-4" />
                  <p>改写结果将在这里显示</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 配额信息和操作按钮 */}
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white/70 text-sm font-medium">改写信息</div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(rewriteResult.humanizedText)
                          toast.success('已复制改写后文本到剪贴板', { duration: 2000 })
                        }}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors text-green-400 border border-green-400/30"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        复制改写文本
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-white/60 text-xs mb-1">使用模型</div>
                        <div className="text-white font-medium text-sm">{rewriteResult.model}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60 text-xs mb-1">消耗配额</div>
                        <div className="text-orange-400 font-bold text-sm">{Number(rewriteResult.quotaUsed).toFixed(2)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white/60 text-xs mb-1">剩余配额</div>
                        <div className="text-green-400 font-bold text-sm">{Number(rewriteResult.remainingQuota).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Diff 对比视图 */}
                  <TextDiffViewer 
                    originalText={rewriteResult.originalText}
                    modifiedText={rewriteResult.humanizedText}
                  />
                </div>
              )
            ) : (
              // 检测模式结果展示
              !result ? (
                <div className="h-96 flex flex-col items-center justify-center text-white/40">
                  <FileSearch className="w-16 h-16 mb-4" />
                  <p>结果将在这里显示</p>
                </div>
              ) : (
              <div className="space-y-4">
                {/* 整体检测结果卡片 */}
                {(() => {
                  const styles = getProbabilityStyles(result.aiProbability, detectionType)
                  return (
                    <div className={`bg-gradient-to-br ${styles.bgGradient} rounded-xl p-6 border ${styles.borderColor} ring-1 ${styles.ringColor}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-white/60 text-xs mb-1">检测结果</div>
                          <div className={`text-2xl font-bold ${styles.color}`}>{styles.label}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/60 text-xs mb-1">AI生成概率</div>
                          <div className="text-4xl font-bold text-white">{Math.round(result.aiProbability)}%</div>
                        </div>
                      </div>
                      
                      {/* 概率条 */}
                      <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            result.aiProbability < 50 ? 'bg-green-400' : 
                            result.aiProbability < 80 ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${result.aiProbability}%` }}
                        />
                      </div>
                    </div>
                  )
                })()}

                {/* 颜色说明 */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="text-white/70 text-xs mb-3 font-medium">评级说明</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-white/80">{detectionType === 'image' ? '非人工生成' : '人工创作'}</span>
                      <span className="text-white/50">&lt;50%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                      <span className="text-white/80">疑似AI</span>
                      <span className="text-white/50">50-80%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-white/80">AI生成</span>
                      <span className="text-white/50">&gt;80%</span>
                    </div>
                  </div>
                </div>

                {/* 分析结果 */}
                <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                  <div className="text-white/70 text-sm mb-2">分析说明</div>
                  <div className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{result.analysis}</div>
                </div>

                {/* 检测粒度 - 句子级别分析（仅文本检测） */}
                {detectionType === 'text' && result.fragments && result.fragments.length > 0 && result.fragments.some(f => f.sentenceHighlights && f.sentenceHighlights.length > 0) && (
                  <div className="bg-black/30 rounded-xl p-4 border border-white/10 max-h-96 overflow-y-auto space-y-3">
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                      <span>检测粒度</span>
                    </div>
                    
                    {result.fragments.map((fragment, i) => (
                      fragment.sentenceHighlights && fragment.sentenceHighlights.length > 0 && (
                        <div key={i} className="space-y-2">
                          {fragment.sentenceHighlights.map((sentence, sIndex) => {
                            // 智能处理概率格式（小数转百分比）
                            const probability = sentence.aiProbability < 1 
                              ? sentence.aiProbability * 100 
                              : sentence.aiProbability
                            const sentenceStyles = getProbabilityStyles(probability, detectionType)
                            
                            return (
                              <div key={sIndex} className={`p-3 rounded-lg text-sm bg-gradient-to-r ${sentenceStyles.bgGradient} border ${sentenceStyles.borderColor}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-xs font-medium ${sentenceStyles.color}`}>
                                    {sentenceStyles.label}
                                  </span>
                                  <span className="text-xs text-white/60">
                                    {Math.round(probability)}% AI
                                  </span>
                                </div>
                                <p className="text-white/90 leading-relaxed">{sentence.sentence}</p>
                              </div>
                            )
                          })}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
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

      {/* 隐藏的海报模板 - 用于导出 */}
      {result && (
        <div 
          ref={posterRef}
          data-poster-root
          style={{ 
            position: 'fixed',
            left: '-9999px',
            top: '0',
            width: '800px',
            padding: '48px',
            margin: '0',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            boxSizing: 'border-box',
            isolation: 'isolate'
          }}
        >
          {/* 海报头部 */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 
              style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#fb923c'
              }}
            >
              DragonAI 检测报告
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
              {detectionType === 'text' ? 'AI文本内容检测' : 'AI图像内容检测'}
            </p>
          </div>

          {/* 检测内容展示 */}
          {detectedContent && (
            <div 
              style={{ 
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '0.875rem', marginBottom: '12px', color: '#9ca3af' }}>
                检测内容
              </div>
              
              {detectedContent.type === 'text' && detectedContent.text && (
                <div 
                  style={{ 
                    fontSize: '0.875rem',
                    lineHeight: '1.625',
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '16px',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {detectedContent.text.length > 300 
                    ? detectedContent.text.slice(0, 300) + '...' 
                    : detectedContent.text}
                  {detectedContent.text.length > 300 && (
                    <div 
                      style={{ 
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '60px',
                        background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        paddingBottom: '8px'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        已省略部分内容
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {detectedContent.type === 'image' && detectedContent.imageUrl && (
                <div 
                  style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '16px',
                    borderRadius: '8px',
                    maxHeight: '300px',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={detectedContent.imageUrl}
                    alt="检测图片"
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '268px',
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 检测结果主体 */}
          <div 
            style={{ 
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* 核心指标 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              {(() => {
                const probability = result.aiProbability
                const color = probability < 50 ? '#4ade80' : probability < 80 ? '#fb923c' : '#f87171'
                const label = probability < 50 ? (detectionType === 'image' ? '非人工生成' : '人工创作') : probability < 80 ? '疑似AI' : 'AI生成'
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '8px', color }}>
                      {Math.round(probability)}%
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color }}>
                      {label}
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* 概率条 */}
            <div 
              style={{ 
                width: '100%',
                height: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '9999px',
                overflow: 'hidden',
                marginBottom: '24px'
              }}
            >
              <div 
                style={{ 
                  width: `${result.aiProbability}%`,
                  height: '100%',
                  backgroundColor: result.aiProbability < 50 ? '#4ade80' : 
                    result.aiProbability < 80 ? '#fb923c' : '#f87171'
                }}
              />
            </div>

            {/* 评级说明 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div 
                style={{ 
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(74, 222, 128, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4ade80' }}>{detectionType === 'image' ? '非人工生成' : '人工创作'}</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'rgba(255, 255, 255, 0.6)' }}>&lt;50%</div>
              </div>
              <div 
                style={{ 
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(249, 115, 22, 0.2)',
                  border: '1px solid rgba(251, 146, 60, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fb923c' }}>疑似AI</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'rgba(255, 255, 255, 0.6)' }}>50-80%</div>
              </div>
              <div 
                style={{ 
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(248, 113, 113, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f87171' }}>AI生成</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'rgba(255, 255, 255, 0.6)' }}>&gt;80%</div>
              </div>
            </div>

            {/* 分析说明 */}
            <div 
              style={{ 
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ fontSize: '0.75rem', marginBottom: '8px', color: '#9ca3af' }}>分析说明</div>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.625', whiteSpace: 'pre-line', color: '#ffffff' }}>
                {result.analysis}
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          {result.fragmentAnalysis && (
            <div 
              style={{ 
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '0.875rem', marginBottom: '12px', color: '#9ca3af' }}>检测统计</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>{result.totalFragments || 0}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#9ca3af' }}>总片段</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171' }}>{result.aiFragments || 0}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#9ca3af' }}>AI片段</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>{result.humanFragments || 0}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#9ca3af' }}>人工片段</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fb923c' }}>{result.uncertainFragments || 0}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#9ca3af' }}>不确定</div>
                </div>
              </div>
            </div>
          )}

          {/* 底部公司信息 */}
          <div 
            style={{ 
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#ffffff' }}>
                  DragonAI - 专业AI内容检测平台
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  支持文本、图像、视频、音频等多种内容检测
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', color: '#fb923c', fontFamily: 'monospace' }}>
                  dragonai.tech
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#9ca3af' }}>
                  {new Date().toLocaleDateString('zh-CN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

