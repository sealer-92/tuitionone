// Admin recipients for support notifications. Override with ADMIN_NOTIFY_EMAILS
// (comma-separated) in the environment.
export function adminNotifyEmails(): string[] {
  const fromEnv = process.env.ADMIN_NOTIFY_EMAILS
  if (fromEnv) return fromEnv.split(',').map((e) => e.trim()).filter(Boolean)
  return ['davidseale92@gmail.com', 'p.cotter1@hotmail.com']
}

export async function sendSupportTicketEmail(opts: {
  subject: string
  message: string
  fromEmail: string
  fromName: string | null
}) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY!)
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: adminNotifyEmails(),
    replyTo: opts.fromEmail,
    subject: `New support issue: ${opts.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1B2A24;">New support issue</h2>
        <p style="color: rgba(27,42,36,0.72);"><strong>From:</strong> ${opts.fromName || 'Unknown'} (${opts.fromEmail})</p>
        <p style="color: rgba(27,42,36,0.72);"><strong>Subject:</strong> ${opts.subject}</p>
        <div style="background:#F5EFE4;border-radius:12px;padding:16px 18px;color:#1B2A24;white-space:pre-wrap;">${opts.message}</div>
        <p style="color:rgba(27,42,36,0.52);font-size:13px;margin-top:24px;">View and manage in the admin support area.</p>
      </div>
    `,
  })
}
