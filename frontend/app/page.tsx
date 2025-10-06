'use client'

import { useState } from 'react'

interface ExplanationOutput {
  overview: string
  concepts: string[]
  naive_approach: {
    description: string
    code: string
    time_complexity: string
    space_complexity: string
  }
  optimal_approach: {
    description: string
    code: string
    time_complexity: string
    space_complexity: string
  }
  worked_example: string
  complexity_analysis: string
  pitfalls: Array<{
    pitfall: string
    solution: string
  }>
  edge_cases: string[]
  test_cases: string[]
  related_problems: Array<{
    problem: string
    difficulty: string
    connection: string
  }>
}

export default function Home() {
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('python')
  const [difficulty, setDifficulty] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExplanationOutput | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_type: 'problem',
          content,
          language,
          difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate explanation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Code Content Generator
        </h1>
        <p className="text-gray-400">AI-powered coding problem explanations with HuggingFace</p>
      </div>

      <form onSubmit={handleSubmit} className="section-card mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Problem Description</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={6}
            placeholder="Enter your coding problem or question..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-100"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-100"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Explanation'}
        </button>
      </form>

      {error && (
        <div className="section-card bg-red-900/20 border-red-700 mb-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Problem Overview</h2>
            <p className="text-gray-300">{result.overview}</p>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Key Concepts</h2>
            <ul className="list-disc list-inside space-y-2">
              {result.concepts.map((concept, idx) => (
                <li key={idx} className="text-gray-300">{concept}</li>
              ))}
            </ul>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Naive Approach</h2>
            <p className="text-gray-300 mb-4">{result.naive_approach.description}</p>
            <div className="code-block">
              <pre className="text-sm text-green-400">{result.naive_approach.code}</pre>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-yellow-400">Time: {result.naive_approach.time_complexity}</span>
              <span className="text-yellow-400">Space: {result.naive_approach.space_complexity}</span>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Optimal Approach</h2>
            <p className="text-gray-300 mb-4">{result.optimal_approach.description}</p>
            <div className="code-block">
              <pre className="text-sm text-green-400">{result.optimal_approach.code}</pre>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="text-yellow-400">Time: {result.optimal_approach.time_complexity}</span>
              <span className="text-yellow-400">Space: {result.optimal_approach.space_complexity}</span>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Worked Example</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{result.worked_example}</p>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Complexity Analysis</h2>
            <p className="text-gray-300">{result.complexity_analysis}</p>
          </div>

          <div className="section-card">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Common Pitfalls</h2>
            <div className="space-y-4">
              {result.pitfalls.map((item, idx) => (
                <div key={idx} className="border-l-4 border-red-500 pl-4">
                  <p className="text-red-400 font-semibold">{item.pitfall}</p>
                  <p className="text-gray-300 mt-1">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>

          {result.edge_cases && result.edge_cases.length > 0 && (
            <div className="section-card">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Edge Cases</h2>
              <ul className="list-disc list-inside space-y-2">
                {result.edge_cases.map((edge, idx) => (
                  <li key={idx} className="text-gray-300">{edge}</li>
                ))}
              </ul>
            </div>
          )}

          {result.related_problems && result.related_problems.length > 0 && (
            <div className="section-card">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Related Problems</h2>
              <div className="space-y-3">
                {result.related_problems.map((prob, idx) => (
                  <div key={idx} className="border border-gray-700 rounded p-3">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-200 font-semibold">{prob.problem}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        prob.difficulty === 'easy' ? 'bg-green-900 text-green-300' :
                        prob.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{prob.connection}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
