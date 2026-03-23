import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}k`;
  return `£${n}`;
}

function formatCurrencyFull(n: number) {
  return "£" + n.toLocaleString("en-GB");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    email,
    revenue_target,
    avg_deal_value,
    close_rate,
    current_conversations,
    conversations_needed,
    gap,
    revenue_gap,
  } = body;

  // ── Supabase insert ──────────────────────────────────────────────────────
  const { error: dbError } = await supabase.from("calculator_submissions").insert({
    email: email.trim().toLowerCase(),
    revenue_target,
    avg_deal_value,
    close_rate,
    current_conversations,
    conversations_needed,
    gap,
    revenue_gap,
  });

  if (dbError) console.error("Supabase error:", dbError);

  // ── Email to user ────────────────────────────────────────────────────────
  const userHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#070B18;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070B18;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;">
          <span style="color:#4F7EFF;font-weight:700;font-size:16px;letter-spacing:-0.3px;">Pipeline Engine</span>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding-bottom:24px;">
          <h1 style="margin:0;color:#E8EEFF;font-size:24px;font-weight:700;line-height:1.3;">
            Your pipeline gap results
          </h1>
          <p style="margin:8px 0 0;color:#8896BB;font-size:15px;line-height:1.6;">
            Here's a summary of what we calculated based on your inputs.
          </p>
        </td></tr>

        <!-- Score card -->
        <tr><td style="background:#0C1226;border:1px solid #1B2B50;border-radius:12px;padding:28px;margin-bottom:20px;">
          <p style="margin:0 0 4px;color:#4F7EFF;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Your pipeline gap</p>
          <p style="margin:0 0 4px;color:#E8EEFF;font-size:48px;font-weight:700;line-height:1;">
            ${conversations_needed}
            <span style="color:#8896BB;font-size:20px;font-weight:400;"> / month</span>
          </p>
          <p style="margin:0;color:#8896BB;font-size:13px;">
            qualified conversations needed to hit ${formatCurrency(revenue_target)} this year
          </p>
        </td></tr>

        <tr><td style="height:16px;"></td></tr>

        <!-- 3 metrics -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${[
                { label: "Needed / month", value: conversations_needed, colour: "#4F7EFF" },
                { label: "Currently having", value: current_conversations, colour: gap > 0 ? "#F87171" : "#34D399" },
                { label: "Gap / month", value: gap, colour: gap > 0 ? "#F87171" : "#34D399" },
              ].map(m => `
                <td width="33%" style="padding:0 6px 0 0;">
                  <div style="background:#0C1226;border:1px solid #1B2B50;border-radius:10px;padding:16px;text-align:center;">
                    <p style="margin:0 0 4px;color:${m.colour};font-size:22px;font-weight:700;">${m.value}</p>
                    <p style="margin:0;color:#8896BB;font-size:11px;line-height:1.4;">${m.label}</p>
                  </div>
                </td>
              `).join("")}
            </tr>
          </table>
        </td></tr>

        ${gap > 0 ? `
        <tr><td style="height:16px;"></td></tr>
        <!-- Revenue impact -->
        <tr><td style="background:#0C1226;border:1px solid #1B2B50;border-radius:12px;padding:24px;text-align:center;">
          <p style="margin:0 0 4px;color:#8896BB;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Revenue left on the table this year</p>
          <p style="margin:0;color:#F87171;font-size:36px;font-weight:700;">${formatCurrencyFull(revenue_gap)}</p>
          <p style="margin:4px 0 0;color:#8896BB;font-size:12px;">Based on your close rate and average deal value</p>
        </td></tr>
        ` : ""}

        <tr><td style="height:16px;"></td></tr>

        <!-- Your inputs -->
        <tr><td style="background:#0C1226;border:1px solid #1B2B50;border-radius:12px;padding:24px;">
          <p style="margin:0 0 16px;color:#8896BB;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">Your inputs</p>
          ${[
            { label: "Revenue target", value: formatCurrency(revenue_target) },
            { label: "Average deal value", value: formatCurrency(avg_deal_value) },
            { label: "Close rate", value: `${close_rate}%` },
            { label: "Current conversations / month", value: current_conversations },
          ].map(r => `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
              <tr>
                <td style="color:#8896BB;font-size:13px;">${r.label}</td>
                <td align="right" style="color:#E8EEFF;font-size:13px;font-weight:600;">${r.value}</td>
              </tr>
            </table>
          `).join("")}
        </td></tr>

        <tr><td style="height:32px;"></td></tr>

        <!-- CTA -->
        <tr><td style="text-align:center;">
          <p style="margin:0 0 20px;color:#8896BB;font-size:14px;line-height:1.6;">
            ${gap === 0
              ? "Your pipeline looks healthy — but let's make sure there's a system behind it that holds up."
              : `A gap of ${gap} conversation${gap === 1 ? "" : "s"} per month is ${formatCurrencyFull(revenue_gap)} left on the table this year. A pipeline system closes this.`
            }
          </p>
          <a href="https://cal.com/gareth-wray/30min" style="display:inline-block;background:#4F7EFF;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 32px;border-radius:8px;">
            Book a free discovery call →
          </a>
        </td></tr>

        <tr><td style="height:40px;"></td></tr>

        <!-- Footer -->
        <tr><td style="border-top:1px solid #1B2B50;padding-top:24px;">
          <p style="margin:0;color:#8896BB;font-size:12px;line-height:1.6;">
            This result was generated by the free Pipeline Gap Calculator at
            <a href="https://calculator.thepipelineengine.com" style="color:#4F7EFF;">calculator.thepipelineengine.com</a>.<br>
            Pipeline Engine · <a href="https://thepipelineengine.com" style="color:#4F7EFF;">thepipelineengine.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  // ── Notification to Gareth ───────────────────────────────────────────────
  const notifyHtml = `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;background:#f4f4f4;padding:24px;">
  <div style="background:#fff;border-radius:8px;padding:24px;max-width:480px;margin:0 auto;">
    <h2 style="margin:0 0 16px;color:#0f172a;">New calculator lead 🎯</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        { label: "Email", value: email },
        { label: "Revenue target", value: formatCurrency(revenue_target) },
        { label: "Deal value", value: formatCurrency(avg_deal_value) },
        { label: "Close rate", value: `${close_rate}%` },
        { label: "Current conversations", value: `${current_conversations}/mo` },
        { label: "Conversations needed", value: `${conversations_needed}/mo` },
        { label: "Gap", value: `${gap}/mo` },
        { label: "Revenue gap", value: formatCurrencyFull(revenue_gap) },
      ].map(r => `
        <tr>
          <td style="padding:6px 0;color:#64748b;font-size:13px;width:50%;">${r.label}</td>
          <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${r.value}</td>
        </tr>
      `).join("")}
    </table>
  </div>
</body>
</html>`;

  try {
    await Promise.all([
      resend.emails.send({
        from: "Pipeline Engine <hello@thepipelineengine.com>",
        to: email,
        subject: `Your pipeline gap: ${conversations_needed} conversations/month needed`,
        html: userHtml,
      }),
      resend.emails.send({
        from: "Pipeline Engine <hello@thepipelineengine.com>",
        to: process.env.NOTIFICATION_EMAIL!,
        subject: `New lead: ${email} — gap of ${gap}/mo (${formatCurrencyFull(revenue_gap)}/yr)`,
        html: notifyHtml,
      }),
    ]);
  } catch (err) {
    console.error("Resend error:", err);
  }

  return NextResponse.json({ ok: true });
}
