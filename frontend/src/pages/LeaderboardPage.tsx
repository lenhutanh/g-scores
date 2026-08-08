import { useTopGroupAQuery } from '@/queries/report.query'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function LeaderboardPage() {
  const { data: candidates, isLoading, isError, error } = useTopGroupAQuery()

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-80 bg-slate-100 rounded animate-pulse" />
        </div>
        <Card className="w-full bg-white shadow-sm border border-slate-200">
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 w-full bg-slate-100 rounded animate-pulse" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-slate-50 rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Leaderboard</h1>
        <Alert variant="destructive" className="w-fit">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Load Error</AlertTitle>
          <AlertDescription>
            {(error as any)?.message || 'Failed to load top candidates statistics.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Leaderboard</h1>
        <p className="text-slate-500">Top 10 candidates with the highest Group A (Mathematics, Physics, Chemistry) scores.</p>
      </div>

      <Card className="w-full bg-white shadow-sm border border-slate-200">
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Registration No.</TableHead>
                  <TableHead className="text-right">Math</TableHead>
                  <TableHead className="text-right">Physics</TableHead>
                  <TableHead className="text-right">Chemistry</TableHead>
                  <TableHead className="text-right font-bold text-slate-800">Total Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates && candidates.length > 0 ? (
                  candidates.map((candidate, index) => (
                    <TableRow key={candidate.registrationNo} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium align-middle text-slate-500">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-slate-900 align-middle">
                        {candidate.registrationNo}
                      </TableCell>
                      <TableCell className="text-right text-slate-600 align-middle">
                        {candidate.math.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600 align-middle">
                        {candidate.physics.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600 align-middle">
                        {candidate.chemistry.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-extrabold text-brand-blue text-base align-middle">
                        {candidate.totalScore.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No top candidates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
