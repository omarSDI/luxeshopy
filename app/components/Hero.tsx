'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const heroImage = "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=1200";
  return (
    <section className="relative w-full min-h-screen bg-[#060a16] flex items-center overflow-hidden">
      {/* World-Class Tech Background */}
      <div className="absolute inset-0 tech-grid z-0"></div>

      {/* Animated Glowing Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="glow-line" style={{ left: '10%', opacity: 0.1 }}></div>
        <div className="glow-line" style={{ left: '40%', opacity: 0.15, animationDelay: '2s' }}></div>
        <div className="glow-line" style={{ left: '70%', opacity: 0.1, animationDelay: '5s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              '--duration': `${10 + Math.random() * 20}s`
            } as any}
          ></div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left space-y-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#d4af37]/20 to-[#0d121f] rounded-full border border-[#d4af37]/30 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em]">
                {t('newTech')}
              </span>
            </motion.div>

            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('heroTitle')}
              <span className="block bg-gradient-to-r from-[#d4af37] via-[#f9c94d] to-[#b8941e] bg-clip-text text-transparent mt-4">
                {t('heroReview')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/shop"
                  className="group relative inline-flex items-center gap-4 px-10 py-5 bg-[#d4af37] text-[#060a16] font-black rounded-sm overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t('shopNow')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f9c94d] to-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/category/wearables"
                  className="inline-flex items-center gap-4 px-10 py-5 border border-[#d4af37]/40 text-white font-bold rounded-sm backdrop-blur-sm hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all duration-500"
                >
                  {t('exploreCollection')}
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* 3D Vertical Watch Refinement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'circOut' }}
            className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center p-8"
          >
            {/* Dynamic Halo */}
            <div className="absolute w-[80%] h-[80%] bg-gradient-to-r from-[#d4af37]/20 to-transparent rounded-full blur-[120px] opacity-30 animate-pulse"></div>

            <AnimatePresence>
              {!imageError ? (
                <motion.div
                  key="image"
                  animate={{
                    y: [0, -30, 0],
                    rotateY: 360,
                  }}
                  transition={{
                    y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                    rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
                  }}
                  whileHover={{ scale: 1.1, cursor: 'pointer' }}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                  style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
                >
                  {/* The Watch - Standing Vertical 3D */}
                  <div className="relative transform-gpu flex items-center justify-center">
                    <img
                      src={heroImage}
                      alt="High-End Smartwatch"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                      className={`max-w-[75%] max-h-[75%] object-contain drop-shadow-[0_50px_60px_rgba(0,0,0,0.8)] transition-all duration-1000 ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                      style={{
                        filter: 'contrast(1.1) brightness(1.1)',
                        transform: 'rotateZ(0deg)' // Ensure vertical standing
                      }}
                    />

                    {/* Shadow reacting to watch position */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 blur-2xl rounded-full scale-x-150 opacity-60"></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="fallback"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 w-80 h-80 bg-gradient-to-br from-[#0d121f] to-[#060a16] rounded-3xl border border-[#d4af37]/30 flex items-center justify-center shadow-[0_0_80px_rgba(212,175,55,0.15)]"
                >
                  <div className="text-center">
                    <div className="text-[#d4af37] text-6xl mb-4 font-black tracking-tighter">LX</div>
                    <div className="text-gray-500 text-xs uppercase tracking-[0.4em] font-bold">Ultra Tech</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Futuristic Tech Orbits */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[105%] h-[105%] border-[0.5px] border-[#d4af37]/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[95%] h-[95%] border-[0.5px] border-[#d4af37]/5 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
