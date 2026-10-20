export type SmtpReply = { code?: string; responseCode?: number; command?: string; response?: string }

// Nodemailer error fields worth keeping; recipient addresses are masked out of the server reply.
export function smtpErrorDetails(error: unknown): SmtpReply {
  if (!error || typeof error !== 'object') return {}
  const { code, responseCode, command, response } = error as Record<string, unknown>
  const reply: SmtpReply = {}
  if (typeof code === 'string') reply.code = code.slice(0, 40)
  if (typeof responseCode === 'number') reply.responseCode = responseCode
  if (typeof command === 'string') reply.command = command.split(':')[0].slice(0, 20)
  if (typeof response === 'string') reply.response = response.replace(/[^\s<>@]+@[^\s<>@]+/g, '[email]').slice(0, 300)
  return reply
}

// When to send again after a refusal. The provider's spam filter stayed hot for hours after midnight refusals
// (16 and 18 Oct) while the morning resend went through, so a refusal before 06:00 WIB waits until 06:00.
export function retryAfterRefusal(refusedAt: Date, delayMs: number) {
  const wib = new Date(refusedAt.getTime() + 7 * 3_600_000)
  if (wib.getUTCHours() < 6) return new Date(Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth(), wib.getUTCDate(), 6 - 7))
  return new Date(refusedAt.getTime() + delayMs)
}
