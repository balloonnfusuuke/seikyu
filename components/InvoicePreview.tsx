"use client";

import { InvoiceData, LineItem } from "@/types/invoice";

type Props = {
  data: InvoiceData;
};

const toJapaneseDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const lineAmount = (item: LineItem) => (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

export default function InvoicePreview({ data }: Props) {
  const subtotal = data.lineItems.reduce((sum, item) => sum + lineAmount(item), 0);
  const taxAmount = Math.round((subtotal * (Number(data.taxRate) || 0)) / (100 + (Number(data.taxRate) || 0)));
  const total = subtotal;
  const fs = (base: number, scalePercent: number) => `${Math.round(base * ((Number(scalePercent) || 100) / 100) * 100) / 100}px`;

  return (
    <section className="print-area bg-white p-[15mm] shadow-lg">
      <div className="text-right leading-relaxed" style={{ fontSize: fs(14, data.fontSizeHeader) }}>
        <p>{toJapaneseDate(data.issueDate)}</p>
        <p>請求番号：{data.invoiceNumber}</p>
      </div>

      <h1 className="mt-8 text-center font-bold" style={{ fontSize: fs(26, data.fontSizeTitle) }}>
        請求書
      </h1>

      <div className="mt-6 flex justify-between gap-4">
        <div className="w-[58%]">
          <p className="inline-block border-b border-black font-bold" style={{ fontSize: fs(20, data.fontSizeClient) }}>
            {data.clientName} 様
          </p>
          <p className="mt-3 whitespace-pre-line" style={{ fontSize: fs(14, data.fontSizeBody) }}>
            件名：{data.subject}
          </p>
        </div>
        <div className="w-[40%] text-right leading-relaxed" style={{ fontSize: fs(14, data.fontSizeBody) }}>
          <p>{data.issuerName}</p>
          <p>〒{data.issuerPostalCode}</p>
          <p>{data.issuerAddress}</p>
          <p>TEL:{data.issuerTel}</p>
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
        お支払い期限：{toJapaneseDate(data.dueDate)}
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
              <td className="border border-gray-400 px-2 py-1">{item.description}</td>
              <td className="border border-gray-400 px-2 py-1 text-right">{(Number(item.quantity) || 0).toLocaleString()}</td>
              <td className="border border-gray-400 px-2 py-1 text-right">{(Number(item.unitPrice) || 0).toLocaleString()}</td>
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

      <div className="mt-6" style={{ fontSize: fs(14, data.fontSizeBank) }}>
        <p>
          お振込先：{data.bankName} {data.branchName}
        </p>
        <p className="ml-24">
          口座番号{data.accountNumber} {data.accountHolder}
        </p>
      </div>
    </section>
  );
}
