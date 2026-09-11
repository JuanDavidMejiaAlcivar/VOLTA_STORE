<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Producto::with('categoria')->get();
        $categorias = Categoria::all();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
        ]);
    }

    public function generarPdf()
    {
        // Traer productos cargando su relación 'categoria' (Eager Loading)
        $productos = Producto::with('categoria')->get();
        // Cálculo de métricas
        $totalProductos = $productos->count();
        $precioPromedio = $productos->avg('precio');
        // Cargar vista Blade enviando datos
        $pdf = Pdf::loadView('pdf.productos', compact('productos', 'totalProductos', 'precioPromedio'));
        // Descargar PDF
        return $pdf->download('reporte_productos_' . date('Y-m-d') . '.pdf');
    }

    public function create()
    {
        $categorias = Categoria::all();

        return Inertia::render('Productos/Create', [
            'categorias' => $categorias,
        ]);
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        Producto::create($datos);

        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto creado correctamente.');
    }

    public function show(Producto $producto)
    {
        $producto->load('categoria');

        return Inertia::render('Productos/Show', [
            'producto' => $producto,
        ]);
    }

    public function edit(Producto $producto)
    {
        $categorias = Categoria::all();

        return Inertia::render('Productos/Edit', [
            'producto' => $producto,
            'categorias' => $categorias,
        ]);
    }

    public function update(Request $request, Producto $producto)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $producto->update($datos);

        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Producto $producto)
    {
        $producto->delete();

        return redirect()
            ->route('productos.index')
            ->with('success', 'Producto eliminado correctamente.');
    }
}