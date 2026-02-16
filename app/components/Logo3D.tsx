'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React from 'react';

export default function Logo3D() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY,
                rotateX,
                transformStyle: "preserve-3d",
            }}
            animate={{
                y: [0, -5, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="relative h-12 w-48 sm:h-16 sm:w-64 cursor-pointer"
        >

            {/* The user provided a logo in the chat, I will use a stylized text + icon approach if I can't directly use the image as a URL easily, or I'll assume they'll replace the source. Actually, I can use the logo text and styling from the image. */}
            <div
                style={{
                    transform: "translateZ(30px)",
                }}
                className="flex items-center gap-3"
            >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-xl flex items-center justify-center shadow-2xl border border-[#D4AF37]/30 group-hover:border-[#D4AF37] transition-colors">
                    <svg viewBox="0 0 64 64" className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] fill-current">
                        <path d="M12 44H52V40H12V44ZM52 36L44.5 24L32 36L19.5 24L12 36V22L20.6667 31L32 18L43.3333 31L52 22V36Z" />
                    </svg>
                </div>
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    LuxeShopy
                </span>
            </div>
        </motion.div>
    );
}
