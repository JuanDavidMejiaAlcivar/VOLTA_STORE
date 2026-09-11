import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    return (
        <div>
            <nav>
                <Link href="/categorias">
                    Categorías
                </Link>

                {' | '}

                <Link href="/productos">
                    Productos
                </Link>
            </nav>

            <hr />

            <main>
                {children}
            </main>
        </div>
    );
}