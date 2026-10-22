import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  authenticateLead,
  recordLeadConsultation,
  registerOrUpdateLead,
} from '@/lib/db';

async function notifyOwnerNewLeadEmail(lead: {
  fullName: string;
  email: string;
  phone: string;
  capitalBudgetMilVND: number;
  targetArea: string;
}) {
  const gmailUser = (process.env.GMAIL_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();
  if (!gmailUser || !gmailPass) return;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const notifyTo = (process.env.ADMIN_NOTIFY_EMAIL || gmailUser).trim();
    const timeVN = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    await transporter.sendMail({
      from: `"Cashflow CRM Lead Alert" <${gmailUser}>`,
      to: notifyTo,
      subject: `🔥 [Lead Mới] ${lead.fullName} (${lead.phone || lead.email}) — Vốn ${lead.capitalBudgetMilVND}Tr`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #10b981; border-radius: 10px; overflow: hidden;">
          <div style="background: #065f46; color: white; padding: 16px 20px;">
            <h3 style="margin: 0;">🎯 Khách Hàng Mới Vừa Đăng Ký Trên Cashflow Biz Advisor</h3>
          </div>
          <div style="padding: 20px; background: #ffffff; color: #1e293b; line-height: 1.6;">
            <p><strong>👤 Họ và tên:</strong> ${lead.fullName}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
            <p><strong>📱 Số điện thoại / Zalo:</strong> <strong style="color: #059669; font-size: 16px;">${lead.phone || 'Chưa nhập'}</strong></p>
            <p><strong>💰 Vốn đầu tư dự kiến:</strong> ${lead.capitalBudgetMilVND.toLocaleString('vi-VN')} Triệu VNĐ</p>
            <p><strong>📍 Khu vực dự định kinh doanh:</strong> ${lead.targetArea || 'Đang chọn trên bản đồ'}</p>
            <p><strong>⏰ Thời gian đăng ký:</strong> ${timeVN}</p>
          </div>
        </div>
      `,
    });
  } catch {
    // Non-blocking notification
  }
}

async function pushLeadToWebhook(payload: Record<string, unknown>, customWebhookUrl?: string) {
  const url = customWebhookUrl || process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'lead_captured',
        timestamp: new Date().toISOString(),
        ...payload,
      }),
      signal: AbortSignal.timeout(4000),
    });
  } catch {
    // Non-blocking webhook push
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = (body.action || 'register') as 'register' | 'login' | 'sync';

    if (action === 'login') {
      const email = String(body.email || '').trim();
      const password = String(body.password || '').trim();
      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { error: 'Vui lòng nhập địa chỉ Email hợp lệ.' },
          { status: 400 }
        );
      }

      const auth = authenticateLead(email, password || undefined);
      if (!auth.success || !auth.user) {
        return NextResponse.json(
          { error: auth.message || 'Đăng nhập không thành công.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: auth.user,
      });
    }

    if (action === 'sync') {
      const email = String(body.email || '').trim();
      if (!email) {
        return NextResponse.json({ error: 'Thiếu email' }, { status: 400 });
      }
      const updated = recordLeadConsultation({
        email,
        fullName: body.fullName,
        phone: body.phone,
        capitalBudgetMilVND: body.capitalBudgetMilVND,
        scannedLocation: body.scannedLocation,
        recommendedModels: body.recommendedModels,
      });
      return NextResponse.json({ success: true, user: updated });
    }

    // Default: action === 'register'
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const password = String(body.password || '123456').trim();
    const capitalBudgetMilVND = Number(body.capitalBudgetMilVND) || 500;
    const targetArea = String(body.targetArea || '').trim();

    if (!fullName || !email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Họ tên và địa chỉ Email hợp lệ để tạo tài khoản nhận báo cáo.' },
        { status: 400 }
      );
    }

    const user = registerOrUpdateLead({
      fullName,
      email,
      phone,
      password,
      capitalBudgetMilVND,
      targetArea,
    });

    await Promise.allSettled([
      pushLeadToWebhook(
        {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          capitalBudgetMilVND: user.capitalBudgetMilVND,
          targetArea: user.targetArea,
        },
        body.webhookUrl
      ),
      notifyOwnerNewLeadEmail({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        capitalBudgetMilVND: user.capitalBudgetMilVND,
        targetArea: user.targetArea,
      }),
    ]);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Lỗi xử lý tài khoản.' },
      { status: 500 }
    );
  }
}
