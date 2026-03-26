import { getMessages } from '@/app/actions/messages';
import MessagesClient from '@/app/admin/messages/MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const messages = await getMessages();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#001f3f] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Customer Messages
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">Manage and respond to customer inquiries from the contact form.</p>
                </div>
            </div>

            <MessagesClient initialMessages={messages} />
        </div>
    );
}
