<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTracking extends Model
{
    protected $table = 'surat_tracking';

    // tabel menggunakan kolom 'waktu' sebagai timestamp — kita tidak mengandalkan created_at otomatis
    public $timestamps = false;

    protected $fillable = [
        'surat_id',
        'dari_user_id',
        'ke_user_id',
        'status',
        'catatan',
        'waktu'
    ];

    protected $dates = [
        'waktu'
    ];

    public function surat()
    {
        return $this->belongsTo(Letter::class, 'surat_id');
    }
}