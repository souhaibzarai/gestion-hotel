<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Client;

class ClientController extends Controller
{
    public function index()
    {
        return Client::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:100',
            'lastName' => 'required|string|max:100',
            'email' => 'required|email|unique:clients',
            'phone' => 'nullable|string',
            'document' => 'nullable|string',
            'documentType' => 'nullable|string',
        ]);

        $validated['registrationDate'] = now()->toDateString();


        $client = Client::create($validated);
        return response()->json($client, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'firstName' => 'sometimes|required|string|max:255',
            'lastName' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'document' => 'sometimes|required|string|max:100',
        ]);

        $client = Client::findOrFail($id);

        $client->update($validated);

        return response()->json($client);
    }
}
