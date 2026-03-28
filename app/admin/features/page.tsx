// app/admin/features/page.tsx
'use client'

import { useState } from 'react'
import { MODELS } from '@/lib/ai'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Stage = 'chat' | 'confirm' | 'staging' | 'deployed'

export default function FeatureAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Привіт! Опиши що треба зробити і я уточню деталі перед запуском.',
    },
  ])
  const [input, setInput] = useState('')
  const [stage, setStage] = useState<Stage>('chat')
  const [loading, setLoading] = useState(false)
  const [stagingUrl, setStagingUrl] = useState('')

  async function sendMessage() {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/feature-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await res.json()

      setMessages([...newMessages, { role: 'assistant', content: data.message }])

      if (data.readyToConfirm) setStage('confirm')
      if (data.stagingUrl) {
        setStagingUrl(data.stagingUrl)
        setStage('deployed')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    setStage('staging')
    setLoading(true)

    const res = await fetch('/api/admin/feature-agent/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })

    const data = await res.json()
    setStagingUrl(data.stagingUrl)
    setStage('deployed')
    setLoading(false)

    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: `✅ Задеплоєно на staging\n\nПеревір: ${data.stagingUrl}` },
    ])
  }

  async function handleDeployProd() {
    await fetch('/api/admin/feature-agent/promote', { method: 'POST' })
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: '🚀 Задеплоєно в production!' },
    ])
    setStage('chat')
  }

  async function handleRollback() {
    await fetch('/api/admin/feature-agent/rollback', { method: 'POST' })
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: '↩️ Відкочено до попередньої версії.' },
    ])
    setStage('chat')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Feature Agent</h1>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
              Думаю...
            </div>
          </div>
        )}
      </div>

      {/* Action buttons after staging deploy */}
      {stage === 'deployed' && (
        <div className="flex gap-2 mb-4">
          <a
            href={stagingUrl}
            target="_blank"
            className="text-sm text-blue-600 underline"
          >
            Перевірити на staging →
          </a>
          <button
            onClick={handleDeployProd}
            className="ml-auto bg-green-600 text-white px-4 py-2 rounded text-sm"
          >
            🚀 Deploy to Prod
          </button>
          <button
            onClick={handleRollback}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm"
          >
            ↩️ Rollback
          </button>
        </div>
      )}

      {/* Confirm button */}
      {stage === 'confirm' && (
        <button
          onClick={handleConfirm}
          className="mb-4 bg-blue-600 text-white px-6 py-2 rounded text-sm w-full"
        >
          ✅ Підтверджую — Deploy to Dev
        </button>
      )}

      {/* Staging indicator */}
      {stage === 'staging' && (
        <div className="mb-4 text-sm text-gray-500 text-center">
          Деплоюємо на staging...
        </div>
      )}

      {/* Input */}
      {(stage === 'chat' || stage === 'confirm') && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Опиши що треба зробити..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            Надіслати
          </button>
        </div>
      )}
    </div>
  )
}
