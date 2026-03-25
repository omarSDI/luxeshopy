'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
    dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('ar');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang) {
            setLanguage(savedLang);
        }
        setMounted(true);
    }, []);

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('language', language);
            document.documentElement.dir = dir;
            document.documentElement.lang = language;
        }
    }, [language, mounted, dir]);

    const t = (key: string) => {
        const langData = translations[language] || translations['en'];
        const translation = (langData as any)[key] || (translations['en'] as any)[key];
        return translation || key;
    };

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, dir }}>
            {mounted ? children : <div className="invisible">{children}</div>}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
