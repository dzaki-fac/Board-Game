<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'message' => 'Hello Laravel + React'
        ]);
    }

    public function rules()
    {
        return Inertia::render('Rules/Index');
    }
}