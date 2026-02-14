import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const sampleQuestions = [
  "What's my favorite food?",
  "Where would I love to travel?",
  "What's my most embarrassing moment?",
  "What's my favorite movie?",
  "What's my dream date?",
  "What makes me laugh the most?",
  "What's my biggest fear?",
  "What song reminds me of us?",
];

export default function Quiz() {
  const { state, updateNested } = useApp();
  const quiz = state.quiz;
  const [mode, setMode] = useState(quiz.questions.length > 0 && !quiz.completed ? 'play' : 'setup');
  const [currentQ, setCurrentQ] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [showResult, setShowResult] = useState(null);
  const [score, setScore] = useState(0);
  const [formQ, setFormQ] = useState('');
  const [formA, setFormA] = useState('');

  const addQuestion = () => {
    if (!formQ.trim() || !formA.trim()) return;
    const newQuestions = [...quiz.questions, { q: formQ.trim(), a: formA.trim(), id: Date.now() }];
    updateNested('quiz', { questions: newQuestions });
    setFormQ('');
    setFormA('');
  };

  const removeQuestion = (id) => {
    updateNested('quiz', { questions: quiz.questions.filter((q) => q.id !== id) });
  };

  const startQuiz = () => {
    if (quiz.questions.length === 0) return;
    setMode('play');
    setCurrentQ(0);
    setScore(0);
    setShowResult(null);
    updateNested('quiz', { completed: false, score: 0, answers: {} });
  };

  const submitAnswer = () => {
    if (!playerAnswer.trim()) return;
    const correct = quiz.questions[currentQ].a;
    const isClose = playerAnswer.toLowerCase().trim().includes(correct.toLowerCase().trim()) ||
      correct.toLowerCase().trim().includes(playerAnswer.toLowerCase().trim());

    setShowResult(isClose ? 'correct' : 'wrong');
    const newAnswers = { ...quiz.answers, [currentQ]: playerAnswer };
    const newScore = isClose ? score + 1 : score;
    setScore(newScore);
    updateNested('quiz', { answers: newAnswers, score: newScore });

    setTimeout(() => {
      setShowResult(null);
      setPlayerAnswer('');
      if (currentQ + 1 < quiz.questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setMode('results');
        updateNested('quiz', { completed: true, score: newScore });
      }
    }, 1500);
  };

  const resetQuiz = () => {
    updateNested('quiz', { completed: false, score: 0, answers: {} });
    setMode('setup');
    setCurrentQ(0);
    setScore(0);
  };

  return (
    <section className="min-h-[80vh] px-4 py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
          How Well Do You Know Me? 🎯
        </h2>
        <p className="text-gold font-[family-name:var(--font-script)] text-xl mt-2">
          The ultimate couple quiz
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Add questions */}
            <div className="bg-white dark:bg-night-surface rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="font-bold text-burgundy dark:text-blush mb-4 font-[family-name:var(--font-heading)]">
                Set Up Questions
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter a question..."
                  value={formQ}
                  onChange={(e) => setFormQ(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text"
                />
                <input
                  type="text"
                  placeholder="The correct answer..."
                  value={formA}
                  onChange={(e) => setFormA(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text"
                />
                <button
                  onClick={addQuestion}
                  disabled={!formQ.trim() || !formA.trim()}
                  className="w-full bg-rose-deep text-white px-4 py-2 rounded-full hover:bg-burgundy disabled:opacity-50"
                >
                  Add Question
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Quick add suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQuestions.filter((s) => !quiz.questions.some((q) => q.q === s)).slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormQ(s)}
                      className="text-xs px-3 py-1 rounded-full bg-blush/20 text-rose-deep hover:bg-blush/40 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question list */}
            {quiz.questions.length > 0 && (
              <div className="space-y-2 mb-6">
                {quiz.questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white dark:bg-night-surface rounded-xl p-4 shadow flex justify-between items-start group"
                  >
                    <div>
                      <p className="font-medium text-burgundy dark:text-blush text-sm">
                        {i + 1}. {q.q}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Answer: {q.a}</p>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-gray-300 hover:text-rose-deep text-sm ml-2"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {quiz.questions.length >= 3 && (
              <button
                onClick={startQuiz}
                className="w-full bg-rose-deep text-white px-6 py-3 rounded-full text-lg hover:bg-burgundy transition-colors"
              >
                Start Quiz! 🎯
              </button>
            )}
            {quiz.questions.length > 0 && quiz.questions.length < 3 && (
              <p className="text-center text-sm text-gray-400">Add at least 3 questions to start</p>
            )}
          </motion.div>
        )}

        {mode === 'play' && (
          <motion.div key="play" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 dark:text-night-text/60 mb-2">
                <span>Question {currentQ + 1} of {quiz.questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="h-2 bg-blush/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-rose-deep rounded-full"
                  animate={{ width: `${((currentQ) / quiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-night-surface rounded-2xl p-6 md:p-8 shadow-lg text-center relative overflow-hidden">
              {/* Result overlay */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 flex flex-col items-center justify-center z-10 ${
                      showResult === 'correct' ? 'bg-green-50/95' : 'bg-red-50/95'
                    }`}
                  >
                    <span className="text-6xl mb-3">
                      {showResult === 'correct' ? '🎉' : '😅'}
                    </span>
                    <p className={`text-xl font-bold ${showResult === 'correct' ? 'text-green-600' : 'text-rose-deep'}`}>
                      {showResult === 'correct' ? 'You know me so well!' : 'Not quite!'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {showResult === 'wrong' && `The answer was: ${quiz.questions[currentQ].a}`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="text-4xl mb-4 block">🤔</span>
              <h3 className="text-xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-6">
                {quiz.questions[currentQ].q}
              </h3>
              <input
                type="text"
                value={playerAnswer}
                onChange={(e) => setPlayerAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                placeholder="Your answer..."
                className="w-full px-4 py-3 rounded-xl border-2 border-blush focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text text-center text-lg"
                autoFocus
              />
              <button
                onClick={submitAnswer}
                disabled={!playerAnswer.trim()}
                className="mt-4 bg-rose-deep text-white px-8 py-3 rounded-full hover:bg-burgundy disabled:opacity-50 transition-colors"
              >
                Submit Answer
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white dark:bg-night-surface rounded-2xl p-8 shadow-lg text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: 3, duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {score >= quiz.questions.length * 0.8 ? '🏆' : score >= quiz.questions.length * 0.5 ? '💕' : '💪'}
              </motion.div>
              <h3 className="text-2xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-2">
                Quiz Complete!
              </h3>
              <p className="text-4xl font-bold text-rose-deep mb-2">
                {score} / {quiz.questions.length}
              </p>
              <p className="text-gray-500 dark:text-night-text/60 mb-6">
                {score >= quiz.questions.length * 0.8
                  ? `Wow! You really know ${state.partner1}! 🎉`
                  : score >= quiz.questions.length * 0.5
                  ? "Not bad! There's always more to learn about each other 💕"
                  : `Time to pay more attention to ${state.partner1}! 😄`}
              </p>

              {/* Answers review */}
              <div className="text-left space-y-3 mb-6">
                {quiz.questions.map((q, i) => (
                  <div key={q.id} className="p-3 rounded-lg bg-cream dark:bg-night-bg/50">
                    <p className="text-sm font-medium text-burgundy dark:text-blush">{q.q}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Your answer: {quiz.answers[i] || '—'}</p>
                    <p className="text-xs text-gold">Correct: {q.a}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetQuiz}
                  className="flex-1 px-4 py-2 rounded-full border border-blush text-rose-deep hover:bg-blush/10"
                >
                  Edit Questions
                </button>
                <button
                  onClick={startQuiz}
                  className="flex-1 bg-rose-deep text-white px-4 py-2 rounded-full hover:bg-burgundy"
                >
                  Play Again 🎯
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
