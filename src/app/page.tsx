import TestChatBot from '@/components/TestChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            AI Template voor HTV Studenten
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            Een eenvoudige template om te experimenteren met AI technologie
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          
          {/* Setup Instructions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🚀
              </span>
              Aan de slag
            </h2>
            
            <div className="space-y-6">
              
              {/* Step 1 - API Key */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Stap 1: Verkrijg een Gemini API Key
                </h3>
                <p className="text-gray-600 mb-3">
                  Ga naar Google AI Studio om je gratis API key aan te maken:
                </p>
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Verkrijg API Key</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Step 2 - Environment File */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Stap 2: Maak een .env.local bestand
                </h3>
                <p className="text-gray-600 mb-3">
                  Maak een nieuw bestand genaamd <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code> in de hoofdmap van je project en voeg je API key toe:
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <code>GEMINI_API_KEY=your_actual_api_key_here</code>
                </div>
                <p className="text-orange-600 text-sm mt-2 font-medium">
                  ⚠️ Vervang "your_actual_api_key_here" met je echte API key!
                </p>
              </div>

              {/* Step 3 - Test */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Stap 3: Test je setup
                </h3>
                <p className="text-gray-600 mb-3">
                  Gebruik de chatbot hieronder om te testen of alles werkt:
                </p>
                <TestChatBot />
              </div>

              {/* Step 4 - Experiment */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Stap 4: Experimenteer!
                </h3>
                <p className="text-gray-600">
                  Nu kun je beginnen met experimenteren. Probeer verschillende vragen, upload afbeeldingen, of bouw je eigen features!
                </p>
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              Wat kun je doen?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  💬
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Chat met AI</h3>
                <p className="text-gray-600 text-sm">Stel vragen en krijg intelligente antwoorden van Gemini AI</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📸
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Afbeelding Analyse</h3>
                <p className="text-gray-600 text-sm">Upload afbeeldingen en laat AI ze analyseren</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  📄
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Document Verwerking</h3>
                <p className="text-gray-600 text-sm">Upload PDF's en Word documenten voor analyse</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🎵
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Audio Transcriptie</h3>
                <p className="text-gray-600 text-sm">Upload audio bestanden voor automatische transcriptie</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🔊
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Text-to-Speech</h3>
                <p className="text-gray-600 text-sm">Laat AI antwoorden voorlezen met natuurlijke stemmen</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  🌐
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Internet Toegang</h3>
                <p className="text-gray-600 text-sm">Krijg actuele informatie via Google Search integratie</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 text-blue-600">
              <span>🎓</span>
              <span>Veel succes met experimenteren!</span>
              <span>🎓</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              AI Template voor HTV Studenten • Powered by Next.js & Gemini AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}