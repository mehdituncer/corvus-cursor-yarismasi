import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles, Volume2, VolumeX, Mic, MicOff } from 'lucide-react'
import Button from '../common/Button'
import geminiService from '../../services/geminiService'

// Hazır soru önerileri
const QUICK_QUESTIONS = [
  'Platform nasıl kullanılır?',
  'Nasıl dosya yüklerim?',
  'Görme engelliler için hangi özellikler var?',
  'Tema nasıl değiştirilir?',
  'Klavye ile nasıl gezinirim?',
  'AI özellikleri nelerdir?',
]

/**
 * Basit AI Chatbot
 * - Sadece yazılı sohbet
 * - Hazır soru önerileri
 * - Gemini AI cevaplar
 */
function SimpleChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 Merhaba! Erişilebilir Akademi asistanıyım. Size nasıl yardımcı olabilirim?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [playingIndex, setPlayingIndex] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Auto scroll
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
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (error) => {
        console.error('Mikrofon hatası:', error)
        setIsListening(false)
        if (error.error === 'not-allowed') {
          alert('Mikrofon izni gerekli. Lütfen tarayıcı ayarlarından mikrofon izni verin.')
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const handlePlayMessage = (index, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız sesli okuma özelliğini desteklemiyor.')
      return
    }

    // Zaten bu mesaj okunuyorsa durdur
    if (playingIndex === index) {
      window.speechSynthesis.cancel()
      setPlayingIndex(null)
      return
    }

    // Önceki konuşmayı durdur
    window.speechSynthesis.cancel()

    // Yeni konuşma başlat
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tr-TR'
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setPlayingIndex(index)
    utterance.onend = () => setPlayingIndex(null)
    utterance.onerror = () => setPlayingIndex(null)

    window.speechSynthesis.speak(utterance)
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Tarayıcınız sesli girişi desteklemiyor. Chrome veya Edge kullanın.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return

    // Kullanıcı mesajını ekle
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsLoading(true)

    try {
      // Gemini'den cevap al
      const response = await geminiService.simpleChat(text)
      
      // Bot cevabını ekle
      setMessages(prev => [...prev, { role: 'bot', text: response }])
    } catch (error) {
      console.error('Chat hatası:', error)
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: '⚠️ Üzgünüm, şu an cevap veremiyorum. Lütfen tekrar deneyin.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl flex items-center justify-center transition-all hover:scale-110"
          aria-label="Yardım chatbot'u aç"
        >
          <MessageCircle size={24} className="text-white" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-blue-200 dark:border-blue-700 flex flex-col overflow-hidden"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <div>
                <h3 className="font-bold">Yardım Asistanı</h3>
                <p className="text-xs opacity-90">Gemini AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none p-3'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className={`text-sm ${msg.role === 'bot' ? 'p-3 pb-2' : ''}`}>
                    {msg.text}
                  </p>
                  
                  {/* Bot mesajları için ses butonu */}
                  {msg.role === 'bot' && (
                    <div className="px-3 pb-2 flex items-center gap-2">
                      <button
                        onClick={() => handlePlayMessage(idx, msg.text)}
                        className={`text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1 ${
                          playingIndex === idx
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                        }`}
                        aria-label={playingIndex === idx ? 'Okumayı durdur' : 'Sesli oku'}
                      >
                        {playingIndex === idx ? (
                          <>
                            <VolumeX size={12} />
                            <span>Durdur</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} />
                            <span>▶ Dinle</span>
                          </>
                        )}
                      </button>
                      <span className="text-xs text-gray-400">Tarayıcı sesi</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm">
                  <Loader2 size={18} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                💡 Hızlı Sorular:
              </p>
              <div className="flex flex-wrap gap-1">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              {/* Mikrofon Butonu */}
              <button
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label={isListening ? 'Dinlemeyi durdur' : 'Sesli soru sor'}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(input)}
                placeholder={isListening ? '🎤 Dinleniyor...' : 'Sorunuzu yazın...'}
                disabled={isLoading || isListening}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />

              {/* Send Button */}
              <Button
                onClick={() => sendMessage(input)}
                variant="primary"
                size="sm"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={18} />
              </Button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <p className="text-xs text-center text-red-600 dark:text-red-400 mt-2 animate-pulse font-semibold">
                🎤 Dinleniyor... Sorunuzu söyleyin
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SimpleChatbot

