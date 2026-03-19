export function ActionBar() {
  return (
    <div className="flex flex-col md:flex-row justify-end gap-3 md:gap-4 pb-8 md:pb-12">
      <button className="bg-surface-container-high text-on-primary-fixed-variant px-8 py-3 rounded-xl font-manrope font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm" data-icon="docs">docs</span>
        Gerar .DOC
      </button>
      <button className="bg-surface-container-high text-on-primary-fixed-variant px-8 py-3 rounded-xl font-manrope font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm" data-icon="print">print</span>
        Gerar PDF
      </button>
      <button className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-3 rounded-xl font-manrope font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm" data-icon="save">save</span>
        Salvar Registro
      </button>
    </div>
  );
}
