import nodemailer from 'nodemailer';

const getMailConfig = () => {
    const {
        SMTP_HOST = 'smtp.gmail.com',
        SMTP_PORT = '587',
        SMTP_SECURE,
        SMTP_USER,
        SMTP_PASS,
        CONTACT_TO_EMAIL = 'raviranjan01b@gmail.com',
        CONTACT_FROM_NAME = 'Ravi Ranjan Portfolio',
    } = process.env;

    return {
        SMTP_HOST,
        SMTP_PORT,
        SMTP_SECURE,
        SMTP_USER,
        SMTP_PASS,
        CONTACT_TO_EMAIL,
        CONTACT_FROM_NAME,
        isMailConfigured: Boolean(SMTP_USER && SMTP_PASS),
    };
};

const createTransporter = () => {
    const config = getMailConfig();

    if (!config.isMailConfigured) {
        return null;
    }

    return nodemailer.createTransport({
        host: config.SMTP_HOST,
        port: Number(config.SMTP_PORT),
        secure: config.SMTP_SECURE
            ? config.SMTP_SECURE === 'true'
            : Number(config.SMTP_PORT) === 465,
        auth: {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
    });
};

const getMailHealth = async () => {
    const config = getMailConfig();
    const transporter = createTransporter();

    if (!config.isMailConfigured || !transporter) {
        return {
            configured: false,
            ready: false,
            status: 'missing_credentials',
            reason: 'SMTP_USER or SMTP_PASS is missing.',
        };
    }

    try {
        await transporter.verify();
        return {
            configured: true,
            ready: true,
            status: 'ready',
            reason: '',
        };
    } catch (error) {
        return {
            configured: true,
            ready: false,
            status: 'connection_failed',
            reason: error instanceof Error ? error.message : 'Unknown SMTP verification error.',
        };
    }
};

const escapeHtml = (value = '') => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildOwnerEmail = ({ name, email, subject, message, createdAt }) => {
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
    const submittedAt = new Date(createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return {
        subject: `New portfolio enquiry: ${subject}`,
        html: `
            <div style="margin:0;background:#0b1020;padding:32px;font-family:Segoe UI,Arial,sans-serif;color:#e5e7eb;">
                <div style="max-width:680px;margin:0 auto;overflow:hidden;border:1px solid rgba(255,255,255,0.1);border-radius:28px;background:linear-gradient(180deg,#111827 0%,#0f172a 100%);box-shadow:0 30px 80px rgba(0,0,0,0.35);">
                    <div style="padding:32px 32px 24px;background:radial-gradient(circle at top right,rgba(251,191,36,0.26),transparent 30%),linear-gradient(135deg,#111827 0%,#172554 100%);">
                        <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(251,191,36,0.12);color:#fbbf24;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Portfolio Contact</div>
                        <h1 style="margin:18px 0 8px;font-size:30px;line-height:1.1;color:#ffffff;">New message from ${escapeHtml(name)}</h1>
                        <p style="margin:0;color:#cbd5e1;font-size:15px;">A visitor submitted the contact form on your portfolio.</p>
                    </div>
                    <div style="padding:32px;">
                        <div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-bottom:24px;">
                            <div style="padding:18px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,0.08);">
                                <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#94a3b8;">From</div>
                                <div style="margin-top:8px;font-size:18px;color:#ffffff;font-weight:600;">${escapeHtml(name)}</div>
                                <div style="margin-top:4px;color:#cbd5e1;">${escapeHtml(email)}</div>
                            </div>
                            <div style="padding:18px;border-radius:18px;background:#111827;border:1px solid rgba(255,255,255,0.08);">
                                <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#94a3b8;">Submitted</div>
                                <div style="margin-top:8px;font-size:18px;color:#ffffff;font-weight:600;">${escapeHtml(submittedAt)}</div>
                                <div style="margin-top:4px;color:#cbd5e1;">Subject: ${escapeHtml(subject)}</div>
                            </div>
                        </div>
                        <div style="padding:24px;border-radius:22px;background:#020617;border:1px solid rgba(251,191,36,0.18);">
                            <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#fbbf24;">Message</div>
                            <div style="margin-top:14px;font-size:15px;line-height:1.8;color:#e2e8f0;">${safeMessage}</div>
                        </div>
                        <div style="margin-top:24px;">
                            <a href="mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display:inline-block;padding:14px 20px;border-radius:14px;background:#fbbf24;color:#0f172a;text-decoration:none;font-weight:700;">Reply to ${escapeHtml(name)}</a>
                        </div>
                    </div>
                </div>
            </div>
        `,
    };
};

const buildAutoReplyEmail = ({ name, subject }) => ({
    subject: `Thanks for reaching out, ${name}`,
    html: `
        <div style="margin:0;background:#f8fafc;padding:32px;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
            <div style="max-width:620px;margin:0 auto;border-radius:24px;overflow:hidden;background:#ffffff;border:1px solid #e2e8f0;">
                <div style="padding:28px 28px 20px;background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%);color:#ffffff;">
                    <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#fde68a;">Message received</div>
                    <h1 style="margin:16px 0 8px;font-size:28px;line-height:1.1;">Thanks, ${escapeHtml(name)}</h1>
                    <p style="margin:0;color:#dbeafe;">Your message about "${escapeHtml(subject)}" is in my inbox.</p>
                </div>
                <div style="padding:28px;">
                    <p style="margin:0 0 12px;line-height:1.7;color:#334155;">I received your message through my portfolio contact form and will get back to you as soon as possible.</p>
                    <p style="margin:0;line-height:1.7;color:#334155;">If your enquiry is urgent, you can also reply directly to this email thread.</p>
                </div>
            </div>
        </div>
    `,
});

const sendContactEmails = async (contactMessage) => {
    const config = getMailConfig();
    const transporter = createTransporter();

    if (!config.isMailConfigured || !transporter) {
        return {
            delivered: false,
            reason: 'Email transport is not configured. Set SMTP_USER and SMTP_PASS to enable delivery.',
        };
    }

    try {
        const ownerEmail = buildOwnerEmail(contactMessage);
        const autoReplyEmail = buildAutoReplyEmail(contactMessage);
        const from = `"${config.CONTACT_FROM_NAME}" <${config.SMTP_USER}>`;

        await transporter.sendMail({
            from,
            to: config.CONTACT_TO_EMAIL,
            replyTo: contactMessage.email,
            subject: ownerEmail.subject,
            html: ownerEmail.html,
        });

        await transporter.sendMail({
            from,
            to: contactMessage.email,
            replyTo: config.CONTACT_TO_EMAIL,
            subject: autoReplyEmail.subject,
            html: autoReplyEmail.html,
        });

        return { delivered: true, reason: '' };
    } catch (error) {
        return {
            delivered: false,
            reason: error instanceof Error ? error.message : 'Unknown SMTP delivery error.',
        };
    }
};

const isMailConfigured = () => getMailConfig().isMailConfigured;
const getContactRecipient = () => getMailConfig().CONTACT_TO_EMAIL;

export {
    getContactRecipient,
    getMailHealth,
    isMailConfigured,
    sendContactEmails,
};
