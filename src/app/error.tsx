'use client';

import React, { useEffect } from 'react';

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Automatically recover if triggered by Chrome Google Translate DOM mutation (removeChild / insertBefore)
    const msg = error?.message || '';
    if (
      msg.includes('removeChild') ||
      msg.includes('insertBefore') ||
      msg.includes('NotFoundError')
    ) {
      reset();
    }
  }, [error, reset]);

  return (
    <div
      className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 notranslate"
      translate="no"
    >
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
        <div className="text-base font-bold text-emerald-400">
          Hệ thống đang đồng bộ lại giao diện
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Trình duyệt của bạn đang bật tự động dịch trang (Google Translate) hoặc tiện ích mở rộng
          làm thay đổi nút bấm. Hệ thống đã giữ nguyên toàn bộ dữ liệu của bạn.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
        >
          Tiếp tục ngay (Không mất dữ liệu)
        </button>
      </div>
    </div>
  );
}
