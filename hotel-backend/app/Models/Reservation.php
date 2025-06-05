<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Reservation extends Model
{
    protected $fillable = [
        'client_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'status',
        'total_amount',
        'payment_status',
        'payment_method',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

}
