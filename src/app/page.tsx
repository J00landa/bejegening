import TestChatBot from '@/components/TestChatBot'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            HTV Chatbot Assistant
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            Jouw AI-assistent voor Handhaving, Toezicht en Veiligheid
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Wat kan deze chatbot voor je doen?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-lg">📚</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Studiehulp</h3>
                    <p className="text-sm text-gray-600">Uitleg van HTV-concepten, wetgeving en procedures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 text-lg">⚖️</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Juridische vragen</h3>
                    <p className="text-sm text-gray-600">Hulp bij wetgeving, bevoegdheden en rechtsbases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 text-lg">🔍</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Casusanalyse</h3>
                    <p className="text-sm text-gray-600">Bespreek praktijksituaties en dilemma's</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-600 text-lg">📝</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Rapportage</h3>
                    <p className="text-sm text-gray-600">Tips voor proces-verbaal en rapportschrijving</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-600 text-lg">🚨</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Veiligheidsprocedures</h3>
                    <p className="text-sm text-gray-600">Protocollen en veiligheidsmaatregelen</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-indigo-600 text-lg">🎓</span>
                  <div>
                    <h3 className="font-medium text-gray-800">Examenhulp</h3>
                    <p className="text-sm text-gray-600">Voorbereiding op toetsen en examens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Quick Start Examples */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                💡
              </span>
              Voorbeeldvragen om mee te beginnen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">📚 Studiehulp</p>
                  <p className="text-xs text-blue-600 mt-1">"Wat is het verschil tussen een bestuurlijke boete en een strafrechtelijke boete?"</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">⚖️ Wetgeving</p>
                  <p className="text-xs text-green-600 mt-1">"Welke bevoegdheden heb ik als BOA bij een overtreding van de APV?"</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800 font-medium">🔍 Praktijk</p>
                  <p className="text-xs text-purple-600 mt-1">"Hoe ga ik om met een agressieve overtreder?"</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 font-medium">📝 Rapportage</p>
                  <p className="text-xs text-orange-600 mt-1">"Hoe schrijf ik een goed proces-verbaal voor wildplassen?"</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">🚨 Veiligheid</p>
                  <p className="text-xs text-red-600 mt-1">"Wat zijn de veiligheidsprotocollen bij een huiselijk geweld melding?"</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-800 font-medium">🎓 Examen</p>
                  <p className="text-xs text-indigo-600 mt-1">"Kun je me overhoren over de Wet op de Economische Delicten?"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chatbot Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🤖
              </span>
              Start je gesprek met de HTV Assistant
            </h2>
            <TestChatBot />
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-yellow-800 font-medium text-sm">Belangrijke opmerking</h3>
                <p className="text-yellow-700 text-xs mt-1">
                  Deze AI-assistent is bedoeld als studiehulp en ter ondersteuning van je leerproces. 
                  Controleer altijd belangrijke juridische informatie met je docenten of officiële bronnen. 
                  Voor acute situaties raadpleeg altijd je leidinggevende of de officiële procedures.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 text-blue-600">
              <span>🛡️</span>
              <span>Succes met je HTV-studie!</span>
              <span>🛡️</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              HTV Chatbot Assistant • Powered by Gemini AI • Voor studenten Handhaving, Toezicht en Veiligheid
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}