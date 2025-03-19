<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable = [
        'user_name', 'action', 'model', 'old_values', 'new_values', 'created_at','updated_at'
    ];
}
