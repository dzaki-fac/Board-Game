<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermohonanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'boardgame_id' => ['required', 'exists:board_games,id'],
            'tanggal_pinjam' => ['required', 'date'],
            'jam_pinjam' => ['required', 'date_format:H:i:s'],
            'catatan' => ['nullable', 'string', 'max:500'],
            'peminjams' => ['required', 'array', 'min:1'],
            'peminjams.*.nama' => ['required', 'string', 'max:255'],
            'peminjams.*.jenis_jaminan' => ['required', 'string', 'in:ktp,ktm'],
            'peminjams.*.nomor_identitas' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    preg_match('/peminjams\.(\d+)\.nomor_identitas/', $attribute, $matches);
                    if (!empty($matches)) {
                        $index = $matches[1];
                        $jenisJaminan = $this->input("peminjams.{$index}.jenis_jaminan");
                        if ($jenisJaminan === 'ktm' && strlen($value) !== 14) {
                            $fail('NIM harus 14 digit.');
                        } elseif ($jenisJaminan === 'ktp' && strlen($value) !== 16) {
                            $fail('NIK harus 16 digit.');
                        }
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'boardgame_id.required' => 'Pilih boardgame yang akan dipinjam.',
            'boardgame_id.exists' => 'Board game tidak ditemukan.',
            'tanggal_pinjam.required' => 'Tanggal pinjam wajib diisi.',
            'jam_pinjam.required' => 'Jam pinjam wajib diisi.',
            'jam_pinjam.date_format' => 'Format jam pinjam tidak valid (HH:MM:SS).',
            'catatan.max' => 'Catatan maksimal 500 karakter.',
            'peminjams.required' => 'Minimal harus ada satu peminjam.',
            'peminjams.min' => 'Minimal harus ada satu peminjam.',
            'peminjams.*.nama.required' => 'Nama peminjam wajib diisi.',
            'peminjams.*.jenis_jaminan.required' => 'Jenis jaminan wajib dipilih.',
            'peminjams.*.jenis_jaminan.in' => 'Jenis jaminan harus KTM atau KTP.',
            'peminjams.*.nomor_identitas.required' => 'Nomor identitas wajib diisi.',
        ];
    }
}
