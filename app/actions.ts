"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createAppointmentAction(formData: FormData) {
  const clientName = formData.get("clientName") as string;
  const startDatetime = formData.get("startDatetime") as string;
  const serviceId = formData.get("serviceId") as string;

  if (!clientName || !startDatetime || !serviceId) {
    return { error: "Por favor, preencha todos os campos." };
  }

  // 1. Busca a barbearia
  const { data: tenant, error: tenantError } = await supabase.from("tenants").select("id").limit(1).single();
  if (tenantError || !tenant) return { error: "Erro ao buscar barbearia: " + tenantError?.message };

  // 2. Busca o serviço escolhido
  const { data: service, error: serviceError } = await supabase.from("services").select("duration_mins").eq("id", serviceId).single();
  if (serviceError || !service) return { error: "Erro ao buscar serviço: " + serviceError?.message };

  // 3. Calcula os horários
  const startTime = new Date(startDatetime);
  const endTime = new Date(startTime.getTime() + service.duration_mins * 60000);

  // 4. Salva no banco
  const { error } = await supabase.from("appointments").insert({
    tenant_id: tenant.id,
    service_id: serviceId,
    client_name: clientName,
    client_phone: "00000000000",
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    status: "CONFIRMED"
  });

  if (error) {
    console.error("Erro no Supabase:", error);
    return { error: "Erro no Banco de Dados: " + error.message };
  }

  // Se deu tudo certo, atualiza a tela
  revalidatePath("/");
  return { success: true };
}