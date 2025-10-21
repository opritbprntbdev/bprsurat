<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    protected $table = 'surat';

    protected $fillable = [
        'no_surat',
        'judul',
        'isi',
        'tipe',
        'status',
        'asal_user_id',
        'tujuan_user_id',
        'lampiran_path',
        'tte_status',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'asal_user_id');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'tujuan_user_id');
    }

    public function trackings()
    {
        return $this->hasMany(SuratTracking::class, 'surat_id');
    }
}