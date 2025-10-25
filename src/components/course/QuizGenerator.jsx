import { useState } from 'react'
import { Loader2, HelpCircle, CheckCircle, XCircle, Trophy } from 'lucide-react'
import Button from '../common/Button'
import geminiService from '../../services/geminiService'

/**
 * Quiz üretici bileşen
 * - Gemini AI ile otomatik soru oluşturur
 * - Çoktan seçmeli sorular
 * - Anında geri bildirim
 */
function QuizGenerator({ content }) {
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userAnswers, setUserAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleGenerateQuiz = async () => {
    setIsLoading(true)
    setError(null)
    setQuestions([])
    setUserAnswers({})
    setShowResults(false)
    
    try {
      const result = await geminiService.generateQuestions(content, 5)
      setQuestions(result)
    } catch (err) {
      setError('Sorular oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
      console.error('Quiz generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (showResults) return // Sonuçlar gösterildiyse seçime izin verme
    
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex
    })
  }

  const handleSubmitQuiz = () => {
    let correctCount = 0
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct) {
        correctCount++
      }
    })
    
    setScore(correctCount)
    setShowResults(true)
    
    // Sonucu duyur (ekran okuyucular için)
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = `Test tamamlandı. ${questions.length} sorudan ${correctCount} tanesini doğru cevapladınız.`
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 3000)
  }

  const handleResetQuiz = () => {
    setUserAnswers({})
    setShowResults(false)
    setScore(0)
  }

  return (
    <div className="space-y-6">
      {/* Kontroller */}
      {!questions.length && (
        <div className="text-center">
          <Button
            onClick={handleGenerateQuiz}
            variant="primary"
            size="lg"
            disabled={isLoading}
            ariaLabel="Quiz oluştur"
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span className="ml-2">Sorular Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <HelpCircle size={24} />
                <span className="ml-2">Quiz Oluştur</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div 
          className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Sorular */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {/* İlerleme */}
          {!showResults && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">
                  Cevaplanan: {Object.keys(userAnswers).length} / {questions.length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Tamamlanma: %{Math.round((Object.keys(userAnswers).length / questions.length) * 100)}
                </span>
              </div>
            </div>
          )}

          {/* Soru Listesi */}
          <div className="space-y-4">
            {questions.map((question, questionIndex) => {
              const userAnswer = userAnswers[questionIndex]
              const isCorrect = userAnswer === question.correct
              const isAnswered = userAnswer !== undefined

              return (
                <div
                  key={questionIndex}
                  className={`
                    bg-white dark:bg-gray-800 p-6 rounded-lg border-2 transition-colors
                    ${showResults 
                      ? isCorrect 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                        : isAnswered 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      : 'border-gray-200 dark:border-gray-700'
                    }
                  `}
                  role="group"
                  aria-labelledby={`question-${questionIndex}`}
                >
                  {/* Soru Başlığı */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                      {questionIndex + 1}
                    </div>
                    <h3 
                      id={`question-${questionIndex}`}
                      className="flex-1 text-lg font-semibold"
                    >
                      {question.question}
                    </h3>
                    {showResults && (
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                        ) : isAnswered ? (
                          <XCircle size={24} className="text-red-600 dark:text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Seçenekler */}
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswer === optionIndex
                      const isCorrectOption = question.correct === optionIndex
                      
                      return (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                          disabled={showResults}
                          className={`
                            w-full text-left p-4 rounded-lg border-2 transition-all
                            ${showResults
                              ? isCorrectOption
                                ? 'border-green-500 bg-green-100 dark:bg-green-900/30'
                                : isSelected
                                  ? 'border-red-500 bg-red-100 dark:bg-red-900/30'
                                  : 'border-gray-200 dark:border-gray-700 opacity-50'
                              : isSelected
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                            }
                            ${!showResults && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500'}
                          `}
                          aria-pressed={isSelected}
                          aria-describedby={showResults ? `explanation-${questionIndex}-${optionIndex}` : undefined}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                              ${showResults && isCorrectOption ? 'border-green-500' : ''}
                              ${showResults && isSelected && !isCorrectOption ? 'border-red-500' : ''}
                            `}>
                              {isSelected && (
                                <div className={`w-3 h-3 rounded-full ${
                                  showResults
                                    ? isCorrectOption
                                      ? 'bg-green-500'
                                      : 'bg-red-500'
                                    : 'bg-primary-500'
                                }`} />
                              )}
                            </div>
                            <span>{option}</span>
                            {showResults && isCorrectOption && (
                              <CheckCircle size={20} className="ml-auto text-green-600 dark:text-green-400" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap gap-3 justify-center">
            {!showResults ? (
              <Button
                onClick={handleSubmitQuiz}
                variant="primary"
                size="lg"
                disabled={Object.keys(userAnswers).length !== questions.length}
                ariaLabel="Testi tamamla"
              >
                Testi Tamamla
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleResetQuiz}
                  variant="outline"
                  size="lg"
                  ariaLabel="Testi tekrar çöz"
                >
                  Tekrar Çöz
                </Button>
                <Button
                  onClick={handleGenerateQuiz}
                  variant="primary"
                  size="lg"
                  ariaLabel="Yeni sorular oluştur"
                >
                  Yeni Sorular
                </Button>
              </>
            )}
          </div>

          {/* Sonuç */}
          {showResults && (
            <div 
              className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-8 rounded-lg text-center"
              role="status"
              aria-live="polite"
            >
              <Trophy size={64} className="mx-auto mb-4 text-primary-600 dark:text-primary-400" />
              <h3 className="text-3xl font-bold mb-2">Test Tamamlandı!</h3>
              <p className="text-xl mb-4">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {score}
                </span>
                {' / '}
                <span className="text-2xl">{questions.length}</span>
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Başarı Oranı: <strong>{Math.round((score / questions.length) * 100)}%</strong>
              </p>
              {score === questions.length && (
                <p className="mt-4 text-green-600 dark:text-green-400 font-semibold">
                  🎉 Mükemmel! Tüm soruları doğru cevapladınız!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bilgilendirme */}
      {!questions.length && !error && !isLoading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Nasıl çalışır?</strong> Google Gemini AI, ders içeriğini analiz ederek otomatik olarak 
            çoktan seçmeli sorular oluşturur. Sorular ders konusunu pekiştirmenize ve öğrendiklerinizi 
            test etmenize yardımcı olur.
          </p>
        </div>
      )}
    </div>
  )
}

export default QuizGenerator

