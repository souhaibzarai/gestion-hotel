<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    private function isAdmin()
    {
        return Auth::user()?->role === 'admin';
    }

    public function index()
    {
        if (!$this->isAdmin()) return response()->json(['message' => 'Unauthorized'], 403);
        return User::select('id', 'name', 'email', 'role')->get();
    }

    public function store(Request $request)
    {
        if (!$this->isAdmin()) return response()->json(['message' => 'Unauthorized'], 403);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        if (!$this->isAdmin()) return response()->json(['message' => 'Unauthorized'], 403);

        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'role' => $request->role ?? $user->role,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        return response()->json(['message' => 'Utilisateur mis à jour']);
    }

    public function destroy($id)
    {
        if (!$this->isAdmin()) return response()->json(['message' => 'Unauthorized'], 403);

        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
