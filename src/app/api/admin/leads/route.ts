import { NextRequest, NextResponse } from 'next/server';
import { getAllLeadsFromDb } from '@/lib/db';

const ADMIN_EMAIL_WHITELIST = ['nghvien@gmail.com', 'vien.nguyenh@gmail.com'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminEmail = String(body.adminEmail || '')
      .trim()
      .toLowerCase();
    const adminPassword = String(body.adminPassword || '').trim();
    const expectedPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();

    if (!ADMIN_EMAIL_WHITELIST.includes(adminEmail)) {
      return NextResponse.json(
        {
          error:
            'Tài khoản của bạn không có quyền Quản trị viên (Chỉ nghvien@gmail.com và vien.nguyenh@gmail.com được cấp quyền).',
        },
        { status: 403 }
      );
    }

    if (adminPassword !== expectedPassword) {
      return NextResponse.json(
        { error: 'Mật khẩu Quản trị viên (Admin) không chính xác.' },
        { status: 401 }
      );
    }

    const leads = getAllLeadsFromDb();
    return NextResponse.json({
      success: true,
      leads,
      envStatus: {
        hasGmailSmtp: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
        gmailUser: process.env.GMAIL_USER || '',
        hasResendApi: Boolean(process.env.RESEND_API_KEY),
        hasWebhookUrl: Boolean(process.env.LEAD_WEBHOOK_URL),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Lỗi tải danh sách Lead.' },
      { status: 500 }
    );
  }
}
