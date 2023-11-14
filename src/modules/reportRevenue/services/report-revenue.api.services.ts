import service from '@/plugins/axios';
import { BaseService } from '@/utils/api';

class ReportRevenueApiService extends BaseService {}

export const reportRevenueService = new ReportRevenueApiService(
    { baseUrl: '/report-revenue' },
    service,
);
