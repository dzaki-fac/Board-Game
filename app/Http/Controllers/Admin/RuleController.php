<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RuleController extends Controller
{
    public function index()
    {
        $rules = Rule::with('items')->orderBy('sort_order')->get();
        return Inertia::render('Rules/Index', [
            'rules' => $rules,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'section_title' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*' => 'required|string|max:65535',
        ]);

        $maxSort = Rule::max('sort_order') ?? 0;

        $rule = Rule::create([
            'section_title' => $validated['section_title'],
            'sort_order' => $maxSort + 1,
        ]);

        foreach ($validated['items'] as $i => $content) {
            $rule->items()->create([
                'content' => $content,
                'sort_order' => $i,
            ]);
        }

        return redirect()->back()->with('flash', 'Peraturan berhasil ditambahkan.');
    }

    public function update(Request $request, Rule $rule)
    {
        $validated = $request->validate([
            'section_title' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*' => 'required|string|max:65535',
        ]);

        $rule->update(['section_title' => $validated['section_title']]);
        $rule->items()->delete();

        foreach ($validated['items'] as $i => $content) {
            $rule->items()->create([
                'content' => $content,
                'sort_order' => $i,
            ]);
        }

        return redirect()->back()->with('flash', 'Peraturan berhasil diperbarui.');
    }

    public function destroy(Rule $rule)
    {
        $rule->delete();
        return redirect()->back()->with('flash', 'Peraturan berhasil dihapus.');
    }
}
