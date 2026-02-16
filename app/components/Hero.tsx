'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[#1a1a1a] overflow-hidden">
      {/* Circuit Board Pattern Overlay */}
      <div className="absolute inset-0 circuit-board opacity-[0.03] z-0 pointer-events-none"></div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37]/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-semibold text-[#d4af37] uppercase tracking-wider">
                {t('newTech')}
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('heroTitle')}
              <span className="block text-[#d4af37] mt-2">{t('heroReview')}</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941e] text-[#0a0a0a] font-bold rounded-lg hover:shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-300"
                >
                  {t('shopNow')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/category/wearables"
                  className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
                >
                  {t('exploreCollection')}
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* 3D Smartwatch with Rotation & Float */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
            <div className="relative h-full w-full flex items-center justify-center">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 360],
                }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                  rotateY: { duration: 15, repeat: Infinity, ease: 'linear' },
                }}
                className="relative z-10 w-full h-full flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=1200"
                  alt="High-End Smartwatch"
                  className="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_35px_35px_rgba(212,175,55,0.3)]"
                />
              </motion.div>

              {/* Futuristic Orbit Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-[#d4af37]/10 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-[#d4af37]/5 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#d4af37]/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
