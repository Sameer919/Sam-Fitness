import nodemailer from 'nodemailer'

let transporter = null

async function getTransporter() {
  if (transporter) return transporter

  const hasRealSMTP = process.env.SMTP_HOST && process.env.SMTP_USER

  if (hasRealSMTP) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    console.log('📧 Using real SMTP:', process.env.SMTP_HOST)
  } else {
    // Auto-create Ethereal test account (no config needed)
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log('📧 Using Ethereal test SMTP:', testAccount.user)
  }

  return transporter
}

export async function sendContactNotification(data) {
  try {
    const t = await getTransporter()
    const info = await t.sendMail({
      from: `"Sam Fitness Contact" <noreply@Sam Fitness.in>`,
      to: process.env.NOTIFICATION_EMAIL || 'admin@Sam Fitness.in',
      subject: `[Contact] ${data.subject} — ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0284C7, #06B6D4); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Name:</strong></td><td style="color: #0f172a;">${data.firstName} ${data.lastName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="color: #0284C7;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="color: #0f172a;">${data.phone || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Subject:</strong></td><td style="color: #0f172a;">${data.subject}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Interests:</strong></td><td style="color: #0f172a;">${(data.interests || []).join(', ') || '—'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border-left: 4px solid #0284C7;">
              <strong style="color: #64748b;">Message:</strong>
              <p style="color: #0f172a; margin: 8px 0 0; line-height: 1.6;">${data.message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
        </div>
      `,
    })

    const preview = nodemailer.getTestMessageUrl(info)
    if (preview) console.log('📬 Email preview:', preview)
    return true
  } catch (err) {
    console.error('Email error:', err.message)
    return false
  }
}

export async function sendMembershipNotification(data) {
  try {
    const t = await getTransporter()
    const info = await t.sendMail({
      from: `"Sam Fitness Memberships" <noreply@Sam Fitness.in>`,
      to: process.env.NOTIFICATION_EMAIL || 'admin@Sam Fitness.in',
      subject: `[Lead] ${data.plan.toUpperCase()} Plan Interest — ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0284C7, #06B6D4); padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">New Membership Lead 🎯</h2>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Name:</strong></td><td style="color: #0f172a;">${data.firstName} ${data.lastName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td><a href="mailto:${data.email}" style="color: #0284C7;">${data.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td><td style="color: #0f172a;">${data.phone || '—'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Plan:</strong></td><td><span style="background: #0284C7; color: white; padding: 2px 10px; border-radius: 12px; font-weight: bold;">${data.plan}</span></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Billing:</strong></td><td style="color: #0f172a;">${data.billing}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;"><strong>Goal:</strong></td><td style="color: #0f172a;">${data.goal || '—'}</td></tr>
            </table>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
        </div>
      `,
    })
    const preview = nodemailer.getTestMessageUrl(info)
    if (preview) console.log('📬 Email preview:', preview)
    return true
  } catch (err) {
    console.error('Email error:', err.message)
    return false
  }
}

export async function sendAutoReply(to, name) {
  try {
    const t = await getTransporter()
    await t.sendMail({
      from: `"Sam Fitness Team" <hello@Sam Fitness.in>`,
      to,
      subject: `We received your message, ${name}! 💪`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #0284C7, #06B6D4); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Sam Fitness</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">India's #1 Premium Fitness Studio</p>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a;">Hi ${name}! 👋</h2>
            <p style="color: #475569; line-height: 1.7;">
              Thank you for reaching out to Sam Fitness. We've received your message and a member of our specialist 
              team will get back to you personally within <strong style="color: #0284C7;">24 hours</strong>.
            </p>
            <div style="background: #f0f9ff; border-left: 4px solid #0284C7; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
              <p style="color: #0284C7; margin: 0; font-weight: 600;">While you wait...</p>
              <p style="color: #475569; margin: 8px 0 0; font-size: 14px;">
                Start your <strong>7-day free trial</strong> today — unlimited classes, 2 PT sessions, 
                and a nutrition consultation with zero commitment.
              </p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
              Need immediate help? Call us: <a href="tel:+919876543210" style="color: #0284C7;">+91 98765 43210</a> 
              or WhatsApp us any time.
            </p>
          </div>
          <div style="background: #f8fafc; padding: 16px; text-align: center; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 12px 12px;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Sam Fitness Fitness · 42 Fitness Avenue, Bandra West, Mumbai
            </p>
          </div>
        </div>
      `,
    })
    return true
  } catch (err) {
    console.error('Auto-reply error:', err.message)
    return false
  }
}
