<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarouselSlide;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarouselController extends Controller
{
    public function index()
    {
        $slides = CarouselSlide::orderBy('sort_order')->get();
        return Inertia::render('Carousel/Index', [
            'slides' => $slides,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'detail_title' => 'required|string|max:255',
            'detail_description' => 'required|string|max:1000',
            'points' => 'required|array|min:1',
            'points.*' => 'required|string|max:1000',
            'theme' => 'required|string|in:welcome,procedure,rules',
        ]);

        $maxSort = CarouselSlide::max('sort_order') ?? 0;
        $validated['sort_order'] = $maxSort + 1;

        CarouselSlide::create($validated);

        return redirect()->back()->with('flash', 'Slide berhasil ditambahkan.');
    }

    public function update(Request $request, CarouselSlide $carouselSlide)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'detail_title' => 'required|string|max:255',
            'detail_description' => 'required|string|max:1000',
            'points' => 'required|array|min:1',
            'points.*' => 'required|string|max:1000',
            'theme' => 'required|string|in:welcome,procedure,rules',
        ]);

        $carouselSlide->update($validated);

        return redirect()->back()->with('flash', 'Slide berhasil diperbarui.');
    }

    public function destroy(CarouselSlide $carouselSlide)
    {
        $carouselSlide->delete();
        return redirect()->back()->with('flash', 'Slide berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|exists:carousel_slides,id',
            'slides.*.sort_order' => 'required|integer|min:0',
        ]);

        foreach ($validated['slides'] as $item) {
            CarouselSlide::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return redirect()->back()->with('flash', 'Urutan slide berhasil diperbarui.');
    }
}
