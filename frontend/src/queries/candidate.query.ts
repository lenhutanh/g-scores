import { useQuery } from '@tanstack/react-query'
import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'
import type { CandidateScoreData } from '@/types/candidate'

export function useScoreQuery(registrationNo: string) {
  return useQuery<CandidateScoreData>({
    queryKey: ['candidate', registrationNo],
    queryFn: () => http.get<ApiResponse<CandidateScoreData>>(`/api/candidates/${registrationNo}`).then(res => res.data!),
    enabled: registrationNo.length === 8,
    retry: false,
  })
}
