'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, HeadphonesIcon, Award } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free delivery across Tunisia',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Always here to help you',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Authentic luxury products',
    color: 'from-[#d4af37] to-[#b8941e]',
  },
];

export default function TrustSignals() {
  return (
    <section className="w-full bg-gradient-to-b from-[#d4af37]/10 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0a0a0a] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Why Choose LuxeShopy?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 border-2 border-[#d4af37]/20 hover:border-[#d4af37] transition-all duration-300 shadow-lg hover:shadow-xl text-center group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="text-xl font-bold text-[#0a0a0a] mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
