<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReservationController extends Controller
{
    public function index()
    {
        return Reservation::with(['client', 'room'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'clientId'       => 'required|exists:clients,id',
            'roomId'         => 'required|exists:rooms,id',
            'checkInDate'    => 'required|date',
            'checkOutDate'   => 'required|date|after:checkInDate',
            'status'         => 'required|string',
            'totalAmount'    => 'required|numeric',
            'paymentStatus'  => 'required|string',
        ]);

        $reservation = Reservation::create([
            'client_id'      => $validated['clientId'],
            'room_id'        => $validated['roomId'],
            'check_in_date'  => $validated['checkInDate'],
            'check_out_date' => $validated['checkOutDate'],
            'status'         => $validated['status'],
            'total_amount'   => $validated['totalAmount'],
            'payment_status' => $validated['paymentStatus'],
        ]);

        return response()->json($reservation, 201);
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);

        if (in_array($reservation->status, ['Annulée', 'Terminée'])) {
            return response()->json(['message' => 'Réservation verrouillée.'], 403);
        }

        $validated = $request->validate([
            'status'         => 'nullable|string',
            'payment_status' => 'nullable|string',
        ]);

        if (
            (isset($validated['status']) && $validated['status'] === 'Terminée') ||
            (isset($validated['payment_status']) && $validated['payment_status'] !== 'En attente')
        ) {
            if (empty($reservation->payment_method) || $reservation->payment_method === 'Non défini') {
                return response()->json(['message' => 'Veuillez définir une méthode de paiement d\'abord.'], 403);
            }
        }

        if (isset($validated['status'])) {
            $reservation->status = $validated['status'];

            if ($validated['status'] === 'Terminée') {
                $reservation->payment_status = 'Payé';
            }
        }

        if (isset($validated['payment_status'])) {
            $reservation->payment_status = $validated['payment_status'];
        }

        $reservation->save();

        return response()->json($reservation->load(['client', 'room']));
    }

    public function updatePaymentMethod(Request $request, $id)
    {
        

        $reservation = Reservation::findOrFail($id);

        if (in_array($reservation->status, ['Annulée', 'Terminée'])) {
            return response()->json(['message' => 'Impossible de modifier la méthode après la fin ou l\'annulation.'], 403);
        }

        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);
        
        $reservation->payment_method = $validated['payment_method'];
        $reservation->updated_at = now();
        $reservation->save();

        return response()->json($reservation);
    }

    public function downloadInvoice($id)
    {
        $reservation = Reservation::with(['client', 'room'])->findOrFail($id);

        $pdf = Pdf::loadView('pdf.invoice', ['reservation' => $reservation]);

        return $pdf->download("facture_reservation_{$id}.pdf");
    }
}
