import { useState, useEffect } from 'react'
import { useReportStatsQuery } from '@/queries/report.query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const chartConfig = {
  excellent: {
    label: '>= 8',
    color: '#10b981',
  },
  good: {
    label: '6 to < 8',
    color: '#3b82f6',
  },
  average: {
    label: '4 to < 6',
    color: '#f59e0b',
  },
  poor: {
    label: '< 4',
    color: '#ef4444',
  },
} satisfies ChartConfig

export default function ReportsPage() {
  const { data: stats, isLoading, isError, error } = useReportStatsQuery()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')

  useEffect(() => {
    if (stats && stats.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(stats[0].subjectId)
    }
  }, [stats, selectedSubjectId])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-80 bg-slate-100 rounded animate-pulse" />
        </div>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-4">
            <div className="h-8 w-[180px] bg-slate-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full bg-slate-50 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Score Statistics</h1>
        <Alert variant="destructive" className="w-fit">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Data Load Error</AlertTitle>
          <AlertDescription>
            {(error as any)?.message || 'Failed to load score statistics.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const selectedSubject = stats?.find((s) => s.subjectId === selectedSubjectId)

  const chartData = selectedSubject
    ? [
      { level: '< 4', count: selectedSubject.lt4, fill: 'var(--color-poor)' },
      { level: '4 to < 6', count: selectedSubject.g4to6, fill: 'var(--color-average)' },
      { level: '6 to < 8', count: selectedSubject.g6to8, fill: 'var(--color-good)' },
      { level: '>= 8', count: selectedSubject.gte8, fill: 'var(--color-excellent)' },
    ]
    : []

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Score Statistics</h1>
        <p className="text-slate-500">Detailed distribution of high school graduation exam scores by subject.</p>
      </div>

      <Card className="w-full bg-white shadow-sm border border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-4">
          <div>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a subject">
                  {stats?.find((s) => s.subjectId === selectedSubjectId)?.subjectName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start" className="w-[180px]" alignItemWithTrigger={false}>
                {stats?.map((s) => (
                  <SelectItem key={s.subjectId} value={s.subjectId}>
                    {s.subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[350px] w-full [&_*]:outline-none">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 15,
                  bottom: 10,
                }}
              >
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="level"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  className="text-xs text-slate-500 font-medium"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-slate-500 font-medium"
                  allowDecimals={false}
                  width={60}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <ChartTooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" radius={6} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-slate-500 text-sm">
              No statistical data available for this subject.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
