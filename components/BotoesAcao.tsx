export function BotoesAcao({ isPending }: { isPending?: boolean }) {
  return (
    <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pb-8 md:pb-12">
      <button 
        type="submit" 
        name="action" 
        value="doc" 
        disabled={isPending}
        className="bg-surface-container-high text-on-primary-fixed-variant px-8 py-3 rounded-xl font-manrope font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
      >
        <span className="material-symbols-outlined text-sm" data-icon="docs">docs</span>
        {isPending ? "Gerando..." : "Gerar .DOC"}
      </button>
      <button type="submit" name="action" value="pdf" className="bg-surface-container-high text-on-primary-fixed-variant px-8 py-3 rounded-xl font-manrope font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm" data-icon="print">print</span>
        Gerar PDF
      </button>
      <button 
        type="submit"
        name="action"
        value="save_template"
        className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-3 rounded-xl font-manrope font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm" data-icon="save">save</span>
        Salvar Template
      </button>
    </div>
  );
}
