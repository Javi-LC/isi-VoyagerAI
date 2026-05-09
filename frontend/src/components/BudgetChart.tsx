import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Budget } from '../types/travel';
import { Wallet } from 'lucide-react';

interface BudgetChartProps {
  budget: Budget;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b']; // Indigo, Emerald, Amber

export function BudgetChart({ budget }: BudgetChartProps) {
  const data = useMemo(() => {
    if (!budget) return [];
    
    // Función auxiliar para extraer solo los números de un string como "120€"
    const extractNumber = (str: string) => {
      if (!str) return 0;
      const num = str.replace(/[^0-9.,]/g, '').replace(',', '.');
      return parseFloat(num) || 0;
    };

    return [
      { name: 'Transporte', value: extractNumber(budget.transporte), original: budget.transporte, color: COLORS[0] },
      { name: 'Alimentación', value: extractNumber(budget.alimentacion), original: budget.alimentacion, color: COLORS[1] },
      { name: 'Entradas', value: extractNumber(budget.entradas), original: budget.entradas, color: COLORS[2] }
    ].filter(item => item.value > 0);
  }, [budget]);

  if (data.length === 0) return null;

  const totalStr = budget.total || data.reduce((sum, item) => sum + item.value, 0) + '€';

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 text-sm">
          <p className="font-semibold text-slate-800 mb-1">{payload[0].name}</p>
          <p className="text-indigo-600 font-medium">{payload[0].payload.original}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 mt-8 rounded-2xl bg-white/80 border border-slate-100 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 m-0">Presupuesto Estimado</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Gráfico */}
        <div className="relative w-full md:w-1/2 h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-sm text-slate-500 font-medium">Total</span>
             <span className="text-2xl font-bold text-slate-800">{totalStr}</span>
          </div>
        </div>

        {/* Leyenda y detalles */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.original}</span>
              </div>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-lg">Total Estimado</span>
                <span className="font-bold text-indigo-600 text-xl">{totalStr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
