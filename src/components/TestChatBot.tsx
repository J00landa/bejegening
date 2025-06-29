'use client'

import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

export default function TestChatBot() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // HTV-specifieke categorieën en voorbeeldvragen
  const htvCategories = {
    handhaving: {
      name: "👮‍♂️ Handhaving",
      color: "blue",
      examples: [
        "Wat zijn de bevoegdheden van een BOA?",
        "Hoe stel je een proces-verbaal op?",
        "Welke sancties kan ik opleggen bij overlast?",
        "Wat is het verschil tussen een waarschuwing en een boete?"
      ]
    },
    toezicht: {
      name: "👁️ Toezicht",
      color: "green", 
      examples: [
        "Welke observatietechnieken zijn er?",
        "Hoe rapporteer je een incident?",
        "Wat zijn de regels voor cameratoezicht?",
        "Hoe herken je verdacht gedrag?"
      ]
    },
    veiligheid: {
      name: "🛡️ Veiligheid",
      color: "red",
      examples: [
        "Hoe doe je een risico-analyse?",
        "Wat zijn de noodprocedures bij een incident?",
        "Hoe beheers je een menigte?",
        "Welke veiligheidsmaatregelen zijn verplicht?"
      ]
    },
    juridisch: {
      name: "⚖️ Juridisch",
      color: "purple",
      examples: [
        "Wat staat er in artikel 140 Wetboek van Strafrecht?",
        "Welke APV bepalingen gelden voor mijn gemeente?",
        "Wat is het verschil tussen strafrecht en bestuursrecht?",
        "Wanneer mag ik iemand aanhouden?"
      ]
    },
    communicatie: {
      name: "🗣️ Communicatie",
      color: "orange",
      examples: [
        "Hoe de-escaleer je een conflict?",
        "Welke gesprekstechnieken zijn effectief?",
        "Hoe ga je om met agressieve burgers?",
        "Wat zijn de do's en don'ts bij communicatie?"
      ]
    }
  }

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || message
    if (!messageToSend.trim()) return

    setIsLoading(true)
    try {
      // Voeg HTV context toe aan het bericht
      const htvContext = `Je bent een gespecialiseerde AI assistent voor HTV studenten (Handhaving, Toezicht en Veiligheid). 
      Geef praktische, accurate antwoorden over Nederlandse wet- en regelgeving, procedures, en best practices in het HTV vakgebied.
      Focus op concrete, toepasbare informatie die studenten kunnen gebruiken in hun studie en latere beroepspraktijk.
      
      Vraag van student: ${messageToSend}`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: htvContext,
          aiModel: 'smart'
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await res.json()
      setResponse(data.response)
      
      // Clear message if it was sent manually
      if (!customMessage) {
        setMessage('')
      }
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

  const handleExampleClick = (example: string) => {
    setMessage(example)
    sendMessage(example)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
      green: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100", 
      red: "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
      purple: "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100",
      orange: "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-xl">
        <h3 className="text-xl font-bold flex items-center">
          <span className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            🤖
          </span>
          HTV AI Assistent
        </h3>
        <p className="text-indigo-100 text-sm mt-2">
          Stel je vragen over handhaving, toezicht, veiligheid, wetgeving en procedures
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(htvCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(selectedCategory === key ? '' : key)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedCategory === key 
                  ? getColorClasses(category.color)
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-sm">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Example Questions */}
        {selectedCategory && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">
              💡 Voorbeeldvragen voor {htvCategories[selectedCategory as keyof typeof htvCategories].name}:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {htvCategories[selectedCategory as keyof typeof htvCategories].examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm"
                  disabled={isLoading}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Stel je HTV vraag hier... (bijv. 'Wat zijn de bevoegdheden van een BOA bij overlast?')"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !message.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Denkt...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Verstuur</span>
                  <span>🚀</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-indigo-700 font-medium">🧠 AI analyseert je HTV vraag...</span>
            </div>
            <p className="text-indigo-600 text-sm mt-2 ml-12">
              Even geduld, ik zoek de meest accurate informatie voor je...
            </p>
          </div>
        )}

        {/* Response Area */}
        {response && !isLoading && (
          <div className={`rounded-lg border-2 ${
            response.startsWith('Error:') 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            {/* Response Header */}
            <div className={`p-4 border-b ${
              response.startsWith('Error:') 
                ? 'border-red-200 bg-red-100' 
                : 'border-green-200 bg-green-100'
            }`}>
              <p className={`font-semibold flex items-center ${
                response.startsWith('Error:') 
                  ? 'text-red-800' 
                  : 'text-green-800'
              }`}>
                {response.startsWith('Error:') ? (
                  <>
                    <span className="mr-2">❌</span>
                    Er is een fout opgetreden
                  </>
                ) : (
                  <>
                    <span className="mr-2">✅</span>
                    HTV AI Antwoord
                  </>
                )}
              </p>
            </div>

            {/* Response Content */}
            <div className="p-4">
              {response.startsWith('Error:') ? (
                <div className="space-y-3">
                  <p className="text-red-700 font-medium">
                    {response}
                  </p>
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                    <p className="text-red-800 text-sm font-medium mb-2">🔧 Mogelijke oplossingen:</p>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Controleer of je GEMINI_API_KEY correct is ingesteld in .env.local</li>
                      <li>• Zorg dat je een geldige API key hebt van Google AI Studio</li>
                      <li>• Herstart de development server (npm run dev)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <MarkdownRenderer 
                    content={response} 
                    className="text-gray-800 leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!response && !isLoading && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="text-lg font-semibold text-indigo-800 mb-2">
                Welkom bij je HTV AI Assistent!
              </h4>
              <p className="text-indigo-700 mb-4">
                Ik ben gespecialiseerd in Handhaving, Toezicht & Veiligheid en help je graag met:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">📚 Wetgeving & Procedures</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">🔍 Praktijkcases</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">📝 Rapportage Tips</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">💬 Communicatie Skills</span>
                </div>
              </div>
              <p className="text-indigo-600 text-sm mt-4">
                💡 <strong>Tip:</strong> Kies een categorie hierboven of stel direct je vraag!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}