import { Head } from '@inertiajs/react';
import { useState } from 'react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import type { DashboardInvitation } from '@/types';

type Props = {
    pendingInvitations?: DashboardInvitation[];
};

export default function Dashboard({ pendingInvitations = [] }: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    return (
        <>
            <Head title="Dashboard" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />
            <h1 className="text-2xl font-bold text-white">Bienvenido a TUTI!</h1>
            <p className="mt-1 text-sm text-gray-400">
                Explora nuestros productos y encuentra lo que necesitas.
            </p>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard : '/',
        },
    ],
});
