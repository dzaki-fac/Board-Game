<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminAccountController extends Controller
{
    public function index()
    {
        $admins = Admin::select(['id', 'name', 'email', 'role', 'lantai', 'created_at'])->get();

        return Inertia::render('Accounts/Account', [
            'admins' => $admins,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,superadmin',
            'lantai' => [$request->role === 'admin' ? 'required' : 'nullable', 'string', 'max:50'],
        ]);

        Admin::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'lantai' => $validated['lantai'] ?? '',
        ]);

        return redirect()->route('admin.accounts.index')->with('flash', 'Admin berhasil ditambahkan.');
    }

    public function update(Request $request, Admin $admin)
    {
        $currentAdmin = Auth::guard('admin')->user();

        if (!$currentAdmin->isSuperAdmin() && $admin->id !== $currentAdmin->id) {
            abort(403, 'Anda hanya dapat mengedit akun sendiri.');
        }

        if ($admin->id === $currentAdmin->id) {
            $request->merge(['role' => $admin->role]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $admin->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:admin,superadmin',
            'lantai' => [$request->role === 'admin' ? 'required' : 'nullable', 'string', 'max:50'],
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'lantai' => $validated['lantai'] ?? '',
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $admin->update($data);

        return redirect()->route('admin.accounts.index')->with('flash', 'Admin berhasil diperbarui.');
    }

    public function destroy(Admin $admin)
    {
        if ($admin->id === Auth::guard('admin')->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }

        $admin->delete();

        return redirect()->route('admin.accounts.index')->with('flash', 'Admin berhasil dihapus.');
    }
}
