"use client";
import { motion } from "framer-motion";
import { STATISTICS } from '@/data/landingData';
import { Target, FileCheck2, Dna, Clock } from 'lucide-react';

const statIconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-6 h-6 text-sky-600" />,
  FileCheck2: <FileCheck2 className="w-6 h-6 text-indigo-600" />,
  Dna: <Dna className="w-6 h-6 text-purple-600" />,
  Clock: <Clock className="w-6 h-6 text-emerald-600" />,
};

export default function Stats() {
  return (
    <section className="py-16 bg-white border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATISTICS.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                  {statIconMap[stat.icon]}
                </div>
              </div>

              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight block mb-1">
                  {stat.value}
                </span>
                <p className="text-xs text-slate-500 font-medium">
                  {stat.subtext}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
