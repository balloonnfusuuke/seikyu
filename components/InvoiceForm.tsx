"use client";

import { Dispatch, SetStateAction } from "react";
import { InvoiceData, LineItem } from "@/types/invoice";

type Props = {
  data: InvoiceData;
  setData: Dispatch<SetStateAction<InvoiceData>>;
};

const createLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unitPrice: 0
});

export default function InvoiceForm({ data, setData }: Props) {
  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateLineItem = (id: string, key: keyof LineItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    }));
  };

  const addLine = () => {
    setData((prev) => ({ ...prev, lineItems: [...prev.lineItems, createLineItem()] }));
  };

  const removeLine = (id: string) => {
    setData((prev) => {
      if (prev.lineItems.length <= 1) return prev;
      return { ...prev, lineItems: prev.lineItems.filter((item) => item.id !== id) };
    });
  };

  return (
    <section className="no-print rounded-md bg-white p-4 shadow">
      <h2 className="mb-4 text-lg font-bold">入力フォーム</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          発行日
          <input className="rounded border p-2" type="date" value={data.issueDate} onChange={(e) => updateField("issueDate", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          請求番号
          <input className="rounded border p-2" value={data.invoiceNumber} onChange={(e) => updateField("invoiceNumber", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          宛先会社名
          <input className="rounded border p-2" value={data.clientName} onChange={(e) => updateField("clientName", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          件名
          <textarea className="rounded border p-2" rows={3} value={data.subject} onChange={(e) => updateField("subject", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          お支払い期限
          <input className="rounded border p-2" type="date" value={data.dueDate} onChange={(e) => updateField("dueDate", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          氏名・会社名
          <input className="rounded border p-2" value={data.issuerName} onChange={(e) => updateField("issuerName", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          郵便番号
          <input className="rounded border p-2" value={data.issuerPostalCode} onChange={(e) => updateField("issuerPostalCode", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          住所
          <input className="rounded border p-2" value={data.issuerAddress} onChange={(e) => updateField("issuerAddress", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm md:col-span-2">
          電話番号
          <input className="rounded border p-2" type="tel" value={data.issuerTel} onChange={(e) => updateField("issuerTel", e.target.value)} />
        </label>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 font-semibold">明細行</h3>
        <div className="space-y-2">
          {data.lineItems.map((item) => {
            const amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
            return (
              <div key={item.id} className="grid grid-cols-12 gap-2">
                <input
                  className="col-span-5 rounded border p-2 text-sm"
                  placeholder="品番・品名"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                />
                <input
                  className="col-span-2 rounded border p-2 text-sm"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", Number(e.target.value) || 0)}
                />
                <input
                  className="col-span-2 rounded border p-2 text-sm"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, "unitPrice", Number(e.target.value) || 0)}
                />
                <div className="col-span-2 rounded border bg-gray-50 p-2 text-right text-sm">{amount.toLocaleString()}</div>
                <button type="button" className="col-span-1 rounded border text-xs" onClick={() => removeLine(item.id)}>
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <button type="button" className="mt-3 rounded bg-gray-900 px-3 py-2 text-sm text-white" onClick={addLine}>
          ＋行を追加
        </button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm">
          消費税率（%）
          <input
            className="rounded border p-2"
            type="number"
            value={data.taxRate}
            onChange={(e) => updateField("taxRate", Number(e.target.value) || 0)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          ヘッダー文字（{data.fontSizeHeader}%）
          <input
            type="range"
            min={70}
            max={140}
            step={1}
            value={data.fontSizeHeader}
            onChange={(e) => updateField("fontSizeHeader", Number(e.target.value) || 100)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          タイトル文字（{data.fontSizeTitle}%）
          <input type="range" min={70} max={140} step={1} value={data.fontSizeTitle} onChange={(e) => updateField("fontSizeTitle", Number(e.target.value) || 100)} />
        </label>
        <label className="grid gap-1 text-sm">
          宛先文字（{data.fontSizeClient}%）
          <input
            type="range"
            min={70}
            max={140}
            step={1}
            value={data.fontSizeClient}
            onChange={(e) => updateField("fontSizeClient", Number(e.target.value) || 100)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          本文文字（{data.fontSizeBody}%）
          <input type="range" min={70} max={140} step={1} value={data.fontSizeBody} onChange={(e) => updateField("fontSizeBody", Number(e.target.value) || 100)} />
        </label>
        <label className="grid gap-1 text-sm">
          表文字（{data.fontSizeTable}%）
          <input
            type="range"
            min={70}
            max={140}
            step={1}
            value={data.fontSizeTable}
            onChange={(e) => updateField("fontSizeTable", Number(e.target.value) || 100)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          金額文字（{data.fontSizeTotal}%）
          <input
            type="range"
            min={70}
            max={140}
            step={1}
            value={data.fontSizeTotal}
            onChange={(e) => updateField("fontSizeTotal", Number(e.target.value) || 100)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          振込先文字（{data.fontSizeBank}%）
          <input type="range" min={70} max={140} step={1} value={data.fontSizeBank} onChange={(e) => updateField("fontSizeBank", Number(e.target.value) || 100)} />
        </label>
        <label className="grid gap-1 text-sm">
          銀行名
          <input className="rounded border p-2" value={data.bankName} onChange={(e) => updateField("bankName", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          支店名
          <input className="rounded border p-2" value={data.branchName} onChange={(e) => updateField("branchName", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          口座番号
          <input className="rounded border p-2" value={data.accountNumber} onChange={(e) => updateField("accountNumber", e.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          口座名義（カタカナ）
          <input className="rounded border p-2" value={data.accountHolder} onChange={(e) => updateField("accountHolder", e.target.value)} />
        </label>
      </div>

      <button type="button" className="mt-5 rounded bg-blue-600 px-4 py-2 text-white" onClick={() => window.print()}>
        印刷 / PDF保存
      </button>
    </section>
  );
}
