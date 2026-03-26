import { getShippingFee } from '@/app/actions/settings';
import SettingsClient from '@/app/admin/settings/SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const shippingFee = await getShippingFee();

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-8 animate-fade-in">
            <div>
                <h1 className="text-4xl font-extrabold text-[#001f3f] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Store Settings
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Configure global parameters for your LuxeShopy experience.</p>
            </div>

            <SettingsClient initialShippingFee={shippingFee} />
        </div>
    );
}
