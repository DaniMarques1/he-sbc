"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DadosUnidadeEscolar } from "@/components/DadosUnidadeEscolar";
import { IdentificacaoAluno } from "@/components/IdentificacaoAluno";
import { ResultadosEnsinoFundamental } from "@/components/ResultadosEnsinoFundamental";
import { PercursoAcademico } from "@/components/PercursoAcademico";
import { TransferenciaDuranteAnoLetivo } from "@/components/TransferenciaDuranteAnoLetivo";
import { Observacoes } from "@/components/Observacoes";
import { BotoesAcao } from "@/components/BotoesAcao";
import { Analytics } from "@vercel/analytics/next";
import { generateHistoricoAction } from "./actions/generateHistorico";
import { createClient } from "@/utils/supabase/client";
import { Toast } from "@/components/Toast";
import { TemplateSavePopover } from "@/components/TemplateManager";

export default function HistoricoEscolar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateModalMode, setTemplateModalMode] = useState<"load" | "save">("load");
  const [alunoDataToSave, setAlunoDataToSave] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const action = submitter?.getAttribute("value");
    
    if (action === "doc") {
      setIsPending(true);
      try {
        const formData = new FormData(e.currentTarget);
        const result = await generateHistoricoAction(formData);
        
        if (result.error) {
          window.dispatchEvent(new CustomEvent('show_toast', { detail: "Erro gerando documento: " + result.error }));
        } else if (result.base64) {
          const byteCharacters = atob(result.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
          
          const nomeAluno = formData.get("NOME_ALUNO")?.toString() || "Aluno";
          let anoHistorico = "";
          for (let i = 1; i <= 5; i++) {
            if (formData.get(`CONCLUSAO_${i}`) === "on" || formData.get(`TRANSF_${i}`) === "on") {
              anoHistorico = formData.get(`ANO_${i}`)?.toString() || "";
              break;
            }
          }

          const safeFileName = anoHistorico ? `${nomeAluno}-${anoHistorico}.docx` : `${nomeAluno}.docx`;
          
          const saveAs = (await import("file-saver")).saveAs;
          saveAs(blob, safeFileName);
        }
      } catch (err) {
        console.error(err);
        alert("Erro inesperado gerando documento.");
      } finally {
        setIsPending(false);
      }
    } else if (action === "save_template") {
      if (!user) {
        alert("Você precisa estar logado para salvar um template!");
        return;
      }
      const formData = new FormData(e.currentTarget);
      const dataObj: any = {};
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });
      
      setAlunoDataToSave(dataObj);
      setTemplateModalMode("save");
      setIsTemplateModalOpen(true);
    } else {
        alert("Ação não implementada ainda.");
    }
  };

  return (
    <>
      <Toast />
      <Analytics />
      <Sidebar user={user} isLoadOpen={templateModalMode === "load" && isTemplateModalOpen} onOpenLoad={() => { setTemplateModalMode("load"); setIsTemplateModalOpen(true); }} onCloseLoad={() => setIsTemplateModalOpen(false)} />
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header
          isPending={isPending}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <form id="historicoForm" onSubmit={handleSubmit} className="px-4 md:px-10 py-6 md:py-8 max-w-7xl mx-auto space-y-8 md:space-y-10">
          
          <DadosUnidadeEscolar />
          <IdentificacaoAluno />
          <ResultadosEnsinoFundamental />
          <PercursoAcademico />
          <TransferenciaDuranteAnoLetivo />
          <Observacoes />

          <div className="relative w-full">
            <TemplateSavePopover 
              isOpen={templateModalMode === "save" && isTemplateModalOpen} 
              onClose={() => setIsTemplateModalOpen(false)} 
              user={user} 
              alunoDataToSave={alunoDataToSave} 
            />
            <BotoesAcao isPending={isPending} />
          </div>
        </form>
      </main>
    </>
  );
}
