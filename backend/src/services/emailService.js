const { getTransporter } = require('../config/mailer');
const { env } = require('../config/env');
const logger = require('../utils/logger');

async function sendMail({ to, subject, html }) {
  if (!to) {
    logger.warn(`Email not sent (no recipient configured). Subject: "${subject}"`);
    return;
  }

  const transporter = getTransporter();
  if (!transporter) {
    logger.warn(`Email not sent (SMTP not configured). Subject: "${subject}" To: ${to}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: env.smtpFrom,
      to,
      subject,
      html
    });
    logger.info(`Email sent: "${subject}" -> ${to}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
  }
}

function wrapTemplate(title, bodyHtml) {
  return `
    <div style="font-family: Arial, sans-serif; background-color:#FAFAF8; padding:32px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        <div style="background-color:#0A0A0A;padding:20px 24px;">
          <span style="color:#F2B705;font-size:20px;font-weight:bold;">Quant</span><span style="color:#ffffff;font-size:20px;font-weight:bold;">Solutions</span>
        </div>
        <div style="padding:28px 24px;color:#232323;">
          <h2 style="margin-top:0;color:#0A0A0A;">${title}</h2>
          ${bodyHtml}
        </div>
        <div style="padding:16px 24px;background:#FAFAF8;color:#888888;font-size:12px;">
          &copy; ${new Date().getFullYear()} QuantSolutions. Internal operations notice.
        </div>
      </div>
    </div>
  `;
}

async function sendWelcomeEmail(user) {
  const html = wrapTemplate(
    'Welcome to QuantSolutions',
    `<p>Hi ${user.firstName},</p>
     <p>Your QuantSolutions account has been created successfully. You can now log in
     to your dashboard to review investment solutions and manage your account.</p>
     <p>If you did not create this account, please contact our support team immediately.</p>`
  );

  await sendMail({
    to: user.email,
    subject: 'Welcome to QuantSolutions',
    html
  });
}

async function sendPasswordChangedEmail(user) {
  const html = wrapTemplate(
    'Your Password Was Changed',
    `<p>Hi ${user.firstName},</p>
     <p>This is a confirmation that the password for your QuantSolutions account was
     recently changed. If you did not make this change, please contact support
     immediately.</p>`
  );

  await sendMail({
    to: user.email,
    subject: 'QuantSolutions Password Changed',
    html
  });
}

async function notifyAdminOfDepositRequest(user, deposit) {
  const html = wrapTemplate(
    'New Deposit Request Submitted',
    `<p>A client has submitted a new deposit request.</p>
     <table style="width:100%;border-collapse:collapse;margin-top:12px;">
       <tr><td style="padding:6px 0;color:#666;">Reference</td><td style="padding:6px 0;"><strong>${deposit.reference}</strong></td></tr>
       <tr><td style="padding:6px 0;color:#666;">Client</td><td style="padding:6px 0;">${user.firstName} ${user.lastName}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;">${user.email}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Amount</td><td style="padding:6px 0;">$${Number(deposit.amount).toFixed(2)}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Method</td><td style="padding:6px 0;">${deposit.method}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Status</td><td style="padding:6px 0;">Pending Review</td></tr>
       ${deposit.notes ? `<tr><td style="padding:6px 0;color:#666;">Notes</td><td style="padding:6px 0;">${deposit.notes}</td></tr>` : ''}
     </table>
     <p style="margin-top:16px;">Please review and update this request's status in the admin dashboard.</p>`
  );

  await sendMail({
    to: env.adminEmail,
    subject: `New Deposit Request — ${deposit.reference}`,
    html
  });
}

async function notifyAdminOfWithdrawalRequest(user, withdrawal) {
  const html = wrapTemplate(
    'New Withdrawal Request Submitted',
    `<p>A client has submitted a new withdrawal request.</p>
     <table style="width:100%;border-collapse:collapse;margin-top:12px;">
       <tr><td style="padding:6px 0;color:#666;">Reference</td><td style="padding:6px 0;"><strong>${withdrawal.reference}</strong></td></tr>
       <tr><td style="padding:6px 0;color:#666;">Client</td><td style="padding:6px 0;">${user.firstName} ${user.lastName}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;">${user.email}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Amount</td><td style="padding:6px 0;">$${Number(withdrawal.amount).toFixed(2)}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Bank Name</td><td style="padding:6px 0;">${withdrawal.bankName}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Account Name</td><td style="padding:6px 0;">${withdrawal.accountName}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Account Number</td><td style="padding:6px 0;">${withdrawal.accountNumber}</td></tr>
       <tr><td style="padding:6px 0;color:#666;">Status</td><td style="padding:6px 0;">Pending Review</td></tr>
       ${withdrawal.notes ? `<tr><td style="padding:6px 0;color:#666;">Notes</td><td style="padding:6px 0;">${withdrawal.notes}</td></tr>` : ''}
     </table>
     <p style="margin-top:16px;">Please verify client details and update this request's status in the admin dashboard.</p>`
  );

  await sendMail({
    to: env.adminEmail,
    subject: `New Withdrawal Request — ${withdrawal.reference}`,
    html
  });
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  notifyAdminOfDepositRequest,
  notifyAdminOfWithdrawalRequest
};
