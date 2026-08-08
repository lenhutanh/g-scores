import { useQuery } from '@tanstack/react-query'
import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'
import type { SubjectStats, TopCandidate } from '@/types/report'

export function useReportStatsQuery() {
  return useQuery<SubjectStats[]>({
    queryKey: ['report-stats'],
    queryFn: () => http.get<ApiResponse<SubjectStats[]>>('/api/reports/stats').then(res => res.data!),
    retry: false,
  })
}

export function useTopGroupAQuery() {
  return useQuery<TopCandidate[]>({
    queryKey: ['top-group-a'],
    queryFn: () => http.get<ApiResponse<TopCandidate[]>>('/api/reports/top-group-a').then(res => res.data!),
    retry: false,
  })
}

