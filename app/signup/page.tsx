'use client'

import { use } from 'react'
import { signup } from '../login/actions'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ errorMessage?: string }>
}) {
  const params = use(searchParams)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f2fe] p-4 md:p-8 font-manrope relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e2e1ed_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
      
      <div 
        className="w-full rounded-[2.5rem] bg-white p-8 md:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.12)] relative z-10 border border-white/50"
        style={{ maxWidth: '420px' }}
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-[#1A237E]/5 rounded-2xl flex items-center justify-center mb-6 text-[#1A237E]">
            <span className="material-symbols-outlined text-4xl">app_registration</span>
          </div>
          <h1 className="text-3xl font-black text-[#1A237E] tracking-tight mb-2">Novo Cadastro</h1>
          <p className="text-secondary font-semibold text-sm">Registre sua instituição de ensino</p>
        </div>
        
        {params.errorMessage && (
          <div className="mb-6 rounded-2xl bg-error/5 px-5 py-4 text-xs font-bold text-error border border-error/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-lg">error</span>
            {params.errorMessage}
          </div>
        )}

        <form className="flex flex-col gap-5" action={signup}>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-secondary uppercase tracking-widest ml-1" htmlFor="institution_name">Nome da Instituição</label>
            <input
              className="rounded-2xl border-2 border-[#e2e1ed]/50 bg-slate-50/50 p-4 text-sm font-semibold text-on-surface focus:border-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 transition-all placeholder:text-slate-400"
              id="institution_name"
              name="institution_name"
              type="text"
              placeholder="Ex: Escola Estadual Machado de Assis"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-secondary uppercase tracking-widest ml-1" htmlFor="username">Login Escolhido</label>
            <input
              className="rounded-2xl border-2 border-[#e2e1ed]/50 bg-slate-50/50 p-4 text-sm font-semibold text-on-surface focus:border-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 transition-all placeholder:text-slate-400"
              id="username"
              name="username"
              type="text"
              placeholder="Ex: machado_assis_login"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-secondary uppercase tracking-widest ml-1" htmlFor="password">Senha da Conta</label>
            <input
              className="rounded-2xl border-2 border-[#e2e1ed]/50 bg-slate-50/50 p-4 text-sm font-semibold text-on-surface focus:border-[#1A237E] focus:outline-none focus:ring-4 focus:ring-[#1A237E]/5 transition-all placeholder:text-slate-400"
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>
          
          <button
            className="mt-6 rounded-2xl text-white py-5 font-bold shadow-[0_8px_25px_rgba(26,35,126,0.25)] transition-all hover:brightness-110 hover:shadow-[0_12px_30px_rgba(26,35,126,0.3)] active:scale-[0.98]"
            style={{ backgroundColor: '#1A237E' }}
            type="submit"
          >
            Finalizar Cadastro
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-semibold text-secondary">
          Já possui registro?{' '}
          <Link href="/login" className="text-[#1A237E] hover:underline font-black">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  )
}
