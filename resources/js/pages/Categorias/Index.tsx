import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
    productos_count?: number;
}

interface Props {
    categorias: Categoria[];
}

export default function Index({ categorias }: Props) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        descripcion: '',
    });

    const editarCategoria = (id: number) => {
        const categoria = categorias.find((c) => c.id === id);
        if (categoria) {
            setData({
                nombre: categoria.nombre,
                descripcion: categoria.descripcion || '',
            });
            setEditandoId(id);
            clearErrors();
            setMostrarModal(true);
        }
    };

    const eliminarCategoria = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            router.delete(`/categorias/${id}`);
        }
    };

    const guardarCategoria = (e: React.FormEvent) => {
        e.preventDefault();

        if (editandoId) {
            put(`/categorias/${editandoId}`, {
                onSuccess: () => cerrarModal(),
            });
        } else {
            post('/categorias', {
                onSuccess: () => cerrarModal(),
            });
        }
    };

    const cerrarModal = () => {
        reset();
        clearErrors();
        setEditandoId(null);
        setMostrarModal(false);
    };

    return (
        <div className="w-full">
            {/* Encabezado */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Categorías
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                    Selecciona una categoría para explorar nuestros productos.
                </p>
            </div>

            {/* Botón agregar */}
            <div className="mb-8 flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        clearErrors();
                        setEditandoId(null);
                        setMostrarModal(true);
                    }}
                    className="rounded-md border border-white/40 px-4 py-2 text-sm font-medium text-white"
                >
                    + Agregar categoría
                </button>
            </div>

            {/* Categorías */}
            {categorias.length === 0 ? (
                <div className="rounded-lg border border-white/20 p-8 text-center">
                    <p className="text-gray-400">
                        No hay categorías disponibles.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categorias.map((categoria) => (
                        <div
                            key={categoria.id}
                            className="group rounded-xl border border-white/20 bg-white/5 p-5"
                        >
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-white">
                                    {categoria.nombre}
                                </h2>

                                <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-400">
                                    {categoria.descripcion ||
                                        'Sin descripción disponible.'}
                                </p>
                            </div>

                            <div className="mb-5 border-t border-white/10 pt-4">
                                <p className="text-sm text-gray-400">
                                    Productos:{' '}
                                    <span className="font-semibold text-white">
                                        {categoria.productos_count ?? 0}
                                    </span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => editarCategoria(categoria.id)}
                                className="inline-block rounded-md border border-yellow-500/40 px-4 py-2 text-sm font-medium text-yellow-500"
                            >
                                Editar
</button>


                            <button
                                type="button"
                                onClick={() => eliminarCategoria(categoria.id)}
                                className="inline-block rounded-md border border-red-500/40 px-4 py-2 text-sm font-medium text-red-500"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {mostrarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md rounded-xl border border-white/20 bg-black p-6 shadow-2xl">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editandoId ? 'Editar categoría' : 'Nueva categoría'}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                {editandoId ? 'Modifica los datos de la categoría.' : 'Ingresa los datos de la nueva categoría.'}
                            </p>
                        </div>

                        <form onSubmit={guardarCategoria}>
                            {/* Nombre */}
                            <div className="mb-4">
                                <label
                                    htmlFor="nombre"
                                    className="mb-2 block text-sm font-medium text-white"
                                >
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    placeholder="Ej. Ropa"
                                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-white/60"
                                />

                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="mb-6">
                                <label
                                    htmlFor="descripcion"
                                    className="mb-2 block text-sm font-medium text-white"
                                >
                                    Descripción
                                </label>

                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) =>
                                        setData(
                                            'descripcion',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Describe la categoría..."
                                    rows={4}
                                    className="w-full resize-none rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-white/60"
                                />

                                {errors.descripcion && (
                                    <p className="mt-1 text-sm text-red-400">
                                        {errors.descripcion}
                                    </p>
                                )}
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="rounded-md border border-white/20 px-4 py-2 text-sm text-gray-300"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md border border-white/40 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Guardando...'
                                        : 'Guardar categoría'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}