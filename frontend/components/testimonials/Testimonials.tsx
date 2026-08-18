"use client";
import { motion } from "framer-motion";
import { TESTIMONIALS } from '@/data/landingData';
import { Star, Quote, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Testimonials(){
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            Clinical Trust
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Physicians, Cardiologists & Patients
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            See how MediScan-AI is streamlining clinical evaluations and empowering individuals with proactive health knowledge.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50/90 rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Rating Stars & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {t.badge && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-sky-600" />
                      {t.badge}
                    </span>
                  )}
                </div>

                <Quote className="w-8 h-8 text-sky-200 mb-2" />

                <p className="text-sm text-slate-700 italic leading-relaxed mb-6 font-normal">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/80">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {t.author}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {t.role}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {t.institution}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
