"use client";

import { useEffect, useState } from "react";
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

  return (
    <main className="print-root min-h-screen bg-gray-100 p-4 md:p-6">
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
      <div className="mx-auto max-w-[1100px]">
        <InvoicePreview data={invoiceData} setData={setInvoiceData} />
      </div>
    </main>
  );
}
