import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    const data = await request.json();
    console.log('Webhook received:', data);

    if (data?.AccountStatus?.message === 'DELETED') return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });

    const { error } = await supabase
      .from('accounts')
      .update({
        account_id: data.AccountStatus.account_id,
      })
      .eq('account_id', data.AccountStatus.account_id);

    if (error) {
      console.error('Error updating record:', error);
      return NextResponse.json({ message: 'Error updating record' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}
