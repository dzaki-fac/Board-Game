<?php

namespace App\Http\Controllers;

use App\Models\Rule;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function rules()
    {
        return Inertia::render('Rules/Index', [
            'rules' => Rule::orderBy('sort_order')->get(),
        ]);
    }

    public function updateRule(Rule $rule)
    {
        request()->validate([
            'title' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*' => 'required|string|max:1000',
        ]);

        $rule->update([
            'title' => request('title'),
            'items' => request('items'),
        ]);

        return back()->with('success', 'Aturan berhasil diperbarui.');
    }
}