'use client'

import { useState } from 'react'
import { Upload, Link as LinkIcon, FileText } from 'lucide-react'

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
  const [inputType, setInputType] = useState<'url' | 'pdf' | 'text'>('text')
  const [content, setContent] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
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
    <main className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Enhanced Header */}
      <div className="mb-16 text-center animate-slide-in">
        <h1 className="text-7xl font-black mb-6 text-gradient" style={{ letterSpacing: '-0.02em' }}>
          Code Content Generator
        </h1>
        <p className="text-gray-300 text-xl mb-6 max-w-3xl mx-auto" style={{ lineHeight: '1.8' }}>
          🤖 Professional AI-powered coding problem explanations with HuggingFace Transformers
        </p>
        
        {/* Feature Showcase */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="feature-icon has-tooltip relative">
            <LinkIcon className="w-full h-full text-red-400" />
            <span className="tooltip">URL Support</span>
          </div>
          <div className="feature-icon has-tooltip relative">
            <Upload className="w-full h-full text-red-400" />
            <span className="tooltip">PDF Upload</span>
          </div>
          <div className="feature-icon has-tooltip relative">
            <FileText className="w-full h-full text-red-400" />
            <span className="tooltip">Text Input</span>
          </div>
        </div>

        {/* Premium Badge */}
        <div className="inline-block badge">
          <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
          <span className="text-red-300 font-semibold">Powered by Microsoft Phi-2 AI Model</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="section-card mb-12 animate-fade-in">
        {/* Enhanced Tab System */}
        <div className="tab-container">
          <button
            type="button"
            onClick={() => setInputType('text')}
            className={`tab-button ${inputType === 'text' ? 'tab-active' : 'tab-inactive'}`}
          >
            <FileText className="inline w-5 h-5 mr-2" />
            <span className="font-semibold">Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => setInputType('url')}
            className={`tab-button ${inputType === 'url' ? 'tab-active' : 'tab-inactive'}`}
          >
            <LinkIcon className="inline w-5 h-5 mr-2" />
            <span className="font-semibold">URL</span>
          </button>
          <button
            type="button"
            onClick={() => setInputType('pdf')}
            className={`tab-button ${inputType === 'pdf' ? 'tab-active' : 'tab-inactive'}`}
          >
            <Upload className="inline w-5 h-5 mr-2" />
            <span className="font-semibold">PDF Upload</span>
          </button>
        </div>

        {/* Content Input Based on Type */}
        <div className="mb-8 mt-8">
          {inputType === 'text' && (
            <div className="animate-slide-in">
              <label className="block text-sm font-bold mb-3 text-gray-200 tracking-wide">Problem Description</label>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field font-mono text-sm"
                  rows={10}
                  placeholder="Paste your coding problem description here...\n\nExample: Given an array of integers, find two numbers that add up to a target value..."
                  required
                  style={{ resize: 'vertical', minHeight: '200px' }}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono bg-black/70 px-2 py-1 rounded">
                  {content.length} characters
                </div>
              </div>
            </div>
          )}

          {inputType === 'url' && (
            <div className="animate-slide-in">
              <label className="block text-sm font-bold mb-3 text-gray-200 tracking-wide">Problem URL</label>
              <div className="relative">
                <input
                  type="url"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field pr-12"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  required
                />
                {content && content.startsWith('http') && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Supports: LeetCode, HackerRank, CodeForces, Codeforces, GeeksforGeeks
              </p>
            </div>
          )}

          {inputType === 'pdf' && (
            <div className="animate-slide-in">
              <label className="block text-sm font-bold mb-3 text-gray-200 tracking-wide">Upload PDF</label>
              <div className="border-2 border-dashed border-red-900/50 rounded-xl p-12 text-center bg-black/40 hover:border-red-500/70 hover:bg-black/60 transition-all duration-300 group">
                <Upload className="w-16 h-16 mx-auto mb-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setPdfFile(file)
                      setContent(file.name)
                    }
                  }}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer block">
                  <span className="text-red-400 font-bold text-lg hover:text-red-300 transition-colors">Click to upload</span>
                  <span className="text-gray-400"> or drag and drop</span>
                  <p className="text-sm text-gray-500 mt-2">PDF files up to 10MB</p>
                </label>
                {pdfFile && (
                  <div className="mt-6 p-4 bg-green-900/20 border border-green-700/50 rounded-lg inline-block">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-green-400">{pdfFile.name}</p>
                        <p className="text-xs text-gray-400">{(pdfFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold mb-3 text-gray-200 tracking-wide">Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select-field"
            >
              <option value="python">🐍 Python</option>
              <option value="javascript">⚡ JavaScript</option>
              <option value="java">☕ Java</option>
              <option value="cpp">⚙️ C++</option>
              <option value="csharp">🎯 C#</option>
              <option value="go">🔷 Go</option>
              <option value="rust">🦀 Rust</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-3 text-gray-200 tracking-wide">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="select-field"
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content}
          className="btn-primary w-full text-white text-lg relative group"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="loading-spinner w-5 h-5 border-2"></div>
              <span>Generating AI Explanation...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
              Generate AI Explanation
            </span>
          )}
        </button>
      </form>

      {error && (
        <div className="section-card bg-red-950/30 border-red-700/60 mb-12 animate-slide-in">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-red-400 font-bold text-lg mb-1">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-fade-in">
          <div className="section-card">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-3xl font-bold text-gradient flex items-center gap-3">
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Problem Overview
              </h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">{result.overview}</p>
          </div>

          <div className="section-card">
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              Key Concepts
            </h2>
            <ul className="space-y-3">
              {result.concepts.map((concept: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300 text-lg">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="section-card">
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Naive Approach
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">{result.naive_approach.description}</p>
            <div className="code-block relative group">
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.naive_approach.code)}>
                <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
              <pre className="text-sm text-green-400 font-mono leading-relaxed">{result.naive_approach.code}</pre>
            </div>
            <div className="mt-6 flex gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-700/40 rounded-lg">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-400 font-semibold">Time: {result.naive_approach.time_complexity}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-900/20 border border-purple-700/40 rounded-lg">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
                <span className="text-purple-400 font-semibold">Space: {result.naive_approach.space_complexity}</span>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Optimal Approach
            </h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">{result.optimal_approach.description}</p>
            <div className="code-block relative group">
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result.optimal_approach.code)}>
                <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
              <pre className="text-sm text-green-400 font-mono leading-relaxed">{result.optimal_approach.code}</pre>
            </div>
            <div className="mt-6 flex gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-700/40 rounded-lg">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-green-400 font-semibold">Time: {result.optimal_approach.time_complexity}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-700/40 rounded-lg">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
                <span className="text-blue-400 font-semibold">Space: {result.optimal_approach.space_complexity}</span>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Worked Example
            </h2>
            <div className="bg-black/50 border border-red-900/30 rounded-xl p-6">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-loose">{result.worked_example}</pre>
            </div>
          </div>

          <div className="section-card">
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Complexity Analysis
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">{result.complexity_analysis}</p>
          </div>

          <div className="section-card">
            <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Common Pitfalls
            </h2>
            <div className="space-y-5">
              {result.pitfalls.map((item: any, idx: number) => (
                <div key={idx} className="bg-gradient-to-r from-red-950/30 to-orange-950/20 border-l-4 border-red-500 rounded-r-xl p-5 hover:from-red-950/40 hover:to-orange-950/30 transition-all duration-300">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-red-400 font-bold text-lg mb-2">{item.pitfall}</p>
                      <p className="text-gray-300 leading-relaxed">{item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.edge_cases && result.edge_cases.length > 0 && (
            <div className="section-card">
              <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
                <svg className="w-8 h-8 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Edge Cases
              </h2>
              <ul className="space-y-3">
                {result.edge_cases.map((edge: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300 text-lg">
                    <svg className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{edge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.related_problems && result.related_problems.length > 0 && (
            <div className="section-card">
              <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center gap-3">
                <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Related Problems
              </h2>
              <div className="grid gap-5">
                {result.related_problems.map((prob: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-700/50 rounded-xl p-5 hover:border-red-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 group">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-gray-200 font-bold text-lg group-hover:text-red-400 transition-colors">{prob.problem}</p>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap ${
                        prob.difficulty === 'easy' ? 'bg-green-900/40 text-green-300 border border-green-700/50' :
                        prob.difficulty === 'medium' ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50' :
                        'bg-red-900/40 text-red-300 border border-red-700/50'
                      }`}>
                        {prob.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-3 leading-relaxed">{prob.connection}</p>
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
