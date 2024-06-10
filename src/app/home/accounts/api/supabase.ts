import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export const addAccount = async (userEmail: string, accountId: string) => {
  try {
    const { data, error } = await supabase.from('accounts').insert([
      { user_email: userEmail, account_id: accountId }
    ])

    if (error) throw error

    return data
  } catch (err) {
    throw err
  }
}

export const getAccounts = async (userEmail: string) => {
  try {
    const { data, error } = await supabase.from('accounts').select().eq('user_email', userEmail)

    if (error) throw error

    return data
  } catch (err) {
    throw err
  }
}

export const deleteSupabaseAccount = async (accountId: string) => {
  try {
    const { data, error } = await supabase.from('accounts').delete().eq('account_id', accountId)

    if (error) throw error

    return data
  } catch (err) {
    throw err
  }
}

export const listenSupabaseChanges = async (table: string, callback: (payload: any) => void) => {
  const subscription = supabase
    .channel(table)
    .on(
      'postgres_changes',
      {
        event: "*",
        schema: 'public',
        table: table,
      },
      (payload) => {
        console.log('Change received!', payload)
        callback((payload.new as { account_id: string }).account_id)
      }
    )
    .subscribe();

  return subscription
}