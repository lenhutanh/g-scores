import { useState, useEffect } from 'react'
import { useScoreQuery } from '@/queries/candidate.query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function SearchPage() {
  const [registrationNo, setRegistrationNo] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { data: candidate, isLoading, isError, error } = useScoreQuery(searchQuery)

  useEffect(() => {
    if (isError && error) {
      setErrorMsg((error as any)?.message || 'Candidate not found or server error')
    } else {
      setErrorMsg(null)
    }
  }, [isError, error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanNo = registrationNo.trim()

    setSearchQuery('')
    setErrorMsg(null)

    if (cleanNo.length === 8) {
      setSearchQuery(cleanNo)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">National High School Graduation Exam Scores 2024</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-row items-start gap-4 flex-wrap">
        <label htmlFor="regNo" className="text-base font-medium text-slate-700 whitespace-nowrap pt-1.5">
          Registration Number
        </label>
        <div className="flex flex-col gap-1.5 w-64">
          <Input
            id="regNo"
            type="text"
            maxLength={8}
            value={registrationNo}
            onChange={(e) => {
              const cleanVal = e.target.value.replace(/\D/g, '')
              setRegistrationNo(cleanVal)
              if (errorMsg) setErrorMsg(null)
            }}
            placeholder="Enter registration number"
            className="h-9 w-full border-slate-300 focus-visible:border-brand-blue focus-visible:ring-brand-blue/30"
          />
        </div>
        <Button
          type="submit"
          disabled={registrationNo.length !== 8 || isLoading}
          className="bg-brand-yellow hover:bg-brand-yellow/90 disabled:opacity-50 text-slate-900 font-semibold h-9 px-6 active:scale-95 transition-all shadow-sm"
        >
          {isLoading ? 'Searching...' : 'Submit'}
        </Button>
      </form>

      {errorMsg && (
        <Alert variant="destructive" className="w-fit animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Search Failed</AlertTitle>
          <AlertDescription>
            {errorMsg}
          </AlertDescription>
        </Alert>
      )}

      {(candidate) && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">
            Detailed Scores
          </h2>

          {candidate && (
            <div className="flex flex-wrap gap-3">
              {candidate.scores && candidate.scores.length > 0 ? (
                candidate.scores.map((s) => (
                  <div
                    key={s.subjectId}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600"
                  >
                    {s.subjectName}: <span className="font-bold text-brand-blue text-base ml-1">{s.score}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No scores found for this candidate.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
