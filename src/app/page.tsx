import TestChatBot from '@/components/TestChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            HTV AI Assistent
          </h1>
          
          <p className="text-xl text-indigo-700 font-medium mb-2">
            Jouw AI partner voor Handhaving, Toezicht & Veiligheid
          </p>
          
          <p className="text-gray-600 max-w-2xl mx-auto">
            Een gespecialiseerde AI chatbot die je helpt met vragen over wetgeving, procedures, 
            casestudies en praktische situaties in het HTV vakgebied.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-aux">
          
          {/* Quick Start Guide */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                🚀
              </span>
              Snel aan de slag
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Setup Instructions */}
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    1. API Key instellen
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Verkrijg een gratis Gemini API key en voeg deze toe aan je .env.local bestand:
                  </p>
                  <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                    <code>GEMINI_API_KEY=your_api_key_here</code>
                  </div>
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank"
                    className="inline-flex items-center mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    <span>Verkrijg API Key</span>
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    2. Test de chatbot
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Gebruik de chatbot hieronder om te testen of alles werkt en begin met het stellen van HTV-gerelateerde vragen.
                  </p>
                </div>
              </div>

              {/* Example Questions */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                  💡 Voorbeeldvragen voor HTV
                </h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">
                      "Wat zijn de bevoegdheden van een BOA bij overlast?"
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">
                      "Leg de escalatieladder uit bij conflicthantering"
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">
                      "Welke wet- en regelgeving geldt voor parkeeroverlast?"
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm text-gray-700">
                      "Hoe schrijf je een goed proces-verbaal?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chatbot Section */}
          <div className="mb-8">
            <TestChatBot />
          </div>

          {/* HTV Specializations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              🎯 HTV Specialisaties
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  👮‍♂️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Handhaving</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• BOA bevoegdheden</li>
                  <li>• Proces-verbaal opstellen</li>
                  <li>• Sanctiebeleid</li>
                  <li>• Wet- en regelgeving</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  👁️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Toezicht</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Observatietechnieken</li>
                  <li>• Rapportage procedures</li>
                  <li>• Cameratoezicht</li>
                  <li>• Preventieve maatregelen</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🛡️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Veiligheid</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Risico-analyse</li>
                  <li>• Noodprocedures</li>
                  <li>• Crowd control</li>
                  <li>• Incidentmanagement</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  ⚖️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Juridisch</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Wetboek van Strafrecht</li>
                  <li>• APV bepalingen</li>
                  <li>• Bestuursrecht</li>
                  <li>• Rechtsmacht</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🗣️
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Communicatie</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Conflicthantering</li>
                  <li>• De-escalatie</li>
                  <li>• Gesprekstechnieken</li>
                  <li>• Rapportage</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  📋
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-center">Procedures</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Werkprotocollen</li>
                  <li>• Veiligheidsprotocollen</li>
                  <li>• Meldingsprocedures</li>
                  <li>• Kwaliteitsborging</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-indigo-800 mb-6">
              🔧 Wat kan deze AI voor je doen?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2 text-sm">💬</span>
                  Interactieve Hulp
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Beantwoord vragen over HTV procedures en wetgeving</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Helpt bij het opstellen van rapporten en PV's</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Geeft praktische tips voor conflicthantering</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Analyseert casestudies en scenario's</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2 text-sm">🎓</span>
                  Leerondersteuning
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Uitleg van complexe juridische begrippen</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Oefenvragen en zelftests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Actuele informatie over regelgeving</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Praktijkgerichte voorbeelden en cases</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 text-indigo-600">
              <span>🎓</span>
              <span>Succes met je HTV studie!</span>
              <span>🎓</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              HTV AI Assistent • Gespecialiseerd voor Handhaving, Toezicht & Veiligheid
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}