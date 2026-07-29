<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Carousel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CarouselController extends Controller
{
    public function index()
    {
        return Inertia::render('Carousel/Index', [
            'carousels' => Carousel::orderBy('sort_order')->get()->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'description' => $c->description,
                'detail_title' => $c->detail_title,
                'detail_description' => $c->detail_description,
                'points' => $c->points,
                'theme' => $c->theme,
                'bg_image' => $c->bg_image,
                'bg_image_url' => $c->bg_image_url,
                'sort_order' => $c->sort_order,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string|max:500',
            'detail_title' => 'nullable|string|max:255',
            'detail_description' => 'nullable|string|max:1000',
            'points' => 'nullable|array',
            'points.*' => 'nullable|string|max:500',
            'theme' => 'required|string|max:50',
            'sort_order' => 'nullable|integer|min:1',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $sortOrder = $request->sort_order
            ? (int) $request->sort_order
            : Carousel::max('sort_order') + 1;

        Carousel::where('sort_order', '>=', $sortOrder)
            ->orderByDesc('sort_order')
            ->each(function ($c) {
                $c->update(['sort_order' => $c->sort_order + 1]);
            });

        $imagePath = $request->file('image')->store('carousels', 'public');

        Carousel::create([
            'title' => $request->title,
            'description' => $request->description,
            'detail_title' => $request->detail_title,
            'detail_description' => $request->detail_description,
            'points' => $request->points ?? [],
            'theme' => trim($request->theme),
            'bg_image' => $imagePath,
            'sort_order' => $sortOrder,
        ]);

        return back()->with('success', 'Carousel berhasil ditambahkan.');
    }

    public function update(Request $request, Carousel $carousel)
    {
        $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'required|string|max:500',
            'detail_title' => 'nullable|string|max:255',
            'detail_description' => 'nullable|string|max:1000',
            'points' => 'nullable|array',
            'points.*' => 'nullable|string|max:500',
            'theme' => 'required|string|max:50',
            'sort_order' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $newOrder = (int) $request->sort_order;
        $oldOrder = $carousel->sort_order;

        if ($newOrder !== $oldOrder) {
            $existing = Carousel::where('sort_order', $newOrder)->where('id', '!=', $carousel->id)->first();
            if ($existing) {
                $existing->update(['sort_order' => $oldOrder]);
            }
        }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'detail_title' => $request->detail_title,
            'detail_description' => $request->detail_description,
            'points' => $request->points ?? [],
            'theme' => trim($request->theme),
            'sort_order' => $newOrder,
        ];

        if ($request->hasFile('image')) {
            if ($carousel->bg_image && !filter_var($carousel->bg_image, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($carousel->bg_image)) {
                Storage::disk('public')->delete($carousel->bg_image);
            }
            $data['bg_image'] = $request->file('image')->store('carousels', 'public');
        }

        $carousel->update($data);

        return back()->with('success', 'Carousel berhasil diperbarui.');
    }

    public function destroy(Carousel $carousel)
    {
        if ($carousel->bg_image && !filter_var($carousel->bg_image, FILTER_VALIDATE_URL) && Storage::disk('public')->exists($carousel->bg_image)) {
            Storage::disk('public')->delete($carousel->bg_image);
        }

        $deletedOrder = $carousel->sort_order;
        $carousel->delete();

        Carousel::where('sort_order', '>', $deletedOrder)
            ->orderBy('sort_order')
            ->each(function ($c) {
                $c->update(['sort_order' => $c->sort_order - 1]);
            });

        return back()->with('success', 'Carousel berhasil dihapus.');
    }
}
