<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Reservation;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        try {
            $availableRooms = Room::where('status', 'AVAILABLE')->count();
            $totalRooms = Room::count();

            $occupancyRate = $totalRooms > 0
                ? round((($totalRooms - $availableRooms) / $totalRooms) * 100)
                : 0;

            $todayCheckIns = Reservation::whereDate('check_in_date', now()->toDateString())->count();
            $totalRevenue = Reservation::sum('total_amount');

            $revenueStats = Reservation::selectRaw('DATE_FORMAT(check_in_date, "%b") as month, SUM(total_amount) as revenue')
                ->whereDate('check_in_date', '>=', now()->subMonths(6))
                ->groupByRaw('DATE_FORMAT(check_in_date, "%b"), MONTH(check_in_date)')
                ->orderByRaw('MIN(check_in_date)')
                ->get();

            $occupancyStats = Reservation::selectRaw('DATE_FORMAT(check_in_date, "%b") as month, COUNT(*) as count')
                ->whereDate('check_in_date', '>=', now()->subMonths(6))
                ->groupByRaw('DATE_FORMAT(check_in_date, "%b"), MONTH(check_in_date)')
                ->orderByRaw('MIN(check_in_date)')
                ->get()
                ->map(function ($row) use ($totalRooms) {
                    $maxOccupancy = $totalRooms * 30;
                    return [
                        'month' => $row->month,
                        'rate' => $maxOccupancy > 0 ? round(($row->count / $maxOccupancy) * 100) : 0,
                    ];
                });

            $latestReservations = Reservation::with('client', 'room')
                ->latest('created_at')
                ->take(5)
                ->get();


            return response()->json([
                'availableRooms' => $availableRooms,
                'totalRooms' => $totalRooms,
                'occupancyRate' => $occupancyRate,
                'todayCheckIns' => $todayCheckIns,
                'totalRevenue' => $totalRevenue,
                'revenueStats' => $revenueStats,
                'occupancyStats' => $occupancyStats,
                'latestReservations' => $latestReservations,
            ]);

        } catch (\Throwable $e) {
            \Log::error($e);
            return response()->json(['error' => 'Erreur interne'], 500);
        }
    }
}
