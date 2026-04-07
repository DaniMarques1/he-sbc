'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const username = formData.get('username') as string
  const safeUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '')
  const email = `${safeUsername}@hesbc.com`
  
  const data = {
    email: email,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?errorMessage=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const institutionName = formData.get('institution_name') as string
  const username = formData.get('username') as string
  const safeUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '')
  const email = `${safeUsername}@hesbc.com`
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        institution_name: institutionName
      }
    }
  })

  if (error) {
    redirect(`/signup?errorMessage=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Conta criada com sucesso! Faça o login.')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
