'use client'

import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

export default function TestChatBot() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          aiModel: 'smart'
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
        <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
          <span className="text-white text-sm">🤖</span>
        </span>
        Test je AI Chatbot
      </h3>
      
      <div className="space-y-4">
        {/* Input Area */}
        <div className="bg-white rounded-lg border border-blue-200 p-3">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Stel een vraag aan de AI..."
                className="w-full p-2 border-0 resize-none focus:outline-none"
                rows={2}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '⏳' : '🚀'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-blue-700 text-sm">AI denkt na...</span>
            </div>
          </div>
        )}

        {/* Response Area */}
        {response && !isLoading && (
          <div className={`p-4 rounded-lg ${
            response.startsWith('Error:') 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              response.startsWith('Error:') 
                ? 'text-red-800' 
                : 'text-green-800'
            }`}>
              {response.startsWith('Error:') ? (
                <>❌ Fout:</>
              ) : (
                <>✅ AI Antwoord:</>
              )}
            </p>
            <div className="bg-white p-3 rounded border">
              {response.startsWith('Error:') ? (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {response}
                </p>
              ) : (
                <MarkdownRenderer 
                  content={response} 
                  className="text-gray-700 text-sm"
                />
              )}
            </div>
            {response.startsWith('Error:') && (
              <p className="text-red-600 text-xs mt-2">
                Controleer of je API key correct is ingesteld in .env.local
              </p>
            )}
          </div>
        )}

        {/* Instructions */}
        {!response && !isLoading && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Tip:</strong> Probeer vragen zoals "Wat is kunstmatige intelligentie?" of "Leg uit hoe machine learning werkt"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}