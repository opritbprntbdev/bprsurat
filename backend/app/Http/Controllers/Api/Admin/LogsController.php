<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;

class LogsController extends Controller
{
    public function tail(Request $request)
    {
        // pastikan hanya admin (role_id = 1)
        $user = $request->user();
        if (!$user || (int) $user->role_id !== 1) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $path = storage_path('logs/laravel.log');
        if (!File::exists($path)) {
            return response()->json(['lines' => [], 'message' => 'Log file not found']);
        }

        $linesToRead = (int) ($request->query('n', 200));
        $lines = [];
        $fp = fopen($path, 'r');
        if ($fp === false) {
            return response()->json(['lines' => [], 'message' => 'Unable to open log file']);
        }

        // read last N lines efficiently
        $buffer = '';
        $pos = -1;
        $lineCount = 0;
        fseek($fp, 0, SEEK_END);
        $fileSize = ftell($fp);

        while ($lineCount < $linesToRead && -$pos < $fileSize) {
            fseek($fp, $pos, SEEK_END);
            $char = fgetc($fp);
            if ($char === "\n") {
                $lineCount++;
                if ($buffer !== '') {
                    $lines[] = strrev($buffer);
                    $buffer = '';
                }
            } else {
                $buffer .= $char;
            }
            $pos--;
        }
        if ($buffer !== '') {
            $lines[] = strrev($buffer);
        }
        fclose($fp);

        $lines = array_reverse($lines);
        return response()->json(['lines' => $lines]);
    }
}