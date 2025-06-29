'use client'

import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

export default function TestChatBot() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<string>('')
  const [activeRoleplay, setActiveRoleplay] = useState<any>(null)
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, message: string}>>([])

  // HTV Rollenspel Scenario's
  const htvScenarios = {
    overlastburger: {
      name: "😤 Boze Burger - Geluidsoverlast",
      character: "Meneer Jansen",
      description: "Een geïrriteerde buurman die klaagt over geluidsoverlast van de buren",
      context: "Het is 22:30 op een doordeweekse avond. Meneer Jansen (55) belt aan bij de handhaver omdat zijn buren al uren luide muziek draaien.",
      personality: "Gefrustreerd, emotioneel, wil snel actie, heeft al meerdere keren geklaagd",
      color: "red"
    },
    winkeldief: {
      name: "🛍️ Verdachte Winkeldief",
      character: "Jongere (17 jaar)",
      description: "Een nerveuze tiener die betrapt is op winkeldiefstal",
      context: "Je bent BOA en wordt door een winkelier geroepen. Een 17-jarige jongen is betrapt op het stelen van energiedrankjes.",
      personality: "Nerveus, ontkennend, bang voor gevolgen, soms agressief uit defensie",
      color: "orange"
    },
    parkeerovertreder: {
      name: "🚗 Parkeerovertreder",
      character: "Mevrouw De Wit",
      description: "Een gehaaste moeder die verkeerd geparkeerd staat",
      context: "Mevrouw De Wit (35) staat met haar auto op een gehandicaptenparkeerplaats voor de school. Ze haalt net haar kind op.",
      personality: "Gehaast, verdedigend, gebruikt smoesjes, wordt snel emotioneel",
      color: "blue"
    },
    cafebezoekers: {
      name: "🍺 Dronken Cafébezoekers",
      character: "Groep jongeren",
      description: "Een groep aangeschoten jongeren die overlast veroorzaakt",
      context: "Het is 01:00 's nachts. Een groep van 4 jongeren (20-25 jaar) staat luidruchtig voor een café en veroorzaakt overlast.",
      personality: "Uitgelaten, onder invloed, uitdagend, groepsgedrag",
      color: "purple"
    },
    agressievehond: {
      name: "🐕 Loslopende Hond",
      character: "Hondeneigenaar",
      description: "Eigenaar van een loslopende, mogelijk agressieve hond",
      context: "In het park loopt een grote hond los rond. Andere bezoekers zijn bang. De eigenaar beweert dat zijn hond 'heel lief' is.",
      personality: "Bagatelliserend, eigenwijs, beschermend over zijn hond, wordt defensief",
      color: "green"
    },
    evenementcontrole: {
      name: "🎪 Evenement Organisator",
      character: "Evenement Manager",
      description: "Organisator die de regels probeert te omzeilen",
      context: "Bij een straatfeest zijn er meer bezoekers dan toegestaan. De organisator wil het evenement niet inkorten.",
      personality: "Zakelijk, overtuigend, probeert te onderhandelen, wijst naar economische gevolgen",
      color: "indigo"
    }
  }

  const startRoleplay = async (scenarioKey: string) => {
    const scenario = htvScenarios[scenarioKey as keyof typeof htvScenarios]
    setActiveRoleplay(scenario)
    setConversationHistory([])
    setResponse('')
    
    // Start het rollenspel met een opening van het personage
    const openingPrompt = `Je bent nu ${scenario.character}. ${scenario.context}

Persoonlijkheid: ${scenario.personality}

Begin het gesprek vanuit dit perspectief. Reageer emotioneel en realistisch zoals dit personage zou doen. Gebruik *acties* voor lichaamstaal en non-verbale signalen waar passend.

Start het gesprek nu als ${scenario.character}.`

    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: openingPrompt,
          aiModel: 'smart'
        }),
      })

      if (!res.ok) {
        throw new Error('Fout bij het starten van het rollenspel')
      }

      const data = await res.json()
      setResponse(data.response)
      setConversationHistory([{role: scenario.character, message: data.response}])
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: Kon rollenspel niet starten')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !activeRoleplay) return

    // Voeg student bericht toe aan geschiedenis
    const newHistory = [...conversationHistory, {role: 'Student (jij)', message: message}]
    setConversationHistory(newHistory)

    setIsLoading(true)
    try {
      // Bouw conversatie context op
      const conversationContext = newHistory.map(entry => 
        `${entry.role}: ${entry.message}`
      ).join('\n\n')

      const roleplayPrompt = `Je bent ${activeRoleplay.character} in dit rollenspel scenario:

${activeRoleplay.context}

Persoonlijkheid: ${activeRoleplay.personality}

Conversatie tot nu toe:
${conversationContext}

De HTV student zegt nu: "${message}"

Reageer als ${activeRoleplay.character}. Blijf in karakter, toon emoties met *sterretjes* voor acties/lichaamstaal, en reageer realistisch op wat de student zegt. Onthoud details uit het gesprek en verwijs ernaar. Stel terug­vragen als iets onduidelijk is.`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: roleplayPrompt,
          aiModel: 'smart'
        }),
      })

      if (!res.ok) {
        throw new Error('Fout bij het verwerken van het bericht')
      }

      const data = await res.json()
      setResponse(data.response)
      
      // Voeg AI response toe aan geschiedenis
      setConversationHistory([...newHistory, {role: activeRoleplay.character, message: data.response}])
      setMessage('')
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    } finally {
      setIsLoading(false)
    }
  }

  const endRoleplay = () => {
    setActiveRoleplay(null)
    setConversationHistory([])
    setResponse('')
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      red: "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
      orange: "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100",
      blue: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
      purple: "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100",
      green: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
      {/* Header */}
      <div className={`text-white p-6 rounded-t-xl ${
        activeRoleplay 
          ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
          : 'bg-gradient-to-r from-indigo-600 to-blue-600'
      }`}>
        <h3 className="text-xl font-bold flex items-center">
          <span className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            {activeRoleplay ? '🎭' : '🎓'}
          </span>
          {activeRoleplay ? `Rollenspel: ${activeRoleplay.name}` : 'HTV Conversational Trainer'}
        </h3>
        <p className={`text-sm mt-2 ${activeRoleplay ? 'text-green-100' : 'text-indigo-100'}`}>
          {activeRoleplay 
            ? `Je spreekt nu met: ${activeRoleplay.character}` 
            : 'Oefen realistische gesprekssituaties voor HTV professionals'
          }
        </p>
        {activeRoleplay && (
          <button
            onClick={endRoleplay}
            className="mt-3 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm hover:bg-opacity-30 transition-all"
          >
            🚪 Rollenspel beëindigen
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {!activeRoleplay ? (
          <>
            {/* Scenario Selection */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                🎭 Kies een rollenspel scenario:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(htvScenarios).map(([key, scenario]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getColorClasses(scenario.color)}`}
                    onClick={() => startRoleplay(key)}
                  >
                    <h5 className="font-semibold mb-2">{scenario.name}</h5>
                    <p className="text-sm mb-2">{scenario.description}</p>
                    <div className="text-xs opacity-75">
                      <strong>Context:</strong> {scenario.context}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">
                📋 Hoe werkt de Conversational Trainer?
              </h4>
              <div className="space-y-3 text-blue-700">
                <div className="flex items-start space-x-3">
                  <span className="text-lg">1️⃣</span>
                  <div>
                    <strong>Kies een scenario</strong> - Selecteer een realistische situatie die je vaak tegenkomt als HTV professional
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-lg">2️⃣</span>
                  <div>
                    <strong>Begin het gesprek</strong> - De AI speelt een geloofwaardig personage met echte emoties en reacties
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-lg">3️⃣</span>
                  <div>
                    <strong>Oefen je vaardigheden</strong> - Gebruik de-escalatie, communicatietechnieken en professionele houding
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-lg">4️⃣</span>
                  <div>
                    <strong>Leer van de interactie</strong> - Het personage reageert realistisch op jouw aanpak
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Active Roleplay Interface */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">
                  🎯 Scenario Context:
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(activeRoleplay.color)}`}>
                  {activeRoleplay.character}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{activeRoleplay.context}</p>
              <p className="text-gray-600 text-xs">
                <strong>Persoonlijkheid:</strong> {activeRoleplay.personality}
              </p>
            </div>

            {/* Conversation History */}
            {conversationHistory.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversationHistory.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      entry.role.includes('Student') 
                        ? 'bg-blue-50 border border-blue-200 ml-8' 
                        : 'bg-gray-50 border border-gray-200 mr-8'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-sm">
                        {entry.role.includes('Student') ? '👨‍🎓' : '🎭'} {entry.role}
                      </span>
                    </div>
                    <MarkdownRenderer 
                      content={entry.message} 
                      className="text-gray-800 text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Current Response */}
            {response && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mr-8">
                <div className="flex items-center mb-2">
                  <span className="font-medium text-sm text-yellow-800">
                    🎭 {activeRoleplay.character}
                  </span>
                </div>
                <MarkdownRenderer 
                  content={response} 
                  className="text-gray-800 text-sm"
                />
              </div>
            )}

            {/* Input Area */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    👨‍🎓 Jouw reactie als HTV professional:
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Typ hier je reactie... Denk aan de-escalatie, empathie, duidelijke communicatie en professionele houding."
                    className="w-full p-3 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Reageert...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Reageer</span>
                      <span>💬</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-yellow-700 font-medium">
                🎭 {activeRoleplay ? `${activeRoleplay.character} denkt na...` : 'Rollenspel wordt voorbereid...'}
              </span>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!activeRoleplay && !isLoading && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h4 className="text-lg font-semibold text-indigo-800 mb-2">
                Welkom bij de HTV Conversational Trainer!
              </h4>
              <p className="text-indigo-700 mb-4">
                Oefen realistische gesprekssituaties met AI-personages die reageren zoals echte mensen.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">🗣️ De-escalatie technieken</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">💬 Professionele communicatie</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">🎯 Conflicthantering</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <span className="font-medium text-indigo-800">⚖️ Juridische procedures</span>
                </div>
              </div>
              <p className="text-indigo-600 text-sm mt-4">
                💡 <strong>Tip:</strong> Kies een scenario hierboven om te beginnen met oefenen!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}