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
        $user = User::findOrFail($id);
        $authUser = auth()->user();

        $request->merge([
            'role' => $request->input('role', $user->role),
        ]);

        if ($user->email === 'admin@admin.com' && $request->email !== $user->email) {
            return response()->json(['message' => 'Impossible de modifier l\'email de l\'administrateur principal'], 403);
        }

        if ($authUser->id === $user->id && $request->role !== 'admin') {
            return response()->json(['message' => 'Vous ne pouvez pas modifier votre propre rôle'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|min:6',
        ]);

        $data = $request->only(['name', 'email', 'password', 'role']);

        if (!$request->filled('password')) {
            unset($data['password']);
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->email === 'admin@admin.com') {
            return response()->json(['message' => 'Impossible de supprimer le compte administrateur principal'], 403);
        }

        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
