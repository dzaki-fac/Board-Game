<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use Inertia\Inertia;

class CarouselController extends Controller
{
    public function index()
    {
        return Inertia::render('Carousel/Index', [
            'carousels' => Carousel::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Carousel $carousel)
    {
        request()->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'detail_title' => 'nullable|string|max:255',
            'detail_description' => 'nullable|string|max:1000',
            'points' => 'nullable|array',
            'points.*' => 'nullable|string|max:500',
            'theme' => 'required|string|max:50',
            'bg_image' => 'nullable|string|max:500',
        ]);

        $carousel->update([
            'title' => request('title'),
            'description' => request('description'),
            'detail_title' => request('detail_title'),
            'detail_description' => request('detail_description'),
            'points' => request('points', []),
            'theme' => request('theme'),
            'bg_image' => request('bg_image'),
        ]);

        return back()->with('success', 'Carousel berhasil diperbarui.');
    }
}
