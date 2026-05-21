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
  const [baseState, setBaseState] = useState<any>(null);

  // Capture the form state helper
  const captureFormState = () => {
    const form = document.getElementById("historicoForm") as HTMLFormElement;
    if (!form) return null;
    const dataObj: any = {};
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((el: any) => {
      if (!el.name) return;
      if (el.type === "checkbox" || el.type === "radio") {
        dataObj[el.name] = el.checked;
      } else {
        dataObj[el.name] = el.value;
      }
    });
    return dataObj;
  };

  useEffect(() => {
    // Captura o estado limpo inicial do formulário imediatamente após a montagem do componente,
    // antes de qualquer template de sessionStorage ou Supabase ser carregado.
    const initial = captureFormState();
    if (initial) {
      setBaseState(initial);
    }
  }, []);

  const handleReset = () => {
    if (!baseState) {
      window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Nenhum estado anterior capturado para redefinir.' }));
      return;
    }
    
    if (!confirm("Tem certeza de que deseja redefinir os dados para o estado anterior? Todas as alterações não salvas serão perdidas.")) {
      return;
    }

    const schoolKeys = [
      'EMEB',
      'ENDERECO_EMEB',
      'CEP_EMEB',
      'TEL_1',
      'TEL_2',
      'ATO_DE_CRIACAO',
      'NOME_RESPONSAVEL',
      'MATRICULA_RESPONSAVEL',
      'CARGO_RESPONSAVEL'
    ];

    // Capture current school values to preserve them in the event payload
    const currentSchoolData: any = {};
    schoolKeys.forEach(key => {
      const els = document.getElementsByName(key);
      if (els && els.length > 0) {
        currentSchoolData[key] = (els[0] as HTMLInputElement | HTMLSelectElement).value;
      }
    });

    Object.keys(baseState).forEach(key => {
      // Preserva os dados da unidade escolar se eles já estiverem preenchidos no formulário
      if (schoolKeys.includes(key)) {
        const currentEls = document.getElementsByName(key);
        if (currentEls && currentEls.length > 0) {
          const currentVal = (currentEls[0] as HTMLInputElement).value;
          if (currentVal && currentVal.trim() !== "") {
            return; // Mantém o valor escolar atual
          }
        }
      }

      const els = document.getElementsByName(key);
      if (els && els.length > 0) {
        const el = els[0] as HTMLInputElement | HTMLSelectElement;
        if (el.type === 'checkbox' || el.type === 'radio') {
          (el as HTMLInputElement).checked = baseState[key] === 'on' || baseState[key] === true;
        } else {
          el.value = baseState[key];
        }
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    const resetPayload = {
      ...baseState,
      ...currentSchoolData,
      isReset: true
    };

    window.dispatchEvent(new CustomEvent('onTemplateLoaded', { detail: resetPayload }));
    window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Dados redefinidos para o estado anterior!' }));
  };

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

          // Validar que todos os campos de identificação de todos os alunos no lote estão preenchidos
          for (let i = 0; i < alunosBatch.length; i++) {
            const student = alunosBatch[i];
            const missing = [];
            if (!student.NOME_ALUNO?.trim()) missing.push("Nome Completo");
            if (!student.RM?.trim()) missing.push("RM");
            if (!student.DATA_NASCIMENTO?.trim()) missing.push("Data de Nascimento");
            if (!student.RA?.trim()) missing.push("RA");
            if (!student.UF_RA?.trim()) missing.push("UF do RA");
            if (!student.MUNICIPIO?.trim()) missing.push("Naturalidade");
            if (!student.UF?.trim()) missing.push("Estado");
            if (!student.NACION?.trim()) missing.push("Nacionalidade");

            if (missing.length > 0) {
              const identificador = student.NOME_ALUNO?.trim() || `Linha ${i + 1}`;
              window.dispatchEvent(new CustomEvent('show_toast', { 
                detail: `Preencha todos os campos do aluno (${identificador}): ${missing.join(", ")}` 
              }));
              setIsPending(false);
              return;
            }
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
          // Validar campos de identificação do aluno individual
          const nome = formData.get("NOME_ALUNO")?.toString().trim();
          const rm = formData.get("RM")?.toString().trim();
          const dataNasc = formData.get("DATA_NASCIMENTO")?.toString().trim();
          const ra = formData.get("RA")?.toString().trim();
          const ufRa = formData.get("UF_RA")?.toString().trim();
          const municipio = formData.get("MUNICIPIO")?.toString().trim();
          const uf = formData.get("UF")?.toString().trim();
          const nacion = formData.get("NACION")?.toString().trim();

          const missing = [];
          if (!nome) missing.push("Nome Completo");
          if (!rm) missing.push("RM");
          if (!dataNasc) missing.push("Data de Nascimento");
          if (!ra) missing.push("RA");
          if (!ufRa) missing.push("UF do RA");
          if (!municipio) missing.push("Naturalidade");
          if (!uf) missing.push("Estado");
          if (!nacion) missing.push("Nacionalidade");

          if (missing.length > 0) {
            window.dispatchEvent(new CustomEvent('show_toast', { 
              detail: `Preencha os seguintes campos de identificação: ${missing.join(", ")}` 
            }));
            setIsPending(false);
            return;
          }

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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low px-6 py-4 rounded-3xl border border-outline-variant/30 shadow-sm">
             <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Formulário de Histórico Escolar</span>
             </div>
             <button
               type="button"
               onClick={handleReset}
               className="w-full sm:w-auto border border-error/30 text-error px-6 py-2.5 rounded-xl font-manrope font-bold text-xs hover:bg-error/10 hover:border-error transition-all flex items-center justify-center gap-2"
             >
               <span className="material-symbols-outlined text-[16px]">restart_alt</span>
               Redefinir Dados
             </button>
          </div>

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

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface-container-low border border-outline-variant/30 px-6 py-5 rounded-3xl w-full shadow-sm text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-2xl" data-icon="shield">shield</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-primary font-headline uppercase tracking-wider">Declaração de Privacidade & LGPD</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Este sistema está em conformidade com a <b>Lei Geral de Proteção de Dados (LGPD) - <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline hover:text-primary/80 transition-colors">Lei nº 13.709/2018</a></b>. Garantimos a proteção das informações inseridas: <b>nenhum dado de aluno persiste em banco de dados ou em qualquer parte do sistema</b>. O processamento dos dados ocorre de forma temporária e segura apenas para a geração imediata do arquivo de histórico escolar.
              </p>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
