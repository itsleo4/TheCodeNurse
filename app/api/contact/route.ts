import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const message = formData.get('message')

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { error } = await supabase.from('messages').insert([
      {
        visitor_name: name,
        visitor_email: email,
        visitor_phone: phone,
        message_body: message,
      },
    ])

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: `Database Error: ${error.message} (${error.code})` },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json({ success: true, message: 'Registry received' })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
