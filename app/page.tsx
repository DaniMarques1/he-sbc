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
import { generateHistoricoBatchAction } from "./actions/generateHistoricoBatch";
import { createClient } from "@/utils/supabase/client";
import { Toast } from "@/components/Toast";
import { TemplateSavePopover } from "@/components/TemplateManager";

export default function HistoricoEscolar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [alunoDataToSave, setAlunoDataToSave] = useState<any>(null);
  const [progressMsg, setProgressMsg] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsUserLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoaded(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const pendingJson = sessionStorage.getItem('he_sbc_pending_template');
    if (pendingJson) {
      try {
        const flatData = JSON.parse(pendingJson);
        setTimeout(() => { // small delay to ensure DOM is ready
          Object.keys(flatData).forEach(key => {
            const els = document.getElementsByName(key);
            if (els && els.length > 0) {
              const el = els[0] as HTMLInputElement | HTMLSelectElement;
              if (el.type === 'checkbox' || el.type === 'radio') {
                (el as HTMLInputElement).checked = flatData[key] === 'on' || flatData[key] === true;
              } else {
                el.value = flatData[key];
              }
              el.dispatchEvent(new Event("change", { bubbles: true }));
              el.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });
          window.dispatchEvent(new CustomEvent('onTemplateLoaded', { detail: flatData }));
          window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Template carregado com sucesso!' }));
        }, 100);
      } catch (err) {
        console.error("Erro processando template", err);
      }
      sessionStorage.removeItem('he_sbc_pending_template');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter;
    const action = submitter?.getAttribute("value");

    if (action === "doc") {
      setIsPending(true);
      setProgressMsg("");

      try {
        const formData = new FormData(e.currentTarget);
        const isBatch = formData.get("MALA_DIRETA_ENABLED") === "true";

        if (isBatch) {
          const alunosBatchStr = formData.get("ALUNOS_BATCH")?.toString() || "[]";
          const alunosBatch = JSON.parse(alunosBatchStr);

          if (alunosBatch.length === 0) {
            window.dispatchEvent(new CustomEvent('show_toast', { detail: "Nenhum aluno adicionado na Mala Direta." }));
            setIsPending(false);
            return;
          }

          setProgressMsg(`Processando lote unificado com ${alunosBatch.length} alunos... Isso pode levar alguns segundos dependendo do tamanho.`);
          
          const result = await generateHistoricoBatchAction(formData, alunosBatch);

          if (result.error || result.status === "error") {
             console.error(result.error);
             window.dispatchEvent(new CustomEvent('show_toast', { detail: `Erro gerando mala direta: ${result.error}` }));
             setIsPending(false);
             setProgressMsg("");
             return;
          }

          if (result.base64) {
            const byteCharacters = atob(result.base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const saveAs = (await import("file-saver")).saveAs;
            saveAs(blob, "Historicos_MalaDireta.docx");
            window.dispatchEvent(new CustomEvent('show_toast', { detail: "Mala direta gerada com sucesso!" }));
          }

        } else {
          // Geração Individual Restante Original
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
        }
      } catch (err) {
        console.error(err);
        alert("Erro inesperado gerando documento(s).");
      } finally {
        setIsPending(false);
        setProgressMsg("");
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
      setIsSaveModalOpen(true);
    } else {
      alert("Ação não implementada ainda.");
    }
  };

  return (
    <>
      <Toast />
      <Analytics />
      <Sidebar user={user} />
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header
          isPending={isPending}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        {isPending && progressMsg && (
          <div className="fixed top-0 left-0 w-full z-50 bg-primary text-white text-xs font-bold text-center py-2 animate-pulse transition-all">
             {progressMsg}
          </div>
        )}

        <form id="historicoForm" onSubmit={handleSubmit} className="px-4 md:px-10 py-6 md:py-8 max-w-7xl mx-auto space-y-8 md:space-y-10">

          {isUserLoaded && !user && (
            <div className="flex flex-col md:flex-row items-center gap-3 bg-surface-container-low border border-outline-variant/30 px-5 py-4 rounded-3xl w-full shadow-sm relative z-10">
              <span className="bg-error text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full animate-pulse tracking-wider">Desconectado</span>
              <p className="text-xs md:text-sm text-secondary font-medium text-center md:text-left">
                <a href="/login" className="text-primary font-bold hover:underline relative z-20">Faça Login</a> para aproveitar melhor o sistema, com salvamento de múltiplos templates e auto-preenchimento de configurações.
              </p>
            </div>
          )}

          <DadosUnidadeEscolar user={user} />
          <IdentificacaoAluno />
          <ResultadosEnsinoFundamental />
          <PercursoAcademico user={user} />
          <TransferenciaDuranteAnoLetivo />
          <Observacoes />

          <div className="relative w-full">
            <TemplateSavePopover
              isOpen={isSaveModalOpen}
              onClose={() => setIsSaveModalOpen(false)}
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
