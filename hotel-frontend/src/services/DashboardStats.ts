

export type DashboardStats = {
  availableRooms: number;
  totalRooms: number;
  occupancyRate: number;
  todayCheckIns: number;
  totalRevenue: string;
  revenueStats: { month: string; revenue: string; }[];
  occupancyStats: { month: string; rate: number; }[];
  latestReservations: {
    id: number;
    check_in_date: string;
    check_out_date: string;
    total_amount: string;
    status: string;
    client: { firstName: string; lastName: string; };
    room: { number: string; };
  }[];
};
