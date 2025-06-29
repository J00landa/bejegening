import TestChatBot from '@/components/TestChatBot'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            HTV Conversational Trainer
          </h1>
          
          <p className="text-xl text-blue-700 font-medium mb-6">
            Oefen realistische gesprekssituaties voor Handhaving, Toezicht en Veiligheid
          </p>

          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🎭 Hoe werkt de Conversational Trainer?
            </h2>
            <div className="text-left space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-2xl">1️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-800">Kies een scenario</h3>
                  <p className="text-sm text-gray-600">Selecteer uit verschillende praktijksituaties of beschrijf je eigen scenario</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-green-600 text-2xl">2️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-800">Start het rollenspel</h3>
                  <p className="text-sm text-gray-600">De AI neemt de rol aan van de gesprekspartner (burger, overtreder, collega, etc.)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-600 text-2xl">3️⃣</span>
                <div>
                  <h3 className="font-medium text-gray-800">Oefen het gesprek</h3>
                  <p className="text-sm text-gray-600">Reageer natuurlijk - de AI toont emoties, lichaamstaal en reageert dynamisch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🎯
              </span>
              Kies een scenario om mee te oefenen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Handhaving scenarios */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🚫</span>
                  <h3 className="font-semibold text-red-800">Overtreding APV</h3>
                </div>
                <p className="text-sm text-red-700 mb-3">Aanspreek van een persoon die alcohol drinkt op straat</p>
                <div className="text-xs text-red-600 space-y-1">
                  <p>• <strong>Rol:</strong> Boze burger die zich onterecht behandeld voelt</p>
                  <p>• <strong>Emotie:</strong> Defensief, geïrriteerd</p>
                  <p>• <strong>Uitdaging:</strong> De-escalatie en uitleg wetgeving</p>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🚗</span>
                  <h3 className="font-semibold text-orange-800">Parkeerovertreding</h3>
                </div>
                <p className="text-sm text-orange-700 mb-3">Gesprek met automobilist die verkeerd geparkeerd staat</p>
                <div className="text-xs text-orange-600 space-y-1">
                  <p>• <strong>Rol:</strong> Gehaaste automobilist met excuses</p>
                  <p>• <strong>Emotie:</strong> Gestrest, smekend</p>
                  <p>• <strong>Uitdaging:</strong> Consequent blijven, empathie tonen</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🏪</span>
                  <h3 className="font-semibold text-purple-800">Controle winkel</h3>
                </div>
                <p className="text-sm text-purple-700 mb-3">Inspectie van een horecagelegenheid</p>
                <div className="text-xs text-purple-600 space-y-1">
                  <p>• <strong>Rol:</strong> Eigenaar die niet wil meewerken</p>
                  <p>• <strong>Emotie:</strong> Wantrouwend, obstructief</p>
                  <p>• <strong>Uitdaging:</strong> Autoriteit uitstralen, rechten uitleggen</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">👥</span>
                  <h3 className="font-semibold text-green-800">Groep jongeren</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">Aanspreken van overlastgevende jongeren</p>
                <div className="text-xs text-green-600 space-y-1">
                  <p>• <strong>Rol:</strong> Stoere jongere die indruk wil maken</p>
                  <p>• <strong>Emotie:</strong> Uitdagend, respectloos</p>
                  <p>• <strong>Uitdaging:</strong> Respect afdwingen zonder escalatie</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🏠</span>
                  <h3 className="font-semibold text-blue-800">Burenruzie</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">Bemiddeling bij geluidsoverlast klacht</p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>• <strong>Rol:</strong> Emotionele bewoner met klacht</p>
                  <p>• <strong>Emotie:</strong> Gefrustreerd, verontwaardigd</p>
                  <p>• <strong>Uitdaging:</strong> Objectief blijven, beide kanten horen</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🎪</span>
                  <h3 className="font-semibold text-yellow-800">Evenement controle</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">Toezicht bij een druk evenement</p>
                <div className="text-xs text-yellow-600 space-y-1">
                  <p>• <strong>Rol:</strong> Organisator onder druk</p>
                  <p>• <strong>Emotie:</strong> Gestrest, tijdsdruk</p>
                  <p>• <strong>Uitdaging:</strong> Veiligheid vs. doorgang evenement</p>
                </div>
              </div>
            </div>

            {/* Missing Child Scenario */}
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">👶</span>
                <h3 className="font-semibold text-pink-800">Moeder kwijt kind</h3>
              </div>
              <p className="text-sm text-pink-700 mb-3">Paniekende moeder heeft haar kind verloren in winkelcentrum</p>
              <div className="text-xs text-pink-600 space-y-1">
                <p>• <strong>Rol:</strong> Emotionele moeder in paniek</p>
                <p>• <strong>Emotie:</strong> Angstig, wanhopig, overstuur</p>
                <p>• <strong>Uitdaging:</strong> Kalmeren, info verzamelen, protocol volgen</p>
              </div>
              <div className="mt-3 p-2 bg-pink-100 rounded text-xs text-pink-800">
                <strong>Doelen student:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Moeder kalmeren en geruststellen</li>
                  <li>• Info verzamelen (naam, leeftijd, uiterlijk, laatste locatie)</li>
                  <li>• Opschalingsprotocol volgen (beveiliging, camera's)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">💡 Of beschrijf je eigen scenario:</h3>
              <p className="text-sm text-gray-600">
                Type bijvoorbeeld: "Ik wil oefenen met een agressieve fietser die een boete krijgt voor door rood rijden" 
                of "Simuleer een gesprek met een winkelier die zijn vergunning niet kan tonen"
              </p>
            </div>
          </div>
        </div>

        {/* Trainer Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                🎭
              </span>
              Start je rollenspel training
            </h2>
            <TestChatBot />
          </div>

          {/* Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-green-800 font-medium text-sm">Tips voor effectief oefenen</h3>
                  <ul className="text-green-700 text-xs mt-1 space-y-1">
                    <li>• Reageer natuurlijk zoals je in het echt zou doen</li>
                    <li>• Let op de emoties en lichaamstaal van je gesprekspartner</li>
                    <li>• Oefen verschillende de-escalatie technieken</li>
                    <li>• Vraag om feedback na het gesprek</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-blue-800 font-medium text-sm">Wat de AI voor je doet</h3>
                  <ul className="text-blue-700 text-xs mt-1 space-y-1">
                    <li>• Speelt consistent dezelfde rol gedurende het gesprek</li>
                    <li>• Toont realistische emoties en reacties</li>
                    <li>• Reageert op jouw communicatiestijl</li>
                    <li>• Onthoudt details uit het gesprek</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 text-blue-600">
              <span>🎭</span>
              <span>Veel succes met je conversatietraining!</span>
              <span>🎭</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              HTV Conversational Trainer • Realistische rollenspellen voor handhaving professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}