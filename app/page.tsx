"use client";

import { useState } from "react";
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

export default function HistoricoEscolar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
          alert("Erro gerando documento: " + result.error);
        } else if (result.base64) {
          const byteCharacters = atob(result.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
          
          const saveAs = (await import("file-saver")).saveAs;
          saveAs(blob, `Historico_${formData.get("NOME_ALUNO") || "Aluno"}.docx`);
        }
      } catch (err) {
        console.error(err);
        alert("Erro inesperado gerando documento.");
      } finally {
        setIsPending(false);
      }
    } else {
        // Implementar as outras ações futuramente se necessário
        alert("Ação não implementada ainda.");
    }
  };

  return (
    <>
      <Analytics />
      <Sidebar />
      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header
          isPending={isPending}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Content Canvas */}
        <form id="historicoForm" onSubmit={handleSubmit} className="px-4 md:px-10 py-6 md:py-8 max-w-7xl mx-auto space-y-8 md:space-y-10">
          <DadosUnidadeEscolar />
          <IdentificacaoAluno />
          <ResultadosEnsinoFundamental />
          <PercursoAcademico />
          <TransferenciaDuranteAnoLetivo />
          <Observacoes />

          <BotoesAcao isPending={isPending} />
        </form>
      </main>
    </>
  );
}
