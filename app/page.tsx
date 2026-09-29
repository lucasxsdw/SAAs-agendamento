import { supabase } from "@/lib/supabase";
import { Calendar, CheckCircle2 } from "lucide-react";
import { AppointmentCard } from "@/components/AppointmentCard";
import { NewAppointmentModal } from "@/components/NewAppointmentModal";

export const revalidate = 0;

export default async function DashboardAdmin() {
  // Busca agendamentos
  const { data: appointments, error: apptError } = await supabase
    .from("appointments")
    .select(`id, client_name, start_time, status, services ( name )`)
    .order("start_time", { ascending: true });

  // Busca os serviços disponíveis para enviar ao Modal
  const { data: services, error: svcError } = await supabase
    .from("services")
    .select("id, name");

  if (apptError || svcError) console.error("Erro na busca de dados:", apptError || svcError);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-black text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">AgendaCore</h1>
          <p className="text-slate-400 text-sm mt-1">Sua agenda de hoje</p>
        </div>
        
        {/* Passamos os serviços aqui para dentro! */}
        <NewAppointmentModal services={services || []} />
      </header>

      <div className="p-4 max-w-md mx-auto mt-4 space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-800">
          <Calendar className="w-5 h-5" />
          Compromissos
        </h2>

        <div className="flex flex-col gap-3">
          {appointments && appointments.length > 0 ? (
            appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                clientName={appt.client_name}
                // @ts-ignore
                serviceName={appt.services?.name || "Serviço padrão"}
                startTime={appt.start_time}
                status={appt.status}
              />
            ))
          ) : (
            <div className="text-center p-8 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              Nenhum agendamento encontrado.
            </div>
          )}
        </div>
      </div>

      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-3 flex justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] max-w-md left-1/2 -translate-x-1/2">
        <button className="flex flex-col items-center text-black">
          <Calendar className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Agenda</span>
        </button>
        <button className="flex flex-col items-center text-slate-400">
          <CheckCircle2 className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">Clientes</span>
        </button>
      </nav>
    </main>
  );
}