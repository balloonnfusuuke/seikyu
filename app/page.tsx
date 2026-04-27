"use client";

import { useState } from "react";
import InvoiceForm from "@/components/InvoiceForm";
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

  return (
    <main className="print-root min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto grid max-w-[1700px] gap-4 lg:grid-cols-[560px_1fr]">
        <InvoiceForm data={invoiceData} setData={setInvoiceData} />
        <InvoicePreview data={invoiceData} />
      </div>
    </main>
  );
}
