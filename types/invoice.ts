export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceData = {
  issueDate: string;
  invoiceNumber: string;
  clientName: string;
  subject: string;
  dueDate: string;
  issuerName: string;
  issuerPostalCode: string;
  issuerAddress: string;
  issuerTel: string;
  lineItems: LineItem[];
  taxRate: number;
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountHolder: string;
  fontSizeHeader: number;
  fontSizeTitle: number;
  fontSizeClient: number;
  fontSizeBody: number;
  fontSizeTable: number;
  fontSizeTotal: number;
  fontSizeBank: number;
};
