<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeminjamanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'max:50'],
            'boardgame_id' => ['required', 'exists:boardgames,id'],
            'tanggal_pinjam' => ['required', 'date'],
            'jam_pinjam' => ['required', 'date_format:H:i:s'],
            'catatan' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama wajib diisi.',
            'nim.required' => 'NIM wajib diisi.',
            'boardgame_id.required' => 'Pilih boardgame yang akan dipinjam.',
            'boardgame_id.exists' => 'Boardgame tidak ditemukan.',
            'tanggal_pinjam.required' => 'Tanggal pinjam wajib diisi.',
            'jam_pinjam.required' => 'Jam pinjam wajib diisi.',
            'jam_pinjam.date_format' => 'Format jam pinjam tidak valid (HH:MM:SS).',
            'catatan.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}
