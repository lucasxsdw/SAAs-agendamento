import { Clock, MoreVertical } from "lucide-react";

type AppointmentCardProps = {
  clientName: string;
  serviceName: string;
  startTime: string;
  status: string;
};

export function AppointmentCard({ clientName, serviceName, startTime, status }: AppointmentCardProps) {
  // Converte a data do banco (UTC) para a hora local do celular do usuário (ex: 09:00)
  const timeFormatted = new Date(startTime).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isConfirmed = status === "CONFIRMED";
  const isPending = status === "PENDING";

  return (
    <div
      className={`p-4 rounded-xl shadow-sm border-l-4 flex justify-between items-center bg-white
        ${isConfirmed ? "border-blue-500" : isPending ? "border-yellow-500" : "border-slate-200"}`}
    >
      <div className="flex gap-4 items-center">
        <div className="text-sm font-bold text-slate-500 flex flex-col items-center">
          <Clock className="w-4 h-4 mb-1" />
          {timeFormatted}
        </div>
        <div>
          <p className="font-bold text-md text-slate-900">{clientName}</p>
          <p className="text-xs text-slate-500">{serviceName}</p>
        </div>
      </div>

      <button className="p-2 text-slate-400 hover:text-black rounded-full hover:bg-slate-100 transition">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}