<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Letter;
use App\Models\SuratTracking;
use Illuminate\Support\Facades\Auth;

class LettersController extends Controller
{
    public function index(Request $request)
    {
        $query = Letter::query();

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($qr) use ($q) {
                $qr->where('judul', 'like', "%{$q}%")
                    ->orWhere('no_surat', 'like', "%{$q}%");
            });
        }

        $letters = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json($letters);
    }

    public function show($id)
    {
        $letter = Letter::with('trackings')->findOrFail($id);
        return response()->json($letter);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'judul' => 'required|string',
            'isi' => 'nullable|string',
            'tipe' => 'required|in:masuk,keluar',
            'no_surat' => 'nullable|string',
            'tujuan_user_id' => 'nullable|integer',
        ]);

        $data['asal_user_id'] = Auth::id();

        $letter = Letter::create($data);

        SuratTracking::create([
            'surat_id' => $letter->id,
            'dari_user_id' => Auth::id(),
            'ke_user_id' => $data['tujuan_user_id'] ?? null,
            'status' => 'dikirim',
            'catatan' => 'Dibuat dan dikirim',
            'waktu' => now()
        ]);

        return response()->json($letter, 201);
    }

    public function update(Request $request, $id)
    {
        $letter = Letter::findOrFail($id);

        $data = $request->only(['judul', 'isi', 'no_surat', 'tipe', 'status', 'tujuan_user_id']);
        $letter->update($data);

        return response()->json($letter);
    }

    public function sendToSekper(Request $request, $id)
    {
        $letter = Letter::findOrFail($id);

        $letter->status = 'dikirim';
        $letter->tujuan_user_id = $request->input('tujuan_user_id');
        $letter->save();

        SuratTracking::create([
            'surat_id' => $letter->id,
            'dari_user_id' => Auth::id(),
            'ke_user_id' => $letter->tujuan_user_id,
            'status' => 'dikirim',
            'catatan' => $request->input('catatan', 'Dikirim ke Sekper'),
            'waktu' => now()
        ]);

        return response()->json(['message' => 'Surat dikirim', 'letter' => $letter]);
    }
}