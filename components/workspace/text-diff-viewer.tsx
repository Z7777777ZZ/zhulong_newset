'use client'

import { useEffect, useRef, useState } from 'react'
import * as Diff from 'diff-match-patch'

interface TextDiffViewerProps {
  originalText: string
  modifiedText: string
}

export function TextDiffViewer({ originalText, modifiedText }: TextDiffViewerProps) {
  const [diffHtml, setDiffHtml] = useState<{ original: string; modified: string }>({ original: '', modified: '' })

  useEffect(() => {
    const dmp = new Diff.diff_match_patch()
    const diffs = dmp.diff_main(originalText, modifiedText)
    dmp.diff_cleanupSemantic(diffs)

    // 构建原始文本和修改后文本的 HTML
    let originalHtml = ''
    let modifiedHtml = ''

    diffs.forEach(([operation, text]) => {
      const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>')

      if (operation === Diff.DIFF_DELETE) {
        // 删除的内容 - 只在原始文本中显示（红色背景）
        originalHtml += `<span class="diff-delete">${escapedText}</span>`
      } else if (operation === Diff.DIFF_INSERT) {
        // 新增的内容 - 只在修改后文本中显示（绿色背景）
        modifiedHtml += `<span class="diff-insert">${escapedText}</span>`
      } else {
        // 未改变的内容
        originalHtml += `<span class="diff-equal">${escapedText}</span>`
        modifiedHtml += `<span class="diff-equal">${escapedText}</span>`
      }
    })

    setDiffHtml({ original: originalHtml, modified: modifiedHtml })
  }, [originalText, modifiedText])

  return (
    <div className="space-y-4">
      {/* 原始文本 */}
      <div className="bg-black/30 rounded-xl p-4 border border-red-400/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="text-white/70 text-sm font-medium">原始文本</div>
        </div>
        <div
          className="text-white/90 text-sm leading-relaxed max-h-96 overflow-y-auto diff-content"
          dangerouslySetInnerHTML={{ __html: diffHtml.original }}
        />
      </div>

      {/* 改写后文本 */}
      <div className="bg-black/30 rounded-xl p-4 border border-green-400/20">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <div className="text-white/70 text-sm font-medium">改写后文本</div>
        </div>
        <div
          className="text-white/90 text-sm leading-relaxed max-h-96 overflow-y-auto diff-content"
          dangerouslySetInnerHTML={{ __html: diffHtml.modified }}
        />
      </div>

      {/* 样式定义 */}
      <style jsx>{`
        :global(.diff-content .diff-delete) {
          background-color: rgba(239, 68, 68, 0.3);
          text-decoration: line-through;
          padding: 2px 4px;
          border-radius: 3px;
          color: rgba(255, 255, 255, 0.9);
        }

        :global(.diff-content .diff-insert) {
          background-color: rgba(34, 197, 94, 0.3);
          padding: 2px 4px;
          border-radius: 3px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        :global(.diff-content .diff-equal) {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  )
}

