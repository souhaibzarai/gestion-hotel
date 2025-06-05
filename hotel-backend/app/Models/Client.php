<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    
    protected $fillable = ['firstName','lastName','email','phone','document','documentType','registrationDate',];
    public $timestamps = true;

}
