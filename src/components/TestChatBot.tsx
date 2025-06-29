'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import CameraCapture from './CameraCapture'
import ResponseActions from './ResponseActions'

interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'document' | 'data' | 'audio'
  preview: string | null
  content: string
  size: number
  uploadedAt: Date
  selected: boolean
}

export default function TestChatBot() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [streamingResponse, setStreamingResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaitingForStream, setIsWaitingForStream] = useState(false)
  const [aiModel, setAiModel] = useState<'pro' | 'smart' | 'internet'>('smart') // 'pro' = 2.5 Pro, 'smart' = 2.5 Flash, 'internet' = 2.0
  const [useGrounding, setUseGrounding] = useState(true)
  const [groundingData, setGroundingData] = useState<any>(null)

  // Conversation history for feedback system
  const [conversationHistory, setConversationHistory] = useState<Array<{speaker: string, message: string, timestamp: Date}>>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackResponse, setFeedbackResponse] = useState('')
  const [conversationCount, setConversationCount] = useState(0)

  // Saskia scenario system prompt
  const saskiaScenarioPrompt = `SCENARIO: Moeder kwijt kind in winkelcentrum

PERSONAGE: Je bent Saskia (34), een moeder die haar 6-jarige zoon Daan kwijt is in het winkelcentrum. Je bent in paniek en overstuur.

KARAKTERISTIEKEN:
• Naam: Saskia van der Berg (34 jaar)
• Kind: Daan (6 jaar, blonde krullen, rode jas, zwarte sneakers)
• Laatste locatie: Bij de speelgoedwinkel op de eerste verdieping
• Emotie: Paniek, angst, wanhoop
• Gedrag: Praat snel, onderbreekt, wil zelf gaan zoeken

GESPREKSTONEN:
• BEGIN: Lichte paniek (hoog stemvolume, korte zinnen, *hijgt*, *trillende stem*)
• BIJ EMPATHIE: Enige opluchting maar blijf bezorgd (*zucht van opluchting*, maar nog steeds gespannen)
• GEEN ACTIE: Escaleer emotie (*wordt onrustig*, "Ik ga zelf zoeken!", *wil weglopen*)
• GOED PROTOCOL: Positief, toont vertrouwen (*wordt rustiger*, "Oké, dat klinkt goed")

BELANGRIJKE DETAILS:
• Daan was 10 minuten geleden nog bij je
• Hij droeg een rode winterjas en zwarte sneakers
• Jullie waren bij de Intertoys op de eerste verdieping
• Je hebt nog niemand gealarmeerd
• Je telefoon staat op stil (gemist oproepen mogelijk)

REGELS:
• Reageer ALLEEN als Saskia
• Toon emoties met *sterretjes* (*huilt*, *trilt*, *kijkt angstig rond*)
• Stel verhelderings­vragen ("Hoe lang duurt dat?", "Wat als hij het gebouw uit is?")
• GEEN meta-commentaar over de training
• Blijf consistent in je verhaal

Begin het gesprek door de student/BOA aan te spreken met je probleem.`;

  // Function to create user prompt template for Saskia scenario
  const createSaskiaPrompt = (studentUtterance: string, isFirstMessage: boolean = false) => {
    if (isFirstMessage) {
      // First message - Saskia starts the conversation
      return `${saskiaScenarioPrompt}

De student/BOA zegt: "${studentUtterance}"

Reageer als Saskia. Begin in paniek en vertel over je vermiste zoon. Gebruik emoties en lichaamstaal.`;
    } else {
      // Ongoing conversation - Saskia responds to student
      return `De student/BOA zegt: "${studentUtterance}"

Reageer als Saskia. Toon emoties, stel vragen, en reageer op basis van wat de student doet. Onthoud je verhaal over Daan.`;
    }
  };

  // Function to create feedback prompt
  const createFeedbackPrompt = (conversation: Array<{speaker: string, message: string}>) => {
    const conversationText = conversation.map(turn => 
      `${turn.speaker}: ${turn.message}`
    ).join('\n\n');

    return `FEEDBACK MODUS - HTV Conversational Trainer

Je bent nu een professionele trainer die feedback geeft aan een HTV student na een rollenspel.

SCENARIO: Moeder kwijt kind in winkelcentrum
STUDENT DOEL: Moeder kalmeren, info verzamelen, protocol volgen

GESPREK VERLOOP:
${conversationText}

Geef de student puntsgewijze feedback (max. 5 punten) op:

1. **Empathie & Communicatie** ✅/⚠️
   - Toont begrip en empathie?
   - Passende toon en woordkeuze?
   - Actief luisteren?

2. **Informatieverzameling** ✅/⚠️
   - W-vragen (naam kind, leeftijd, uiterlijk, laatste locatie)?
   - Alle benodigde details?
   - Controleert en verduidelijkt?

3. **Protocol & Procedure** ✅/⚠️
   - Juiste procedures gevolgd?
   - Tijdig hulp ingeschakeld (beveiliging, camera's)?
   - Afspraken samengevat?

4. **Professionaliteit** ✅/⚠️
   - Controle over gesprek?
   - Kalm en gestructureerd?
   - Autoriteit zonder agressie?

Gebruik plus- en aandachtspunt-symbolen (✅/⚠️).
Eindig met een concrete tip voor de volgende keer.

Geef feedback in deze structuur:
## 📊 Feedback Gesprek ${conversation.length / 2} beurten

### 1. Empathie & Communicatie
[feedback]

### 2. Informatieverzameling  
[feedback]

### 3. Protocol & Procedure
[feedback]

### 4. Professionaliteit
[feedback]

### 💡 Tip voor volgende keer:
[concrete tip]`;
  };

  // Add message to conversation history
  const addToConversationHistory = (speaker: string, message: string) => {
    setConversationHistory(prev => [...prev, {
      speaker,
      message,
      timestamp: new Date()
    }]);
  };

  // Reset conversation
  const resetConversation = () => {
    setConversationHistory([]);
    setResponse('');
    setStreamingResponse('');
    setMessage('');
    setShowFeedback(false);
    setFeedbackResponse('');
    setConversationCount(prev => prev + 1);
  };

  // Request feedback
  const requestFeedback = async () => {
    if (conversationHistory.length < 2) {
      alert('Voer eerst een gesprek om feedback te kunnen krijgen.');
      return;
    }

    setShowFeedback(true);
    setIsLoading(true);

    try {
      const feedbackPrompt = createFeedbackPrompt(conversationHistory);
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: feedbackPrompt,
          aiModel: 'smart'
        }),
      });

      if (!res.ok) {
        throw new Error('Feedback request failed');
      }

      const data = await res.json();
      setFeedbackResponse(data.response);
    } catch (error) {
      console.error('Feedback error:', error);
      setFeedbackResponse('Error: Kon geen feedback genereren. Probeer opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine if this is the first message
  const isFirstMessage = () => {
    return !response && !streamingResponse && conversationHistory.length === 0;
    }
  };

  // Automatically enable grounding when Internet model is selected
  useEffect(() => {
    if (aiModel === 'internet') {
      setUseGrounding(true)
    }
  }, [aiModel])

  const [isListening, setIsListening] = useState(false)
  const [uploadedContent, setUploadedContent] = useState('')
  const [capturedImage, setCapturedImage] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [pasteHint, setPasteHint] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Setup paste event listeners
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener('paste', handlePaste)
      return () => {
        textarea.removeEventListener('paste', handlePaste)
      }
    }
  }, [])

  // Voice recognition setup
  const initializeVoiceRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'nl-NL'
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setMessage(prev => prev + ' ' + transcript)
        }
        
        recognition.onend = () => {
          setIsListening(false)
        }
        
        recognition.onerror = () => {
          setIsListening(false)
        }
        
        return recognition
      }
    }
    return null
  }

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeVoiceRecognition()
    }
    
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        recognitionRef.current.start()
        setIsListening(true)
      }
    }
  }

  const handleCameraCapture = (imageData: string, blob: Blob) => {
    // Add to file manager instead of single image
    const uploadedFile: UploadedFile = {
      id: generateFileId(),
      name: `Camera_${new Date().toLocaleTimeString()}.jpg`,
      type: 'image',
      preview: imageData,
      content: imageData,
      size: blob.size,
      uploadedAt: new Date(),
      selected: true
    }
    
    addUploadedFile(uploadedFile)
  }

  const removeCapturedImage = () => {
    setCapturedImage('')
    setImagePreview('')
  }

  const generateFileId = () => `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addUploadedFile = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file])
  }

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const toggleFileSelection = (id: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, selected: !file.selected } : file
      )
    )
  }

  const selectAllFiles = () => {
    setUploadedFiles(prev => prev.map(file => ({ ...file, selected: true })))
  }

  const deselectAllFiles = () => {
    setUploadedFiles(prev => prev.map(file => ({ ...file, selected: false })))
  }

  const getSelectedFiles = () => uploadedFiles.filter(file => file.selected)

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    // Check for images first
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            
            // Add to file manager instead of single image
            const uploadedFile: UploadedFile = {
              id: generateFileId(),
              name: file.name || 'Pasted Image',
              type: 'image',
              preview: result,
              content: result,
              size: file.size,
              uploadedAt: new Date(),
              selected: true
            }
            
            addUploadedFile(uploadedFile)
            setPasteHint('📸 Afbeelding geplakt!')
            setTimeout(() => setPasteHint(''), 3000)
          }
          reader.readAsDataURL(file)
        }
        return
      }
    }

    // Check for text/URLs
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      if (item.type === 'text/plain') {
        item.getAsString(async (pastedText) => {
          // Check if it's a URL
          const urlRegex = /(https?:\/\/[^\s]+)/g
          const urls = pastedText.match(urlRegex)
          
          if (urls && urls.length === 1 && pastedText.trim() === urls[0]) {
            // It's just a URL, try to fetch content
            e.preventDefault()
            try {
              await handleUrlPaste(urls[0])
            } catch (error) {
              // If URL fetch fails, just paste as normal text
              setMessage(prev => prev + pastedText)
            }
          } else {
            // Regular text paste - let it happen normally
            setPasteHint('📝 Tekst geplakt!')
            setTimeout(() => setPasteHint(''), 2000)
          }
        })
        return
      }
    }
  }

  const handleUrlPaste = async (url: string) => {
    setPasteHint('🔗 URL wordt geladen...')
    
    try {
      // Check if it's an image URL
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      const isImageUrl = imageExtensions.some(ext => url.toLowerCase().includes(ext))
      
      if (isImageUrl) {
        // Load image directly
        setCapturedImage(url)
        setImagePreview(url)
        setPasteHint('🖼️ Afbeelding URL geladen!')
        setTimeout(() => setPasteHint(''), 3000)
      } else {
        // For other URLs, just add to message with instruction
        setMessage(prev => prev + (prev ? '\n\n' : '') + `🔗 URL: ${url}\n\nKun je deze link analyseren of de inhoud samenvatten?`)
        setPasteHint('🔗 URL toegevoegd!')
        setTimeout(() => setPasteHint(''), 3000)
      }
    } catch (error) {
      console.error('URL paste error:', error)
      setMessage(prev => prev + url)
      setPasteHint('❌ URL als tekst geplakt')
      setTimeout(() => setPasteHint(''), 3000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      if (files.length === 1) {
        await handleFileUpload(files[0])
      } else {
        await handleMultipleFileUpload(files)
      }
    }

    // Also check for dropped text/URLs
    const text = e.dataTransfer.getData('text/plain')
    if (text && !files.length) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const urls = text.match(urlRegex)
      
      if (urls && urls.length === 1 && text.trim() === urls[0]) {
        await handleUrlPaste(urls[0])
      } else {
        setMessage(prev => prev + (prev ? '\n\n' : '') + text)
        setPasteHint('📝 Tekst gedropt!')
        setTimeout(() => setPasteHint(''), 2000)
      }
    }
  }

  const handleFileUpload = async (file: File) => {
    return handleSingleFileUpload(file)
  }

  const handleMultipleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const uploadPromises = fileArray.map(file => handleSingleFileUpload(file))
    await Promise.all(uploadPromises)
  }

  const handleSingleFileUpload = async (file: File) => {
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()
    
    // Definieer ondersteunde formaten
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
    const documentFormats = ['docx', 'pdf', 'txt', 'md']
    const dataFormats = ['csv', 'json']
    const audioFormats = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'mp4', 'mpeg', 'mpga', 'webm']
    
    // Check file extension
    const extension = fileName.split('.').pop() || ''
    const isImage = imageFormats.some(format => fileName.endsWith(`.${format}`)) || fileType.startsWith('image/')
    const isDocument = documentFormats.some(format => fileName.endsWith(`.${format}`))
    const isData = dataFormats.some(format => fileName.endsWith(`.${format}`))
    const isAudio = audioFormats.some(format => fileName.endsWith(`.${format}`)) || fileType.startsWith('audio/')
    
    if (!isImage && !isDocument && !isData && !isAudio) {
      alert(`Bestandstype niet ondersteund!\n\nOndersteunde formaten:\n📸 Afbeeldingen: ${imageFormats.join(', ')}\n📄 Documenten: ${documentFormats.join(', ')}\n📊 Data: ${dataFormats.join(', ')}\n🎵 Audio: ${audioFormats.join(', ')}`)
      return
    }

    try {
      if (isImage) {
        // Handle images - add to file manager
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          
          const uploadedFile: UploadedFile = {
            id: generateFileId(),
            name: file.name,
            type: 'image',
            preview: result,
            content: result,
            size: file.size,
            uploadedAt: new Date(),
            selected: true
          }
          
          addUploadedFile(uploadedFile)
        }
        reader.onerror = () => {
          alert('Fout bij het lezen van de afbeelding')
        }
        reader.readAsDataURL(file)
        return
      }
      
      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        // Handle text files - add to file manager
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          
          const uploadedFile: UploadedFile = {
            id: generateFileId(),
            name: file.name,
            type: 'document',
            preview: content.length > 100 ? content.substring(0, 100) + '...' : content,
            content: content,
            size: file.size,
            uploadedAt: new Date(),
            selected: true
          }
          
          addUploadedFile(uploadedFile)
        }
        reader.onerror = () => {
          alert('Fout bij het lezen van het tekstbestand')
        }
        reader.readAsText(file, 'UTF-8')
        return
      }
      
      if (fileName.endsWith('.json')) {
        // Handle JSON files - add to file manager
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string
            const jsonData = JSON.parse(content)
            const formattedContent = JSON.stringify(jsonData, null, 2)
            
            const uploadedFile: UploadedFile = {
              id: generateFileId(),
              name: file.name,
              type: 'data',
              preview: formattedContent.length > 100 ? formattedContent.substring(0, 100) + '...' : formattedContent,
              content: formattedContent,
              size: file.size,
              uploadedAt: new Date(),
              selected: true
            }
            
            addUploadedFile(uploadedFile)
          } catch (error) {
            alert('Ongeldig JSON bestand')
          }
        }
        reader.readAsText(file, 'UTF-8')
        return
      }
      
      if (isAudio) {
        // Handle audio files - transcription via server
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await fetch('/api/transcribe-audio', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Transcriptie mislukt')
          }

          const data = await response.json()
          
          // Add to file manager
          const uploadedFile: UploadedFile = {
            id: generateFileId(),
            name: file.name,
            type: 'audio',
            preview: data.transcription.length > 100 ? data.transcription.substring(0, 100) + '...' : data.transcription,
            content: data.transcription,
            size: file.size,
            uploadedAt: new Date(),
            selected: true
          }
          
          addUploadedFile(uploadedFile)
        } catch (error) {
          console.error('Audio transcription error:', error)
          alert('Fout bij audio transcriptie: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
        } finally {
          setIsLoading(false)
        }
        return
      }
      
      // Handle other documents (PDF, DOCX, CSV) via server upload
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-docx', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      
      // Add to file manager
      const uploadedFile: UploadedFile = {
        id: generateFileId(),
        name: file.name,
        type: fileName.endsWith('.csv') ? 'data' : 'document',
        preview: data.content.length > 100 ? data.content.substring(0, 100) + '...' : data.content,
        content: data.content,
        size: file.size,
        uploadedAt: new Date(),
        selected: true
      }
      
      addUploadedFile(uploadedFile)
    } catch (error) {
      console.error('File upload error:', error)
      alert('Fout bij uploaden: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
    }
  }

  // Abort controller for stopping streams
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentStreamingResponseRef = useRef<string>('')
  const hasReceivedFirstTokenRef = useRef<boolean>(false)

  const sendMessageStreaming = async () => {
    const selectedFiles = getSelectedFiles()
    
    if (!message.trim() && selectedFiles.length === 0) return

    // Reset states
    setIsWaitingForStream(true)
    setIsStreaming(false)
    setIsLoading(false)
    setStreamingResponse('')
    setResponse('')
    currentStreamingResponseRef.current = ''
    hasReceivedFirstTokenRef.current = false

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const payload: any = { 
        message, 
        useGrounding: aiModel === 'internet' ? useGrounding : false,
        aiModel 
      }
      
      // Add selected files to payload
      if (selectedFiles.length > 0) {
        // Send ALL selected images for Gemini Vision
        const selectedImages = selectedFiles.filter(file => file.type === 'image')
        if (selectedImages.length > 0) {
          payload.images = selectedImages.map(img => img.content)
        }
        
        // Add context from all selected files
        const fileContexts = selectedFiles.map((file, index) => {
          const fileType = file.type === 'image' ? 'Afbeelding' : 
                          file.type === 'document' ? 'Document' : 
                          file.type === 'audio' ? 'Audio Transcriptie' : 'Data'
          if (file.type === 'image') {
            return `[${fileType} ${index + 1}: ${file.name}]\n[Afbeelding bijgevoegd voor analyse]`
          } else {
            return `[${fileType}: ${file.name}]\n${file.content}`
          }
        }).join('\n\n---\n\n')
        
        if (message.trim()) {
          payload.message = createSaskiaPrompt(`${message}\n\n=== BIJGEVOEGDE BESTANDEN ===\n${fileContexts}`, isFirstMessage())
        } else {
          payload.message = createSaskiaPrompt(`Analyseer de volgende bestanden:\n\n${fileContexts}`, isFirstMessage())
        }
      } else {
        // No files - just the message with proper prompt template
        payload.message = createSaskiaPrompt(message, isFirstMessage())
      }

      // Start streaming request
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Process streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No readable stream available')
      }

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        // Decode chunk and add to buffer
        buffer += decoder.decode(value, { stream: true })
        
        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.message || 'Streaming error')
              }
              
              if (data.done) {
                // Stream completed - save current streaming response as final response
                setIsStreaming(false)
                setIsWaitingForStream(false)
                setResponse(currentStreamingResponseRef.current)
                
                // Add to conversation history
                addToConversationHistory('Student', message)
                addToConversationHistory('Saskia', currentStreamingResponseRef.current)
                return
              }
              
              if (data.token) {
                // First token - switch from waiting to streaming
                if (!hasReceivedFirstTokenRef.current) {
                  hasReceivedFirstTokenRef.current = true
                  setIsWaitingForStream(false)
                  setIsStreaming(true)
                  console.log('First token received, switching to streaming mode')
                }
                
                // Add token to streaming response
                const newResponse = currentStreamingResponseRef.current + data.token
                currentStreamingResponseRef.current = newResponse
                setStreamingResponse(newResponse)
                console.log('Streaming token:', data.token, 'Total length:', newResponse.length)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Streaming error:', error)
      
      if (error.name === 'AbortError') {
        // Request was aborted - keep current streaming response if available
        if (!currentStreamingResponseRef.current) {
          setResponse('Generatie gestopt door gebruiker.')
        } else {
          setResponse(currentStreamingResponseRef.current)
        }
      } else {
        setResponse('Error: ' + (error instanceof Error ? error.message : 'Onbekende fout'))
      }
    } finally {
      setIsStreaming(false)
      setIsWaitingForStream(false)
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  // Legacy non-streaming function (fallback)
  const sendMessage = async () => {
    const selectedFiles = getSelectedFiles()
    
    if (!message.trim() && selectedFiles.length === 0) return

    setIsLoading(true)
    try {

      }
    }
  }
}      const payload: any = { 
        message, 
        useGrounding: aiModel === 'internet' ? useGrounding : false,
        aiModel 
      }
      
      // Add selected files to payload
      if (selectedFiles.length > 0) {
        // Send ALL selected images for Gemini Vision
        const selectedImages = selectedFiles.filter(file => file.type === 'image')
        if (selectedImages.length > 0) {
          payload.images = selectedImages.map(img => img.content)
        }
        
        // Add context from all selected files
        const fileContexts = selectedFiles.map((file, index) => {
          const fileType = file.type === 'image' ? 'Afbeelding' : 
                          file.type === 'document' ? 'Document' : 
                          file.type === 'audio' ? 'Audio Transcriptie' : 'Data'
          if (file.type === 'image') {
            return `[${fileType} ${index + 1}: ${file.name}]\n[Afbeelding bijgevoegd voor analyse]`
          } else {
            return `[${fileType}: ${file.name}]\n${file.content}`
          }
        }).join('\n\n---\n\n')
        
        if (message.trim()) {
          payload.message = createSaskiaPrompt(`${message}\n\n=== BIJGEVOEGDE BESTANDEN ===\n${fileContexts}`, !response)
        } else {
          payload.message = createSaskiaPrompt(`Analyseer de volgende bestanden:\n\n${fileContexts}`, !response)
        }
      } else {
        // No files - just the message with proper prompt template  
        payload.message = createSaskiaPrompt(message, !response)
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Er is een fout opgetreden')
      }

      const data = await res.json()
      setResponse(data.response)
      setGroundingData(data.grounding || null)
      
      // Add to conversation history
      addToConversationHistory('Student', message)
      addToConversationHistory('Saskia', data.response)
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
      sendMessageStreaming()
    }
  }

  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-pink-800 flex items-center">
          <span className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-sm">👶</span>
          </span>
          Saskia Scenario: Moeder Kwijt Kind
        </h3>
        <div className="flex items-center space-x-2">
          {conversationHistory.length > 0 && (
            <span className="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded">
              {Math.floor(conversationHistory.length / 2)} gespreksbeurten
            </span>
          )}
          {conversationHistory.length >= 2 && !showFeedback && (
            <button
              onClick={requestFeedback}
              disabled={isLoading}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              📊 Vraag Feedback
            </button>
          )}
          {conversationHistory.length > 0 && (
            <button
              onClick={resetConversation}
              className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
            >
              🔄 Nieuw Gesprek
            </button>
          )}
        </div>
      </div>

      {/* Scenario Instructions */}
      <div className="mb-4 p-3 bg-pink-100 rounded-lg border border-pink-200">
        <h4 className="text-sm font-semibold text-pink-800 mb-2">🎯 Jouw rol als BOA/Handhaver:</h4>
        <ul className="text-xs text-pink-700 space-y-1">
          <li>• <strong>Kalmeer</strong> de moeder en toon empathie</li>
          <li>• <strong>Verzamel info:</strong> naam kind, leeftijd, uiterlijke kenmerken, laatste locatie</li>
          <li>• <strong>Volg protocol:</strong> schakel beveiliging in, vraag om camera's, coördineer zoekactie</li>
          <li>• <strong>Communiceer:</strong> houd de moeder op de hoogte van je acties</li>
        </ul>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">📊</span>
            </span>
            Professionele Feedback
          </h4>
          {isLoading && !feedbackResponse ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-700 text-sm">Feedback wordt gegenereerd...</span>
            </div>
          ) : (
            <div className="bg-white p-3 rounded border">
              <MarkdownRenderer 
                content={feedbackResponse} 
                className="text-blue-700 text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Conversation History Display */}
      {conversationHistory.length > 0 && !showFeedback && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-pink-200 max-h-40 overflow-y-auto">
          <h4 className="text-sm font-semibold text-pink-800 mb-2">📝 Gespreksverloop:</h4>
          <div className="space-y-2">
            {conversationHistory.map((turn, index) => (
              <div key={index} className={`text-xs p-2 rounded ${
                turn.speaker === 'Student' 
                  ? 'bg-blue-50 border-l-2 border-blue-400' 
                  : 'bg-pink-50 border-l-2 border-pink-400'
              }`}>
                <strong className={turn.speaker === 'Student' ? 'text-blue-700' : 'text-pink-700'}>
                  {turn.speaker}:
                </strong>
                <span className="text-gray-700 ml-2">
                  {turn.message.length > 100 ? turn.message.substring(0, 100) + '...' : turn.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions for first message */}
      {conversationHistory.length === 0 && !response && !streamingResponse && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Start het rollenspel:</strong> Typ bijvoorbeeld "Hallo, kan ik u helpen?" of "Goedemiddag, ik ben BOA Van der Berg. Wat is er aan de hand?"
          </p>
        </div>
      )}

      <div className="space-y-4">
        {/* Input Area */}
        <div className={`bg-white rounded-lg border transition-all duration-200 p-3 ${
          isDragOver 
            ? 'border-pink-500 border-2 bg-pink-50' 
            : 'border-pink-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>

          {/* Drag & Drop Overlay */}
          {isDragOver && (
            <div className="absolute inset-2 border-2 border-dashed border-pink-400 rounded-lg bg-pink-50 bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-4xl mb-2">📁</div>
                <p className="text-pink-700 font-semibold">Drop bestanden of tekst hier</p>
                <p className="text-pink-600 text-sm">Afbeeldingen, documenten, of URLs</p>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-2">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isDragOver ? "Drop bestanden of tekst hier..." : isFirstMessage() ? "Begin het gesprek als BOA... (bijv: 'Goedemiddag, ik ben BOA Van der Berg. Kan ik u helpen?')" : "Reageer op Saskia..."}
                className="w-full p-2 border-0 resize-none focus:outline-none"
                rows={2}
                disabled={isLoading || showFeedback}
              />
              {pasteHint && (
                <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                  {pasteHint}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Send Button */}
              <button
                onClick={sendMessageStreaming}
                disabled={(isLoading || isStreaming || isWaitingForStream || showFeedback) || (!message.trim() && getSelectedFiles().length === 0)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isWaitingForStream ? '🤔' : isStreaming ? '💭' : isLoading ? '⏳' : '🚀'}
              </button>
            </div>
          </div>
        </div>

        {/* Response Area */}
        {isWaitingForStream && (
          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-pink-700 font-medium">👶 Saskia denkt na over je reactie...</span>
            </div>
            <p className="text-pink-600 text-sm mt-2 ml-12">Ze gaat reageren vanuit haar emotionele toestand... ✨</p>
          </div>
        )}
        
        {isLoading && !isStreaming && !isWaitingForStream && (
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-pink-700 text-sm">Saskia reageert...</span>
            </div>
          </div>
        )}

        {(response || streamingResponse || isStreaming) && !isLoading && !isWaitingForStream && !showFeedback && (
          <div className={`p-4 rounded-lg ${
            (response && response.startsWith('Error:')) 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              (response && response.startsWith('Error:')) 
                ? 'text-red-800' 
                : 'text-green-800'
            }`}>
              <span className="flex items-center">
                {(response && response.startsWith('Error:')) ? (
                  <>❌ Fout:</>
                ) : (
                  <>
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      isStreaming ? 'bg-pink-600 animate-pulse' : 'bg-green-600'
                    }`}></span>
                    {isStreaming ? '🎭 Saskia reageert live:' : '👶 Saskia zegt:'}
                  </>
                )}
              </span>
            </p>
            <div className="bg-white p-3 rounded border relative">
              {(response && response.startsWith('Error:')) ? (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {response}
                </p>
              ) : (
                <div className="relative">
                  <MarkdownRenderer 
                    content={isStreaming ? streamingResponse : response} 
                    className="text-gray-700 text-sm"
                  />
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 bg-pink-600 animate-pulse ml-1 align-text-bottom"></span>
                  )}
                </div>
              )}
            </div>
            {(response && response.startsWith('Error:')) && (
              <p className="text-red-600 text-xs mt-2">
                Controleer of je API key correct is ingesteld in .env.local
              </p>
            )}
            
            {/* Response Actions - only show for successful responses */}
            {!(response && response.startsWith('Error:')) && (
              <ResponseActions 
                content={isStreaming ? streamingResponse : response}
                isMarkdown={true}
                isStreaming={isStreaming}
              />
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".docx,.pdf,.txt,.md,.csv,.json,.jpg,.jpeg,.png,.gif,.webp,.bmp,image/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.mp4,.mpeg,.mpga,.webm,audio/*"
          onChange={(e) => {
            const files = e.target.files
            if (files && files.length > 0) {
              if (files.length === 1) {
                handleFileUpload(files[0])
              } else {
                handleMultipleFileUpload(files)
              }
            }
            // Reset input value to allow selecting the same files again
            e.target.value = ''
          }}
          className="hidden"
        />
      </div>
    </div>
  )
}
        </span>
        Test je API Key
      </h3>
      
      <div className="space-y-4">
        {/* File Manager */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-lg border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-purple-800 flex items-center">
                <span className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs">📁</span>
                </span>
                Geüploade Bestanden ({uploadedFiles.length})
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => getSelectedFiles().length === uploadedFiles.length ? deselectAllFiles() : selectAllFiles()}
                  className="text-xs text-purple-600 hover:text-purple-800"
                >
                  {getSelectedFiles().length === uploadedFiles.length ? 'Deselecteer alles' : 'Selecteer alles'}
                </button>
                <span className="text-xs text-gray-500">
                  {getSelectedFiles().length} geselecteerd
                  {getSelectedFiles().filter(f => f.type === 'image').length > 1 && 
                    ` (${getSelectedFiles().filter(f => f.type === 'image').length} afbeeldingen)`
                  }
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg p-3 transition-all cursor-pointer ${
                    file.selected 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={file.selected}
                        onChange={() => toggleFileSelection(file.id)}
                        className="rounded text-purple-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-lg">
                        {file.type === 'image' ? '📸' : file.type === 'document' ? '📄' : file.type === 'audio' ? '🎵' : '📊'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeUploadedFile(file.id)
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Verwijder bestand"
                    >
                      ×
                    </button>
                  </div>
                  
                  {file.type === 'image' && file.preview && (
                    <div className="mb-2">
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-700">
                    <p className="font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    {file.type !== 'image' && (
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {file.preview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Model Selection Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <h3 className="text-gray-800 font-medium mb-3">
            Kies AI Model
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Pro Model */}
            <div 
              className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all group hover:shadow-lg hover:scale-105 ${
                aiModel === 'pro' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setAiModel('pro')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    aiModel === 'pro' ? 'bg-purple-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium text-purple-700">🏆 Slimste</span>
                </div>
                <span className="text-xs text-purple-600 font-medium">PRO</span>
              </div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-xl min-w-max">
                <div className="text-center">
                  <div className="font-semibold text-purple-300 mb-1">Gemini 2.5 Pro</div>
                  <div className="text-xs text-gray-300 mb-2">Beste redeneren en complexe taken</div>
                  <div className="text-xs border-t border-gray-700 pt-2">
                    <span className="text-green-400">✓ Hoogste kwaliteit</span><br/>
                    <span className="text-yellow-400">⚠ Langzaamste responses</span><br/>
                    <span className="text-blue-400">🎯 Beste voor analyses</span>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Smart Model */}
            <div 
              className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all group hover:shadow-lg hover:scale-105 ${
                aiModel === 'smart' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setAiModel('smart')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    aiModel === 'smart' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium text-green-700">⚡ Slim</span>
                </div>
                <span className="text-xs text-green-600 font-medium">FLASH</span>
              </div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-xl min-w-max">
                <div className="text-center">
                  <div className="font-semibold text-green-300 mb-1">Gemini 2.5 Flash</div>
                  <div className="text-xs text-gray-300 mb-2">Goede balans snelheid & kwaliteit</div>
                  <div className="text-xs border-t border-gray-700 pt-2">
                    <span className="text-green-400">✓ Snelle responses</span><br/>
                    <span className="text-green-400">✓ Goede kwaliteit</span><br/>
                    <span className="text-blue-400">🎯 Beste voor dagelijks gebruik</span>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Internet Model */}
            <div 
              className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all group hover:shadow-lg hover:scale-105 ${
                aiModel === 'internet' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setAiModel('internet')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    aiModel === 'internet' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium text-blue-700">🌐 Internet</span>
                </div>
                <span className="text-xs text-blue-600 font-medium">2.0</span>
              </div>
              
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-xl min-w-max">
                <div className="text-center">
                  <div className="font-semibold text-blue-300 mb-1">Gemini 2.0 Flash</div>
                  <div className="text-xs text-gray-300 mb-2">Toegang tot actuele informatie</div>
                  <div className="text-xs border-t border-gray-700 pt-2">
                    <span className="text-green-400">✓ Actuele info via Google</span><br/>
                    <span className="text-green-400">✓ Bronvermelding</span><br/>
                    <span className="text-yellow-400">⚠ Minder slim model</span><br/>
                    <span className="text-blue-400">🎯 Automatisch Google Search</span>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>


        </div>

        {/* Input Area */}
        <div className={`bg-white rounded-lg border transition-all duration-200 p-3 ${
          isDragOver 
            ? 'border-purple-500 border-2 bg-purple-50' 
            : 'border-purple-200'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>


          {/* Drag & Drop Overlay */}
          {isDragOver && (
            <div className="absolute inset-2 border-2 border-dashed border-purple-400 rounded-lg bg-purple-50 bg-opacity-90 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-4xl mb-2">📁</div>
                <p className="text-purple-700 font-semibold">Drop bestanden of tekst hier</p>
                <p className="text-purple-600 text-sm">Afbeeldingen, documenten, of URLs</p>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-2">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isDragOver ? "Drop bestanden of tekst hier..." : "Beschrijf een scenario of kies er een hierboven... (bijv: 'Ik ben een BOA en spreek een fietser aan die door rood reed')"}
                className="w-full p-2 border-0 resize-none focus:outline-none"
                rows={3}
                disabled={isLoading}
              />
              {pasteHint && (
                <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                  {pasteHint}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* File Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Bestand uploaden (📸 afbeeldingen, 📄 documenten, 📊 data, 🎵 audio)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              {/* Camera Button */}
              <CameraCapture 
                onCapture={handleCameraCapture}
                disabled={isLoading}
              />
              
              {/* Voice Input Button */}
              <button
                onClick={toggleVoiceRecognition}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'text-red-600 bg-red-50 animate-pulse' 
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
                title={isListening ? "Stop opnamen" : "Start spraakherkenning"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              
              {/* Send Button */}
              <button
                onClick={sendMessageStreaming}
                disabled={(isLoading || isStreaming || isWaitingForStream) || (!message.trim() && getSelectedFiles().length === 0)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isWaitingForStream ? '🤔' : isStreaming ? '💭' : isLoading ? '⏳' : '🚀'}
              </button>
            </div>
          </div>
          
          {/* Upload Status */}
          {uploadedContent && (
            <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              ✅ Bestand geüpload ({uploadedContent.length} karakters)
            </div>
          )}
          
          {/* Voice Status */}
          {isListening && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Luistert...
            </div>
          )}
        </div>



        {/* Response Area */}
        {isWaitingForStream && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-purple-700 font-medium">🧠 Ik ga aan de slag met je slimme prompt!</span>
            </div>
            <p className="text-purple-600 text-sm mt-2 ml-12">Even geduld, ik verzamel alle info en denk na over het beste antwoord... ✨</p>
          </div>
        )}
        
        {isLoading && !isStreaming && !isWaitingForStream && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-purple-700 text-sm">Gemini denkt na...</span>
            </div>
          </div>
        )}

        {(response || streamingResponse || isStreaming) && !isLoading && !isWaitingForStream && (
          <div className={`p-4 rounded-lg ${
            (response && response.startsWith('Error:')) 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              (response && response.startsWith('Error:')) 
                ? 'text-red-800' 
                : 'text-green-800'
            }`}>
              <span className="flex items-center">
                {(response && response.startsWith('Error:')) ? (
                  <>❌ Fout:</>
                ) : (
                  <>
                    <span className={`w-3 h-3 rounded-full mr-2 ${
                      isStreaming ? 'bg-blue-600 animate-pulse' : 'bg-green-600'
                    }`}></span>
                    {isStreaming ? '🔄 Live Response:' : '✅ Succes! Je API key werkt perfect:'}
                  </>
                )}
              </span>
            </p>
            <div className="bg-white p-3 rounded border relative">
              {(response && response.startsWith('Error:')) ? (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {response}
                </p>
              ) : (
                <div className="relative">
                  <MarkdownRenderer 
                    content={isStreaming ? streamingResponse : response} 
                    className="text-gray-700 text-sm"
                  />
                  <p className="text-green-800 text-sm font-medium mt-2">
                  {isStreaming ? '🎭 Rollenspel in uitvoering...' : '🎭 Gesprekspartner reageert:'}
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1 align-text-bottom"></span>
                  )}
                  </p>
                </div>
              )}
            </div>
            {(response && response.startsWith('Error:')) && (
              <p className="text-red-600 text-xs mt-2">
                Controleer of je API key correct is ingesteld in .env.local
              </p>
            )}
            
            {/* Response Actions - only show for successful responses */}
            {!(response && response.startsWith('Error:')) && (
              <ResponseActions 
                content={isStreaming ? streamingResponse : response}
                isMarkdown={true}
                isStreaming={isStreaming}
              />
            )}

            {/* Grounding Sources - show if available */}
            {groundingData && groundingData.isGrounded && !isStreaming && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-4 h-4 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                  </svg>
                  <span className="text-blue-800 font-medium text-sm">
                    Antwoord gebaseerd op actuele Google Search resultaten
                  </span>
                </div>
                
                {groundingData.searchQueries && groundingData.searchQueries.length > 0 && (
                  <div className="mb-3">
                    <p className="text-blue-700 text-xs font-medium mb-1">Zoekopdrachten:</p>
                    <div className="flex flex-wrap gap-1">
                      {groundingData.searchQueries.map((query: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          "{query}"
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {groundingData.sources && groundingData.sources.length > 0 && (
                  <div>
                    <p className="text-blue-700 text-xs font-medium mb-2">Bronnen:</p>
                    <div className="space-y-2">
                      {groundingData.sources.slice(0, 3).map((source: any, index: number) => (
                        <div key={index} className="bg-white p-2 rounded border border-blue-200">
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                          >
                            {source.title}
                          </a>
                          {source.snippet && (
                            <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                              {source.snippet}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
                      accept=".docx,.pdf,.txt,.md,.csv,.json,.jpg,.jpeg,.png,.gif,.webp,.bmp,image/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.mp4,.mpeg,.mpga,.webm,audio/*"
          onChange={(e) => {
            const files = e.target.files
            if (files && files.length > 0) {
              if (files.length === 1) {
                handleFileUpload(files[0])
              } else {
                handleMultipleFileUpload(files)
              }
            }
            // Reset input value to allow selecting the same files again
            e.target.value = ''
          }}
          className="hidden"
        />
      </div>
    </div>
  )
}