<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminIsSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $admin = Auth::guard('admin')->user();

        if (!$admin || !$admin->isSuperAdmin()) {
            abort(403, 'Akses ditolak. Hanya superadmin yang dapat mengakses halaman ini.');
        }

        return $next($request);
    }
}
