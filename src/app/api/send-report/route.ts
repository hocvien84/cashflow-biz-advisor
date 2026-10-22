import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateAdvisoryPdfBase64 } from '@/lib/pdf-generator';
import { recordLeadConsultation } from '@/lib/db';
import {
  AreaIntelligenceRecord,
  IkigaiUserInput,
  ScoredRecommendation,
} from '@/types/business';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user,
      areaRecord,
      ikigai,
      recommendations,
      customSimParams,
      smtpConfig,
    }: {
      user: { fullName: string; email: string; phone?: string };
      areaRecord: AreaIntelligenceRecord | null;
      ikigai: IkigaiUserInput;
      recommendations: ScoredRecommendation[];
      customSimParams?: {
        capitalMil: number;
        monthlyRevMil: number;
        rentPercent: number;
        cogsPercent: number;
        laborPercent: number;
      };
      smtpConfig?: {
        gmailUser?: string;
        gmailAppPassword?: string;
        resendApiKey?: string;
        webhookUrl?: string;
      };
    } = body;

    if (!user?.email || !user.email.includes('@')) {
      return NextResponse.json(
        { error: 'Địa chỉ email người nhận không hợp lệ.' },
        { status: 400 }
      );
    }

    const topRecs = (recommendations || []).slice(0, 5);
    if (topRecs.length === 0) {
      return NextResponse.json(
        { error: 'Chưa có danh sách mô hình tư vấn để tạo báo cáo.' },
        { status: 400 }
      );
    }

    // 1. Generate Vietnamese Unicode PDF Base64
    const pdfBase64 = await generateAdvisoryPdfBase64({
      user: {
        fullName: user.fullName || 'Nhà đầu tư',
        email: user.email,
        phone: user.phone || '',
      },
      areaRecord,
      ikigai,
      recommendations: topRecs,
      customSimParams,
    });

    const cleanSlug = (user.fullName || 'Nha-Dau-Tu')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-');
    const fileName = `Bao-Cao-Tu-Van-Dong-Tien-${cleanSlug}.pdf`;

    // 2. Build Rich HTML Email Body
    const best = topRecs[0];
    const netProfitMil = Math.round(
      (best.model.pnl.avgMonthlyRevenueVND * best.model.pnl.netMarginPercent) / 100
    );
    const locationTitle = areaRecord?.locationName || 'Khu vực mục tiêu của bạn';

    const topRowsHtml = topRecs
      .map(
        (r, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-weight: bold; color: #0f172a;">#${idx + 1}. ${r.model.name}</td>
          <td style="padding: 10px; color: #059669; font-weight: bold;">${r.totalScore}/100</td>
          <td style="padding: 10px; color: #334155;">${r.model.pnl.initialCapexMinVND} - ${r.model.pnl.initialCapexMaxVND} Tr</td>
          <td style="padding: 10px; color: #0f172a; font-weight: bold;">~${Math.round(
            (r.model.pnl.avgMonthlyRevenueVND * r.model.pnl.netMarginPercent) / 100
          )} Tr/tháng (${r.model.pnl.netMarginPercent}%)</td>
          <td style="padding: 10px; color: #475569;">${r.model.pnl.paybackMonthsMin}-${r.model.pnl.paybackMonthsMax} tháng</td>
        </tr>`
      )
      .join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #065f46 100%); color: #ffffff; padding: 24px;">
          <h2 style="margin: 0 0 8px 0; font-size: 20px;">BÁO CÁO TƯ VẤN MÔ HÌNH KINH DOANH KHAI THÁC DÒNG TIỀN</h2>
          <p style="margin: 0; color: #a7f3d0; font-size: 13px;">Ma trận Độ tuổi × Nhu cầu Maslow × Định vị Bản đồ 0.2-2km × Ikigai Nhật Bản</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p>Xin chào <strong>${user.fullName || 'Nhà đầu tư'}</strong>,</p>
          <p>Hệ thống <strong>Cashflow Matrix & Ikigai Biz Advisor</strong> gửi tới bạn Bản Báo Cáo Phân Tích & Tư Vấn Mô Hình Kinh Doanh được cá nhân hóa theo nguồn lực và tọa độ mặt bằng của bạn (<strong>File PDF chi tiết đã được đính kèm trong email này</strong>).</p>

          <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 14px; margin: 16px 0; border-radius: 6px;">
            <p style="margin: 4px 0;">📍 <strong>Khu vực phân tích:</strong> ${locationTitle} ${
      areaRecord ? `(Bán kính ${areaRecord.radiusKm}km)` : ''
    }</p>
            <p style="margin: 4px 0;">💰 <strong>Ngân sách vốn đăng ký:</strong> ${ikigai.capitalBudgetMilVND.toLocaleString(
              'vi-VN'
            )} Triệu VNĐ</p>
            <p style="margin: 4px 0;">🏆 <strong>Mô hình phù hợp số #1:</strong> <span style="color: #059669; font-weight: bold;">${
              best.model.name
            } (${best.totalScore}/100 điểm)</span> — Lãi ròng kỳ vọng ~<strong>${netProfitMil} Triệu/tháng</strong></p>
          </div>

          <h3 style="font-size: 15px; color: #0f172a; margin-top: 22px;">Top 5 Mô Hình Kinh Doanh Đề Xuất Cho Bạn:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
            <thead>
              <tr style="background: #f1f5f9; color: #334155;">
                <th style="padding: 10px;">Mô hình</th>
                <th style="padding: 10px;">Điểm khớp</th>
                <th style="padding: 10px;">Vốn CAPEX</th>
                <th style="padding: 10px;">Lãi ròng dự kiến</th>
                <th style="padding: 10px;">Hoàn vốn</th>
              </tr>
            </thead>
            <tbody>
              ${topRowsHtml}
            </tbody>
          </table>

          <p style="margin-top: 20px; font-size: 13px; color: #475569;">
            📎 <strong>Vui lòng mở file PDF đính kèm (<code>${fileName}</code>)</strong> để xem chi tiết cấu trúc P&L (Giá vốn, Mặt bằng, Nhân sự, Marketing), hình mẫu chuỗi thành công tại Việt Nam & Châu Á, và Kế hoạch hành động 4 bước triển khai.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 14px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Email được gửi tự động từ Hệ thống Tư vấn Mô hình Kinh doanh Dòng tiền (Cashflow Matrix & Ikigai Biz Advisor).
        </div>
      </div>
    `;

    // 3. Attempt Email Delivery via Gmail SMTP or Resend API
    const gmailUser = (smtpConfig?.gmailUser || process.env.GMAIL_USER || '').trim();
    const gmailPass = (smtpConfig?.gmailAppPassword || process.env.GMAIL_APP_PASSWORD || '')
      .replace(/\s+/g, '')
      .trim();
    const resendKey = (smtpConfig?.resendApiKey || process.env.RESEND_API_KEY || '').trim();
    const adminNotifyEmail = (process.env.ADMIN_NOTIFY_EMAIL || gmailUser || '').trim();

    let emailSent = false;
    let deliveryMethod: 'gmail_smtp' | 'resend_api' | 'direct_pdf_only' = 'direct_pdf_only';
    let emailError = '';

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"Cashflow & Ikigai Biz Advisor" <${gmailUser}>`,
          to: user.email,
          bcc: adminNotifyEmail && adminNotifyEmail !== user.email ? adminNotifyEmail : undefined,
          subject: `[Báo Cáo PDF] Tư Vấn Mô Hình Kinh Doanh Dòng Tiền — ${user.fullName || user.email}`,
          html: htmlContent,
          attachments: [
            {
              filename: fileName,
              content: Buffer.from(pdfBase64, 'base64'),
              contentType: 'application/pdf',
            },
          ],
        });
        emailSent = true;
        deliveryMethod = 'gmail_smtp';
      } catch (err) {
        emailError = (err as Error).message || 'Lỗi kết nối Gmail SMTP';
      }
    }

    if (!emailSent && resendKey) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'Cashflow Advisor <onboarding@resend.dev>',
            to: [user.email],
            subject: `[Báo Cáo PDF] Tư Vấn Mô Hình Kinh Doanh Dòng Tiền — ${user.fullName || user.email}`,
            html: htmlContent,
            attachments: [
              {
                filename: fileName,
                content: pdfBase64,
              },
            ],
          }),
        });
        if (resendRes.ok) {
          emailSent = true;
          deliveryMethod = 'resend_api';
        } else {
          const errData = await resendRes.text();
          emailError = `Resend API: ${errData}`;
        }
      } catch (err) {
        emailError = (err as Error).message || 'Lỗi kết nối Resend API';
      }
    }

    // 4. Save consultation & lead history in DB
    const updatedLead = recordLeadConsultation({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      capitalBudgetMilVND: ikigai.capitalBudgetMilVND,
      scannedLocation: areaRecord?.locationName,
      recommendedModels: topRecs.map((r) => r.model.name),
      reportSent: emailSent,
    });

    // 5. Optional Webhook push (Google Sheets / CRM)
    const webhookUrl = smtpConfig?.webhookUrl || process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'report_generated',
            timestamp: new Date().toISOString(),
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            capitalBudgetMilVND: ikigai.capitalBudgetMilVND,
            scannedLocation: areaRecord?.locationName || '',
            topModel1: topRecs[0]?.model.name || '',
            topModel2: topRecs[1]?.model.name || '',
            topModel3: topRecs[2]?.model.name || '',
            emailSent,
          }),
          signal: AbortSignal.timeout(4000),
        });
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      deliveryMethod,
      emailError: emailError || undefined,
      fileName,
      pdfBase64,
      lead: updatedLead,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'Lỗi tạo hoặc gửi báo cáo PDF.' },
      { status: 500 }
    );
  }
}
