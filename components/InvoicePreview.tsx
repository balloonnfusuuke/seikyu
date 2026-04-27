"use client";

import { Dispatch, SetStateAction } from "react";
import { InvoiceData, LineItem } from "@/types/invoice";

type Props = {
  data: InvoiceData;
  setData: Dispatch<SetStateAction<InvoiceData>>;
};

const lineAmount = (item: LineItem) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
const toNumberFromInput = (value: string) => {
  const onlyDigits = value.replace(/[^\d]/g, "");
  const normalized = onlyDigits.replace(/^0+(?=\d)/, "");
  return normalized === "" ? 0 : Number(normalized);
};
const formatInt = (value: number) => ((Number(value) || 0) === 0 ? "" : (Number(value) || 0).toLocaleString());

export default function InvoicePreview({ data, setData }: Props) {
  const subtotal = data.lineItems.reduce((sum, item) => sum + lineAmount(item), 0);
  const taxAmount = Math.round((subtotal * (Number(data.taxRate) || 0)) / (100 + (Number(data.taxRate) || 0)));
  const total = subtotal;
  const fs = (base: number, scalePercent: number) => `${Math.round(base * ((Number(scalePercent) || 100) / 100) * 100) / 100}px`;
  const updateField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };
  const updateLineItem = (id: string, key: keyof LineItem, value: string | number) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    }));
  };
  const addRow = () => {
    setData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 }]
    }));
  };
  const removeRow = (id: string) => {
    setData((prev) => {
      if (prev.lineItems.length <= 1) return prev;
      return { ...prev, lineItems: prev.lineItems.filter((item) => item.id !== id) };
    });
  };

  return (
    <section className="print-area bg-white p-[15mm] shadow-lg">
      <div className="text-right leading-relaxed" style={{ fontSize: fs(14, data.fontSizeHeader) }}>
        <p>
          <input
            className="preview-input w-44 text-right"
            type="text"
            value={data.issueDate}
            onChange={(e) => updateField("issueDate", e.target.value)}
            aria-label="発行日"
            placeholder="2026年4月27日"
          />
        </p>
        <p>
          請求番号：
          <input
            className="preview-input w-40 text-right"
            value={data.invoiceNumber}
            onChange={(e) => updateField("invoiceNumber", e.target.value)}
            placeholder="INV-202601-001"
          />
        </p>
      </div>

      <h1 className="mt-8 text-center font-bold" style={{ fontSize: fs(26, data.fontSizeTitle) }}>
        請求書
      </h1>

      <div className="mt-6 flex justify-between gap-4">
        <div className="w-[58%]">
          <p className="inline-block border-b border-black font-bold" style={{ fontSize: fs(20, data.fontSizeClient) }}>
            <input
              className="preview-input min-w-32"
              value={data.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              placeholder="株式会社YMG"
            />{" "}
            様
          </p>
          <p className="mt-3 whitespace-pre-line" style={{ fontSize: fs(14, data.fontSizeBody) }}>
            件名：
            <textarea
              className="preview-input mt-1 block w-full resize-none"
              rows={2}
              value={data.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              placeholder="交通費と会場スタッフとしての作業費を下記の通りご請求申し上げます。"
            />
          </p>
        </div>
        <div className="ml-6 w-[40%] leading-relaxed" style={{ fontSize: fs(14, data.fontSizeBody) }}>
          <p>
            <input
              className="preview-input w-full text-left"
              value={data.issuerName}
              onChange={(e) => updateField("issuerName", e.target.value)}
              placeholder="山田太郎"
            />
          </p>
          <p className="inline-flex w-full items-baseline justify-start gap-1">
            <span>〒</span>
            <input
              className="preview-input w-32 text-left"
              value={data.issuerPostalCode}
              onChange={(e) => updateField("issuerPostalCode", e.target.value)}
              placeholder="100-0001"
            />
          </p>
          <p>
            <input
              className="preview-input w-full text-left"
              value={data.issuerAddress}
              onChange={(e) => updateField("issuerAddress", e.target.value)}
              placeholder="東京都千代田区丸の内1-1-1"
            />
          </p>
          <p className="inline-flex w-full items-baseline justify-start gap-1">
            <span>TEL:</span>
            <input
              className="preview-input w-36 text-left"
              value={data.issuerTel}
              onChange={(e) => updateField("issuerTel", e.target.value)}
              placeholder="090-1234-5678"
            />
          </p>
        </div>
      </div>

      <div className="mt-6 inline-flex items-baseline gap-3 border-b border-black pb-1">
        <span className="font-bold" style={{ fontSize: fs(16, data.fontSizeTotal) }}>
          ご請求金額
        </span>
        <span className="font-bold" style={{ fontSize: fs(24, data.fontSizeTotal) }}>
          {total.toLocaleString()}円
        </span>
      </div>

      <p className="mt-4" style={{ fontSize: fs(14, data.fontSizeBody) }}>
        お支払い期限：
        <input
          className="preview-input w-44"
          type="text"
          value={data.dueDate}
          onChange={(e) => updateField("dueDate", e.target.value)}
          aria-label="支払い期限"
          placeholder="2026年5月15日"
        />
      </p>

      <table className="mt-6 w-full border-collapse" style={{ fontSize: fs(14, data.fontSizeTable) }}>
        <thead>
          <tr className="bg-gray-200">
            <th className="w-[60%] border border-gray-400 px-2 py-1 text-center font-medium">品番・品名</th>
            <th className="w-[10%] border border-gray-400 px-2 py-1 text-center font-medium">数量</th>
            <th className="w-[15%] border border-gray-400 px-2 py-1 text-center font-medium">単価</th>
            <th className="w-[15%] border border-gray-400 px-2 py-1 text-center font-medium">金額</th>
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-400 px-2 py-1">
                <input
                  className="preview-input w-full"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  placeholder="品番・品名"
                />
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                <input
                  className="preview-input w-full text-right"
                  type="text"
                  inputMode="numeric"
                  value={item.quantity === 0 ? "" : String(item.quantity)}
                  onChange={(e) => updateLineItem(item.id, "quantity", toNumberFromInput(e.target.value))}
                  placeholder="2"
                />
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                <input
                  className="preview-input w-full text-right"
                  type="text"
                  inputMode="numeric"
                  value={formatInt(item.unitPrice)}
                  onChange={(e) => updateLineItem(item.id, "unitPrice", toNumberFromInput(e.target.value))}
                  placeholder="1,000"
                />
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">{lineAmount(item).toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td className="border-0 p-0" colSpan={2} />
            <td className="border border-gray-400 px-2 py-1">小計</td>
            <td className="border border-gray-400 px-2 py-1 text-right">{subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border-0 p-0" colSpan={2} />
            <td className="border border-gray-400 px-2 py-1 whitespace-nowrap">消費税({data.taxRate}%内税)</td>
            <td className="border border-gray-400 px-2 py-1 text-right">{taxAmount.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="border-0 p-0" colSpan={2} />
            <td className="border border-gray-400 px-2 py-1 font-bold" style={{ fontSize: fs(15, data.fontSizeTable) }}>
              合計
            </td>
            <td className="border border-gray-400 px-2 py-1 text-right font-bold" style={{ fontSize: fs(15, data.fontSizeTable) }}>
              {total.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="no-print mb-2 flex justify-end gap-2 text-xs">
        <button type="button" className="rounded border px-2 py-1" onClick={addRow}>
          ＋行
        </button>
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => removeRow(data.lineItems[data.lineItems.length - 1].id)}
        >
          －行
        </button>
      </div>

      <div className="mt-6" style={{ fontSize: fs(14, data.fontSizeBank) }}>
        <p>
          お振込先：
          <input
            className="preview-input w-32"
            value={data.bankName}
            onChange={(e) => updateField("bankName", e.target.value)}
            placeholder="みらい銀行"
          />{" "}
          <input
            className="preview-input w-28"
            value={data.branchName}
            onChange={(e) => updateField("branchName", e.target.value)}
            placeholder="東京支店"
          />
        </p>
        <p className="ml-16">
          口座番号
          <input
            className="preview-input w-24"
            value={data.accountNumber}
            onChange={(e) => updateField("accountNumber", e.target.value)}
            placeholder="1234567"
          />{" "}
          <input
            className="preview-input w-36"
            value={data.accountHolder}
            onChange={(e) => updateField("accountHolder", e.target.value)}
            placeholder="ヤマダタロウ"
          />
        </p>
      </div>
    </section>
  );
}
