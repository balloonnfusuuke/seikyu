"use client";

import { useEffect, useMemo, useState } from "react";
import InvoicePreview from "@/components/InvoicePreview";
import { InvoiceData } from "@/types/invoice";

const initialData: InvoiceData = {
  issueDate: "",
  invoiceNumber: "",
  clientName: "",
  subject: "",
  dueDate: "",
  issuerName: "",
  issuerPostalCode: "",
  issuerAddress: "",
  issuerTel: "",
  lineItems: [{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }],
  taxRate: 10,
  bankName: "",
  branchName: "",
  accountNumber: "",
  accountHolder: "",
  fontSizeHeader: 100,
  fontSizeTitle: 100,
  fontSizeClient: 100,
  fontSizeBody: 100,
  fontSizeTable: 100,
  fontSizeTotal: 100,
  fontSizeBank: 100
};

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialData);
  const [savedAt, setSavedAt] = useState<string>("");
  const [shareCode, setShareCode] = useState<string>("");
  const [shareMessage, setShareMessage] = useState<string>("");
  const isInAppBrowser = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return /Line\//i.test(ua) || /FBAN|FBAV|Instagram|Twitter/i.test(ua);
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem("invoice-draft-v1");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as InvoiceData;
      if (!parsed || !Array.isArray(parsed.lineItems)) return;
      setInvoiceData(parsed);
    } catch {
      // ignore broken localStorage data
    }
  }, []);

  const saveDraft = () => {
    window.localStorage.setItem("invoice-draft-v1", JSON.stringify(invoiceData));
    setSavedAt(new Date().toLocaleString("ja-JP"));
  };

  const clearDraft = () => {
    window.localStorage.removeItem("invoice-draft-v1");
    setInvoiceData(initialData);
    setSavedAt("");
  };

  const toShareCode = (data: InvoiceData) => {
    const json = JSON.stringify(data);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    return btoa(binary);
  };

  const fromShareCode = (code: string) => {
    const binary = atob(code.trim());
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as InvoiceData;
    if (!parsed || !Array.isArray(parsed.lineItems)) {
      throw new Error("invalid share code");
    }
    return parsed;
  };

  const createShareCode = async () => {
    const code = toShareCode(invoiceData);
    setShareCode(code);
    try {
      await navigator.clipboard.writeText(code);
      setShareMessage("共有コードをコピーしました。");
    } catch {
      setShareMessage("共有コードを作成しました。下の欄からコピーしてください。");
    }
  };

  const applyShareCode = () => {
    try {
      const parsed = fromShareCode(shareCode);
      setInvoiceData(parsed);
      setShareMessage("共有コードを読み込みました。");
    } catch {
      setShareMessage("共有コードの形式が不正です。");
    }
  };

  return (
    <main className="print-root min-h-screen bg-gray-100 p-4 md:p-6">
      {isInAppBrowser ? (
        <div className="no-print mx-auto mb-3 max-w-[1100px] rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p>LINEなどのアプリ内ブラウザでは、PDF保存と一時保存が正常に動かない場合があります。</p>
          <p className="mt-1">右上メニューから「外部ブラウザで開く」でご利用ください。</p>
          <button
            type="button"
            className="mt-2 rounded border border-amber-400 bg-white px-3 py-1 text-xs"
            onClick={() => window.open(window.location.href, "_blank", "noopener,noreferrer")}
          >
            新しいタブで開く
          </button>
        </div>
      ) : null}
      <div className="no-print mx-auto mb-3 flex max-w-[1100px] flex-wrap items-center gap-2">
        <button type="button" className="rounded bg-gray-900 px-3 py-2 text-sm text-white" onClick={saveDraft}>
          一時保存
        </button>
        <button type="button" className="rounded border border-gray-400 px-3 py-2 text-sm" onClick={clearDraft}>
          初期化
        </button>
        <button type="button" className="rounded bg-blue-600 px-3 py-2 text-sm text-white" onClick={() => window.print()}>
          印刷 / PDF保存
        </button>
        {savedAt ? <span className="text-xs text-gray-600">保存: {savedAt}</span> : null}
      </div>
      <div className="no-print mx-auto mb-3 max-w-[1100px] rounded border bg-white p-3">
        <p className="mb-2 text-sm font-medium">共有コード（LINE内ブラウザ→外部ブラウザ移行用）</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded border border-gray-400 px-3 py-2 text-sm" onClick={createShareCode}>
            共有コードを作成
          </button>
          <button type="button" className="rounded border border-gray-400 px-3 py-2 text-sm" onClick={applyShareCode}>
            共有コードを読み込み
          </button>
        </div>
        <textarea
          className="mt-2 w-full rounded border p-2 text-xs"
          rows={3}
          value={shareCode}
          onChange={(e) => setShareCode(e.target.value)}
          placeholder="ここに共有コードが表示されます。外部ブラウザに貼り付けて読み込みできます。"
        />
        {shareMessage ? <p className="mt-1 text-xs text-gray-600">{shareMessage}</p> : null}
      </div>
      <div className="mx-auto max-w-[1100px]">
        <InvoicePreview data={invoiceData} setData={setInvoiceData} />
      </div>
    </main>
  );
}
