"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/client";
import { Toast } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/next";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        loadTemplatesList();
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadTemplatesList = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("templates")
      .select("id, template_name, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setTemplates(data);
    setIsLoading(false);
  };

  const handleLoad = async (templateId: string) => {
    window.dispatchEvent(new CustomEvent('show_toast', { detail: "Buscando dados..." }));
    const { data, error } = await supabase.from("templates").select("aluno_data").eq("id", templateId).single();
    if (error || !data) {
      alert("Erro ao carregar");
      return;
    }
    
    // Save to session storage and redirect to home to populate
    sessionStorage.setItem('he_sbc_pending_template', JSON.stringify(data.aluno_data));
    router.push("/");
  };

  const handleDelete = async (templateId: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o template "${name}"?`)) return;
    const { error } = await supabase.from("templates").delete().eq("id", templateId);
    if (error) {
      alert("Erro ao excluir: " + error.message);
    } else {
      window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Template excluído!' }));
      loadTemplatesList();
    }
  };

  return (
    <>
      <Toast />
      <Analytics />
      <Sidebar user={user} />
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header
          isPending={isLoading}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <div className="px-3 md:px-10 py-4 md:py-8 max-w-7xl mx-auto space-y-6 md:space-y-10">
          <div className="bg-surface-container-low rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-white px-4 md:px-8 py-5 md:py-8 min-h-[60vh]">
              <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                <span className="material-symbols-outlined text-primary text-[28px]" data-icon="folder_special">folder_special</span>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-headline text-primary tracking-wider">Meus Templates</h2>
                  <p className="text-sm text-secondary mt-1">Navegue e gerencie os históricos que você salvou anteriormente.</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : templates.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 text-center flex flex-col items-center justify-center gap-4">
                  <span className="material-symbols-outlined text-[48px] text-outline">description</span>
                  <div>
                    <h3 className="font-bold text-on-surface">Nenhum template encontrado</h3>
                    <p className="text-sm text-secondary mt-1">Salve seu primeiro histórico preenchendo o formulário na página inicial.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map(t => (
                    <div key={t.id} className="bg-surface-container border border-outline-variant/20 rounded-2xl p-4 md:p-5 hover:shadow-md transition-all flex flex-col h-full group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined" data-icon="description">description</span>
                        </div>
                        <button type="button" onClick={() => handleDelete(t.id, t.template_name)} className="text-secondary hover:text-error hover:bg-error/10 p-2 rounded-xl transition-colors" title="Excluir">
                          <span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                        </button>
                      </div>
                      <h3 className="font-bold text-base md:text-lg text-on-surface mb-1 md:mb-2">{t.template_name}</h3>
                      <p className="text-[10px] md:text-xs text-secondary mb-5 mt-auto">Atualizado em {new Date(t.updated_at).toLocaleDateString('pt-BR')} às {new Date(t.updated_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                      
                      <button 
                        onClick={() => handleLoad(t.id)} 
                        className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 mt-auto"
                      >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        CARREGAR DADOS
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
