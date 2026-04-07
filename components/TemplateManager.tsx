"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function TemplateLoadPopover({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    if (user && isOpen) {
      loadTemplatesList();
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const loadTemplatesList = async () => {
    const { data } = await supabase
      .from("templates")
      .select("id, template_name, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setTemplates(data);
  };

  const handleLoad = async (templateId: string) => {
    const { data, error } = await supabase.from("templates").select("aluno_data").eq("id", templateId).single();
    if (error || !data) {
      alert("Erro ao carregar");
      return;
    }
    const flatData = data.aluno_data;
    Object.keys(flatData).forEach(key => {
      const els = document.getElementsByName(key);
      if (els && els.length > 0) {
        const el = els[0] as HTMLInputElement;
        if (el.type === 'checkbox' || el.type === 'radio') {
          el.checked = flatData[key] === 'on' || flatData[key] === true;
        } else {
          el.value = flatData[key];
        }
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Template carregado!' }));
    onClose();
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
    <div 
      className="absolute left-full ml-4 top-0 bg-white rounded-3xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.15)] z-[9999] flex flex-col before:content-[''] before:absolute before:top-8 before:-left-2 before:w-4 before:h-4 before:bg-surface-container-low before:rotate-45"
      style={{ width: "350px" }}
    >
      <div className="flex items-center justify-between p-6 bg-surface-container-low relative z-10 rounded-t-3xl">
        <h3 className="text-[15px] font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">folder_open</span>
          Carregar Template
        </h3>
        <button onClick={onClose} className="text-secondary hover:bg-outline-variant/20 rounded-full p-2 transition-colors"><span className="material-symbols-outlined text-[18px]">close</span></button>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto flex flex-col gap-2 relative z-10 bg-white rounded-b-3xl">
        {templates.map(t => (
          <div key={t.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-surface-container-low transition-colors group">
            <span className="font-semibold text-sm text-on-surface truncate pr-2 pl-2">{t.template_name}</span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => handleDelete(t.id, t.template_name)} className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
              <button type="button" onClick={() => handleLoad(t.id)} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-colors shadow-sm">
                Carregar
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && <div className="p-6 text-sm text-center text-secondary italic">Nenhum template salvo.</div>}
      </div>
    </div>
  );
}


export function TemplateSavePopover({ isOpen, onClose, user, alunoDataToSave }: { isOpen: boolean, onClose: () => void, user: any, alunoDataToSave: any }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (user && isOpen) {
      loadTemplatesList();
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const loadTemplatesList = async () => {
    const { data } = await supabase
      .from("templates")
      .select("id, template_name, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setTemplates(data);
  };

  const handleSaveNew = async () => {
    if (!templateName) { alert("Digite um nome!"); return; }
    setIsSaving(true);
    const { error } = await supabase.from("templates").insert([{ user_id: user.id, template_name: templateName, aluno_data: alunoDataToSave }]);
    if (error) alert("Erro: " + error.message);
    else {
      setTemplateName("");
      window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Template salvo!' }));
      onClose();
    }
    setIsSaving(false);
  };

  const handleOverwrite = async (templateId: string, name: string) => {
    if (!confirm(`Sobrescrever o template "${name}"?`)) return;
    setIsSaving(true);
    const { error } = await supabase.from("templates").update({ aluno_data: alunoDataToSave, updated_at: new Date().toISOString() }).eq("id", templateId);
    if (error) alert("Erro: " + error.message);
    else {
      window.dispatchEvent(new CustomEvent('show_toast', { detail: 'Template sobrescrito!' }));
      onClose();
    }
    setIsSaving(false);
  };

  return (
    <div 
      className="absolute bottom-full mb-4 right-0 bg-white rounded-3xl drop-shadow-[0_-5px_45px_rgba(0,0,0,0.18)] z-[9999] flex flex-col before:content-[''] before:absolute before:-bottom-2 before:right-[80px] before:w-4 before:h-4 before:bg-white before:rotate-45"
      style={{ width: "450px" }}
    >
      <div className="flex items-center justify-between p-6 bg-surface-container-low relative z-10 rounded-t-3xl">
        <h3 className="text-base font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">save</span>
          Salvar Progresso Atual
        </h3>
        <button onClick={onClose} className="text-secondary hover:bg-outline-variant/20 rounded-full p-2 transition-colors"><span className="material-symbols-outlined text-[18px]">close</span></button>
      </div>
      
      <div className="p-8 flex flex-col gap-6 relative z-10 bg-white rounded-b-3xl">
        <div className="flex flex-col gap-3 relative">
          <label className="text-[11px] font-bold text-secondary uppercase tracking-widest pl-1">Nome do Novo Template:</label>
          <input 
            type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)}
            placeholder="NOME DO SEU TEMPLATE..."
            className="w-full p-5 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#1A237E] focus:ring-4 focus:ring-[#1A237E]/10 bg-slate-50 text-base text-slate-900 font-bold transition-all shadow-inner"
          />
          <button 
            type="button" 
            onClick={handleSaveNew} 
            disabled={isSaving} 
            className="w-full bg-indigo-900 text-white text-base px-6 py-5 rounded-2xl font-black shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-6"
            style={{ backgroundColor: '#1A237E', color: 'white' }}
          >
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
            SALVAR NOVO TEMPLATE
          </button>
        </div>

        <div className="w-full h-[2px] bg-outline-variant/10 my-1"></div>
        
        <h4 className="text-[11px] font-bold text-secondary uppercase tracking-widest pl-1">Ou Sobrescrever:</h4>
        <div className="max-h-48 overflow-y-auto pr-2 flex flex-col gap-2">
          {templates.map(t => (
            <div key={t.id} className="flex justify-between items-center p-3 rounded-xl border border-transparent hover:border-outline-variant/30 bg-surface-container-lowest group transition-colors">
              <span className="font-semibold text-sm text-on-surface truncate px-2">{t.template_name}</span>
              <button type="button" onClick={() => handleOverwrite(t.id, t.template_name)} disabled={isSaving} className="text-xs font-bold text-[#b3261e] bg-[#b3261e]/10 px-4 py-2 rounded-lg hover:bg-[#b3261e] hover:text-white transition-all shadow-sm">
                Sobrescrever
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
