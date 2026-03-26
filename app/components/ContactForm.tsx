'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createMessage } from '../actions/messages';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

export default function ContactForm() {
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        const result = await createMessage(data);

        if (result.success) {
            toast.success(t('success'));
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error(t('error'));
        }

        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-2 border-[#D4AF37]/20"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-[#0a0a0a] uppercase tracking-widest mb-2">
                        {t('name')}
                    </label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none transition-all text-[#0a0a0a]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#0a0a0a] uppercase tracking-widest mb-2">
                        {t('email')}
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none transition-all text-[#0a0a0a]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-[#0a0a0a] uppercase tracking-widest mb-2">
                        {t('message')}
                    </label>
                    <textarea
                        name="message"
                        required
                        rows={5}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-[#D4AF37] focus:bg-white outline-none transition-all text-[#0a0a0a] resize-none"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-[#0a0a0a] to-[#0a0a0a] hover:from-[#D4AF37] hover:to-[#B8860B] text-white hover:text-[#0a0a0a] rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl hover:shadow-[#D4AF37]/40 disabled:opacity-50"
                >
                    {isSubmitting ? t('sending') : t('send')}
                </button>
            </form>
        </motion.div>
    );
}
