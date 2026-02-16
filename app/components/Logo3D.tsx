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
                    <svg viewBox="0 0 64 64" className="w-6 h-6 sm:w-8 sm:h-8">
                        {/* Bag Handle */}
                        <path d="M22 24C22 18.4772 26.4772 14 32 14C37.5228 14 42 18.4772 42 24V28H40V24C40 19.5817 36.4183 16 32 16C27.5817 16 24 19.5817 24 24V28H22V24Z" fill="#D4AF37" />
                        {/* Bag Body */}
                        <path d="M18 28H46L49 54H15L18 28Z" fill="#D4AF37" />
                        {/* Smartphone outline */}
                        <rect x="26" y="34" width="12" height="16" rx="2" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
                        <rect x="30" y="35" width="4" height="0.5" rx="0.25" fill="#0a0a0a" />
                    </svg>
                </div>
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#D4AF37]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    LuxeShopy
                </span>
            </div>
        </motion.div>
    );
}
