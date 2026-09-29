"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createAppointmentAction } from "@/app/actions";

type Service = {
  id: string;
  name: string;
};

export function NewAppointmentModal({ services }: { services: Service[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const result = await createAppointmentAction(formData);
      
      // Checa se o backend devolveu alguma mensagem de erro
      if (result?.error) {
        alert(result.error);
      } else {
        setIsOpen(false); // Só fecha se der sucesso
      }
    } catch (error) {
      alert("Falha de conexão. O servidor não respondeu.");
    } finally {
      setLoading(false);
    }
  
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white text-black p-2 rounded-full active:scale-95 transition shadow-lg flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Novo Agendamento</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CAMPO: Nome */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  placeholder="Ex: João da Silva"
                  // Forçando texto preto e placeholder visível
                  className="w-full bg-white text-black placeholder-slate-400 border border-slate-300 rounded-xl p-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />
              </div>

              {/* CAMPO: Serviço */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Serviço</label>
                <select 
                  name="serviceId" 
                  required
                  // Forçando texto preto
                  className="w-full bg-white text-black border border-slate-300 rounded-xl p-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                >
                  <option value="">Selecione um serviço...</option>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>{svc.name}</option>
                  ))}
                </select>
              </div>
              
              {/* CAMPO: Data e Hora */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Data e Hora</label>
                <input
                  type="datetime-local"
                  name="startDatetime"
                  required
                  // style={{ colorScheme: 'light' }} impede que o calendário nativo bugue no modo escuro
                  style={{ colorScheme: 'light' }}
                  className="w-full bg-white text-black border border-slate-300 rounded-xl p-3 outline-none focus:border-black focus:ring-1 focus:ring-black transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-semibold py-4 rounded-xl shadow-lg active:scale-[0.98] transition disabled:opacity-50 flex justify-center items-center"
                >
                  {loading ? "Salvando..." : "Confirmar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}