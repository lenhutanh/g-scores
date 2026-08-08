export interface IReportRepository {
  getStats(): Promise<any>;
  getTopGroupA(): Promise<any>;
}
