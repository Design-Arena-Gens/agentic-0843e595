'use client'

import { Block } from './BioBuilder'

interface PreviewProps {
  blocks: Block[]
}

export default function Preview({ blocks }: PreviewProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Your bio page will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto">
      {blocks.map((block) => {
        const style = {
          color: block.style?.color || '#000',
          textAlign: block.style?.alignment || 'center' as any,
          fontSize: block.style?.fontSize || '1rem',
          backgroundColor: block.style?.backgroundColor !== 'transparent'
            ? block.style?.backgroundColor
            : undefined,
        }

        if (block.type === 'heading') {
          return (
            <h1
              key={block.id}
              style={style}
              className="font-bold mb-4"
            >
              {block.content || 'Heading'}
            </h1>
          )
        }

        if (block.type === 'text') {
          return (
            <p
              key={block.id}
              style={style}
              className="mb-4"
            >
              {block.content || 'Text content'}
            </p>
          )
        }

        if (block.type === 'image' && block.url) {
          return (
            <div key={block.id} className="mb-4" style={{ textAlign: block.style?.alignment || 'center' }}>
              <img
                src={block.url}
                alt="Bio"
                className="max-w-full h-auto rounded-lg inline-block"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )
        }

        if (block.type === 'link' && block.url) {
          return (
            <div key={block.id} className="mb-4" style={{ textAlign: block.style?.alignment || 'center' }}>
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                style={style}
                className="inline-block px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              >
                {block.content || 'Click Here'}
              </a>
            </div>
          )
        }

        if (block.type === 'email') {
          return (
            <div key={block.id} className="mb-4" style={{ textAlign: block.style?.alignment || 'center' }}>
              <a
                href={`mailto:${block.content}`}
                style={{ ...style, textDecoration: 'none' }}
                className="hover:underline"
              >
                {block.content || 'email@example.com'}
              </a>
            </div>
          )
        }

        if (block.type === 'social') {
          return (
            <div key={block.id} className="mb-4" style={{ textAlign: block.style?.alignment || 'center' }}>
              <div className="flex gap-3 justify-center">
                <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
                <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
                <a href="#" className="text-gray-800 hover:text-gray-600">GitHub</a>
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
