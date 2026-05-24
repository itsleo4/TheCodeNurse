'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteMessage(id: string, isFromDetail: boolean = false) {
  console.log(`[ADMIN ACTION] Attempting to delete message: ${id}`)
  const supabase = createClient()
  
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[ADMIN ACTION ERROR] deleteMessage:', error)
    return { error: error.message }
  }

  console.log(`[ADMIN ACTION SUCCESS] Deleted message: ${id}`)
  revalidatePath('/admin/inbox')
  revalidatePath('/admin/dashboard')

  if (isFromDetail) {
    redirect('/admin/inbox')
  }
  return { success: true }
}

export async function deleteMultipleMessages(ids: string[]) {
  console.log(`[ADMIN ACTION] Attempting to delete ${ids.length} messages`)
  const supabase = createClient()
  
  const { error } = await supabase
    .from('messages')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('[ADMIN ACTION ERROR] deleteMultipleMessages:', error)
    return { error: error.message }
  }

  console.log(`[ADMIN ACTION SUCCESS] Deleted ${ids.length} messages`)
  revalidatePath('/admin/inbox')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function deleteAllMessages() {
  console.log('[ADMIN ACTION] Attempting to WIPE ENTIRE INBOX')
  const supabase = createClient()
  
  const { error } = await supabase
    .from('messages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    console.error('[ADMIN ACTION ERROR] deleteAllMessages:', error)
    return { error: error.message }
  }

  console.log('[ADMIN ACTION SUCCESS] Inbox wiped')
  revalidatePath('/admin/inbox')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
