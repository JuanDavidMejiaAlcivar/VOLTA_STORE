<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::withCount('productos')->get();

        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias,
        ]);
    }

    public function create()
    {
        return Inertia::render('Categorias/Create');
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        Categoria::create($datos);

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría creada correctamente.');
    }

    public function show(Categoria $categoria)
    {
        $categoria->load('productos');

        return Inertia::render('Categorias/Show', [
            'categoria' => $categoria,
        ]);
    }

    public function edit(Categoria $categoria)
    {
        return Inertia::render('Categorias/Edit', [
            'categoria' => $categoria,
        ]);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $categoria->update($datos);

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();

        return redirect()
            ->route('categorias.index')
            ->with('success', 'Categoría eliminada correctamente.');
    }
}