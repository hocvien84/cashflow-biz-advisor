import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateLead,
  recordLeadConsultation,
  registerOrUpdateLead,
} from '@/lib/db';

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

    await pushLeadToWebhook(
      {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        capitalBudgetMilVND: user.capitalBudgetMilVND,
        targetArea: user.targetArea,
      },
      body.webhookUrl
    );

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
