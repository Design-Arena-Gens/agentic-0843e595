'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import {
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  Code,
  Trash2,
  Eye,
  Download,
  Plus,
  GripVertical
} from 'lucide-react'
import Preview from './Preview'

export type BlockType = 'heading' | 'text' | 'image' | 'link' | 'email' | 'social'

export interface Block {
  id: string
  type: BlockType
  content: string
  url?: string
  style?: {
    fontSize?: string
    color?: string
    alignment?: 'left' | 'center' | 'right'
    backgroundColor?: string
  }
}

const BLOCK_TEMPLATES = [
  { type: 'heading' as BlockType, icon: Type, label: 'Heading', defaultContent: 'Your Name' },
  { type: 'text' as BlockType, icon: Type, label: 'Text', defaultContent: 'Add your bio text here...' },
  { type: 'image' as BlockType, icon: ImageIcon, label: 'Image', defaultContent: '' },
  { type: 'link' as BlockType, icon: LinkIcon, label: 'Link Button', defaultContent: 'Click Here' },
  { type: 'email' as BlockType, icon: Mail, label: 'Email', defaultContent: 'your@email.com' },
  { type: 'social' as BlockType, icon: Code, label: 'Social Links', defaultContent: '' },
]

export default function BioBuilder() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addBlock = (type: BlockType) => {
    const template = BLOCK_TEMPLATES.find(t => t.type === type)
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: template?.defaultContent || '',
      style: {
        fontSize: type === 'heading' ? '2rem' : '1rem',
        color: '#000000',
        alignment: 'center',
        backgroundColor: type === 'link' ? '#3b82f6' : 'transparent'
      }
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(blocks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setBlocks(items)
  }

  const exportHTML = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Bio Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 3rem 2rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .block { margin-bottom: 1.5rem; }
    .heading { font-weight: bold; }
    .image {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      display: block;
      margin: 0 auto;
    }
    .link-button {
      display: inline-block;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      transition: transform 0.2s;
      width: 100%;
      text-align: center;
    }
    .link-button:hover { transform: translateY(-2px); }
    .email { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    ${blocks.map(block => {
      const style = `
        color: ${block.style?.color || '#000'};
        text-align: ${block.style?.alignment || 'center'};
        font-size: ${block.style?.fontSize || '1rem'};
        ${block.style?.backgroundColor && block.style.backgroundColor !== 'transparent'
          ? `background-color: ${block.style.backgroundColor};`
          : ''}
      `

      if (block.type === 'heading') {
        return `<h1 class="block heading" style="${style}">${block.content}</h1>`
      } else if (block.type === 'text') {
        return `<p class="block" style="${style}">${block.content}</p>`
      } else if (block.type === 'image' && block.url) {
        return `<img class="block image" src="${block.url}" alt="Bio image" style="${style}" />`
      } else if (block.type === 'link' && block.url) {
        return `<a href="${block.url}" class="block link-button" style="${style}">${block.content}</a>`
      } else if (block.type === 'email') {
        return `<a href="mailto:${block.content}" class="block email" style="${style}">${block.content}</a>`
      }
      return ''
    }).join('\n    ')}
  </div>
</body>
</html>
    `.trim()

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bio-page.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Bio Page Builder</h1>
            <p className="text-gray-600">Drag and drop to create your perfect bio page</p>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Builder Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Blocks</h2>
                <div className="grid grid-cols-2 gap-2">
                  {BLOCK_TEMPLATES.map((template) => (
                    <button
                      key={template.type}
                      onClick={() => addBlock(template.type)}
                      className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <template.icon size={18} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">{template.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Blocks</h2>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="blocks">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 min-h-[200px]"
                      >
                        {blocks.length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                            <Plus size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Add blocks to get started</p>
                          </div>
                        )}
                        {blocks.map((block, index) => (
                          <Draggable key={block.id} draggableId={block.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                              >
                                <div className="flex items-start gap-3">
                                  <div {...provided.dragHandleProps} className="pt-2">
                                    <GripVertical size={20} className="text-gray-400" />
                                  </div>
                                  <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-medium text-gray-600 capitalize">
                                        {block.type}
                                      </span>
                                      <button
                                        onClick={() => deleteBlock(block.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>

                                    {block.type !== 'image' && (
                                      <input
                                        type="text"
                                        value={block.content}
                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        placeholder="Content"
                                      />
                                    )}

                                    {(block.type === 'link' || block.type === 'image') && (
                                      <input
                                        type="url"
                                        value={block.url || ''}
                                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        placeholder={block.type === 'image' ? 'Image URL' : 'Link URL'}
                                      />
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                      <select
                                        value={block.style?.alignment || 'center'}
                                        onChange={(e) => updateBlock(block.id, {
                                          style: { ...block.style, alignment: e.target.value as any }
                                        })}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                      >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                      </select>
                                      <input
                                        type="color"
                                        value={block.style?.color || '#000000'}
                                        onChange={(e) => updateBlock(block.id, {
                                          style: { ...block.style, color: e.target.value }
                                        })}
                                        className="w-full h-8 border border-gray-300 rounded"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  <Eye size={18} />
                  Preview
                </button>
                <button
                  onClick={exportHTML}
                  disabled={blocks.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={18} />
                  Export HTML
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Live Preview</h2>
              <div className="border-2 border-gray-200 rounded-lg p-6 min-h-[600px] bg-gradient-to-br from-purple-100 to-blue-100">
                <Preview blocks={blocks} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">Full Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-100 to-blue-100">
              <Preview blocks={blocks} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
