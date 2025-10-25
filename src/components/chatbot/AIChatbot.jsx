import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Mic, Volume2, Loader2, Sparkles } from 'lucide-react'
import Button from '../common/Button'
import geminiService from '../../services/geminiService'
import SimpleTTS from '../accessibility/SimpleTTS'

// Hazır soru önerileri
const SUGGESTED_QUESTIONS = [
  '👋 Erişilebilir Akademi nedir?',
  '♿ Görme engelliler için hangi özellikler var?',
  '👂 İşitme engelliler için neler sunuyorsunuz?',
  '📤 Nasıl materyal yüklerim?',
  '🎙️ Sesli okuma nasıl çalışır?',
  '🎨 Tema nasıl değiştirilir?',
  '⌨️ Klavye ile nasıl gezinirim?',
  '🤖 AI özellikleri nelerdir?',
]

/**
 * AI Chatbot Widget
 * - Floating chat penceresi
 * - Yazılı sohbet (Gemini Chat)
 * - Sesli soru sorma (Speech-to-Text)
 * - Sesli cevap (Gemini TTS)
 * - Hazır soru önerileri
 */
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Merhaba! Ben Erişilebilir Akademi asistanıyım. Size nasıl yardımcı olabilirim? Hazır sorulara tıklayabilir veya kendiniz soru sorabilirsiniz.',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Mesajları scroll et
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Speech Recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.lang = 'tr-TR'
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleSendMessage = async (question = null) => {
    const messageText = question || inputText.trim()
    if (!messageText) return

    // Kullanıcı mesajını ekle
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Gemini'ye sor
      const response = await geminiService.chatWithBot(messageText, messages)
      
      // AI cevabını ekle
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat hatası:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Tarayıcınız sesli girişi desteklemiyor.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSuggestedQuestion = (question) => {
    // Emoji'yi kaldır
    const cleanQuestion = question.replace(/^[^\s]+\s/, '')
    handleSendMessage(cleanQuestion)
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center"
            ariaLabel="Chatbot'u aç"
          >
            <MessageCircle size={28} className="text-white" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-pink-500"></span>
            </span>
          </Button>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 flex flex-col"
          style={{ height: '600px', maxHeight: 'calc(100vh - 3rem)' }}
          role="dialog"
          aria-label="AI Asistan Sohbet Penceresi"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles size={24} />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
              <div>
                <h3 className="font-bold">AI Asistan</h3>
                <p className="text-xs opacity-90">Gemini ile güçlendirildi</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Chatbot'u kapat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white p-3'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <p className={`text-sm whitespace-pre-wrap ${message.role === 'assistant' ? 'p-3 pb-0' : ''}`}>
                    {message.content}
                  </p>
                  
                  {/* AI cevabı için sesli okuma - Basit TTS (Tüm mesajlar için) */}
                  {message.role === 'assistant' && (
                    <div className="px-3 pb-3 pt-2">
                      <SimpleTTS 
                        text={message.content}
                        label="🎙️ Dinle"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        💡 Cevabı sesli dinlemek için tıklayın
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                  <Loader2 size={20} className="animate-spin text-purple-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                💡 Örnek Sorular:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {/* Voice Input */}
              <Button
                onClick={handleVoiceInput}
                variant={isListening ? 'danger' : 'outline'}
                size="md"
                ariaLabel={isListening ? 'Dinlemeyi durdur' : 'Sesli soru sor'}
                disabled={isLoading}
              >
                <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
              </Button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isListening ? '🎤 Dinleniyor...' : 'Sorunuzu yazın...'}
                disabled={isLoading || isListening}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                aria-label="Soru giriş alanı"
              />

              {/* Send Button */}
              <Button
                onClick={() => handleSendMessage()}
                variant="primary"
                size="md"
                disabled={!inputText.trim() || isLoading}
                ariaLabel="Gönder"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Send size={20} />
              </Button>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <p className="text-xs text-center text-purple-600 dark:text-purple-400 mt-2 animate-pulse">
                🎤 Dinleniyor... Sorunuzu sorun
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatbot

