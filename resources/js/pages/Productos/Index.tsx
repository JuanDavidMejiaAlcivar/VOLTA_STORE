import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    categoria?: Categoria;
}

interface Props {
    productos: Producto[];
    categorias: Categoria[];
}

export default function Index({ productos, categorias }: Props) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [mostrarFiltroCategoria, setMostrarFiltroCategoria] = useState(false);

    const productosFiltrados = productos.filter(producto => {
        const coincideCategoria = filtroCategoria === '' || producto.categoria?.id.toString() === filtroCategoria;
        const coincideBusqueda = busqueda === '' || 
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
            (producto.descripcion && producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
        return coincideCategoria && coincideBusqueda;
    });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: null as number | null,
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: '',
    });

    const guardarProducto = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.id) {
            put(`/productos/${data.id}`, {
                onSuccess: () => {
                    reset();
                    setMostrarModal(false);
                },
            });
        } else {
            post('/productos', {
                onSuccess: () => {
                    reset();
                    setMostrarModal(false);
                },
            });
        }
    };

    const editarProducto = (producto: Producto) => {
        setData({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio.toString(),
            categoria_id: producto.categoria?.id.toString() || '',
        });
        setMostrarModal(true);
    };

    const eliminarProducto = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            router.delete(`/productos/${id}`);
        }
    };

    const cerrarModal = () => {
        reset();
        setMostrarModal(false);
    };

    return (
        <div className="w-full">
            {/* Encabezado */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Productos
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                    Gestiona los productos disponibles en el catálogo.
                </p>
            </div>

            {/* Filtros y Acciones */}
            <div className="mb-8 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Búsqueda y Filtros */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setMostrarBuscador(!mostrarBuscador);
                                if (mostrarBuscador) setBusqueda('');
                            }}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition shrink-0 ${
                                mostrarBuscador 
                                    ? 'border-white/60 bg-white/10 text-white' 
                                    : 'border-white/20 bg-black/40 text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                            title="Buscar producto"
                        >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setMostrarFiltroCategoria(!mostrarFiltroCategoria);
                                if (mostrarFiltroCategoria) setFiltroCategoria('');
                            }}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition shrink-0 ${
                                mostrarFiltroCategoria 
                                    ? 'border-white/60 bg-white/10 text-white' 
                                    : 'border-white/20 bg-black/40 text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                            title="Filtrar por categoría"
                        >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                            </svg>
                        </button>
                        {mostrarBuscador && (
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Buscar producto..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    autoFocus
                                    className="w-full rounded-md border border-white/20 bg-black/40 py-1.5 px-3 text-sm text-white placeholder-gray-500 outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 transition"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Botones de Acción */}
                    <div className="flex w-full sm:w-auto items-center justify-end gap-3">
                        <a
                            href="/productos/reporte-pdf"
                            target="_blank"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition"
                        >
                            Generar PDF
                        </a>
                        <button
                            type="button"
                            onClick={() => setMostrarModal(true)}
                            className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                        >
                            <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Agregar producto
                        </button>
                    </div>
                </div>

                {/* Filtro por Categoría (Botones) */}
                {mostrarFiltroCategoria && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 mt-2">
                        <button
                            onClick={() => setFiltroCategoria('')}
                            className={`rounded-md border px-3 py-1.5 text-sm transition ${
                                filtroCategoria === '' 
                                    ? 'border-white/60 bg-white/10 text-white shadow-sm' 
                                    : 'border-white/20 bg-black/40 text-gray-400 hover:border-white/40 hover:bg-white/5'
                            }`}
                        >
                            Todas
                        </button>
                        {categorias.map((categoria) => (
                            <button
                                key={categoria.id}
                                onClick={() => setFiltroCategoria(categoria.id.toString())}
                                className={`rounded-md border px-3 py-1.5 text-sm transition ${
                                    filtroCategoria === categoria.id.toString()
                                        ? 'border-white/60 bg-white/10 text-white shadow-sm' 
                                        : 'border-white/20 bg-black/40 text-gray-400 hover:border-white/40 hover:bg-white/5'
                                }`}
                            >
                                {categoria.nombre}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Productos (Tabla) */}
            {productosFiltrados.length === 0 ? (
                <div className="rounded-lg border border-white/20 p-8 text-center">
                    <p className="text-gray-400">
                        No hay productos que coincidan con la búsqueda.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-white/20 bg-white/5">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="border-b border-white/20 bg-black/20 text-xs uppercase text-white">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium">ID</th>
                                <th scope="col" className="px-6 py-4 font-medium">Nombre</th>
                                <th scope="col" className="px-6 py-4 font-medium">Descripción</th>
                                <th scope="col" className="px-6 py-4 font-medium">Precio</th>
                                <th scope="col" className="px-6 py-4 font-medium">Categoría</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.id} className="transition">
                                    <td className="whitespace-nowrap px-6 py-4">{producto.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{producto.nombre}</td>
                                    <td className="max-w-xs truncate px-6 py-4">{producto.descripcion || 'Sin descripción'}</td>
                                    <td className="whitespace-nowrap px-6 py-4">${producto.precio}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {producto.categoria?.nombre ? (
                                            <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
                                                {producto.categoria.nombre}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <button
                                            onClick={() => editarProducto(producto)}
                                            className="text-white hover:text-blue-400 mr-4 transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarProducto(producto.id)}
                                            className="text-gray-400 hover:text-red-400 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {mostrarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/20 bg-black p-6 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {data.id ? 'Editar producto' : 'Nuevo producto'}
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                {data.id ? 'Modifica los datos del producto.' : 'Ingresa los datos del nuevo producto.'}
                            </p>
                        </div>

                        <form onSubmit={guardarProducto}>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-white">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-white/60"
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-red-400">{errors.nombre}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-white">
                                    Descripción
                                </label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    className="w-full resize-none rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-white/60"
                                />
                                {errors.descripcion && <p className="mt-1 text-sm text-red-400">{errors.descripcion}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-white">
                                    Precio
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)}
                                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-white/60"
                                />
                                {errors.precio && <p className="mt-1 text-sm text-red-400">{errors.precio}</p>}
                            </div>
                            
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-white">
                                    Categoría
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categorias.map((categoria) => (
                                        <button
                                            key={categoria.id}
                                            type="button"
                                            onClick={() => setData('categoria_id', categoria.id.toString())}
                                            className={`rounded-md border px-3 py-1.5 text-sm transition ${
                                                data.categoria_id === categoria.id.toString()
                                                    ? 'border-white/60 bg-white/10 text-white shadow-sm'
                                                    : 'border-white/20 bg-black/40 text-gray-400 hover:border-white/40 hover:bg-white/5'
                                            }`}
                                        >
                                            {categoria.nombre}
                                        </button>
                                    ))}
                                </div>
                                {errors.categoria_id && <p className="mt-1 text-sm text-red-400">{errors.categoria_id}</p>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="rounded-md border border-white/20 px-4 py-2 text-sm text-gray-300 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md border border-white/40 bg-white px-4 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : 'Guardar producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}