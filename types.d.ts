export interface TableDatasSchema {
  Status: string
  ID: number
  Data: string
  Nome: string
  Email: string
  ["Forma de Pagamento"]: string
  ["Valor (R$)"]: string
  ["Cliente Novo"]: string
}

export interface TableDataFormatted {
  status: string
  nome: string
  email: string
  value: string
  paymentOption: string
  date: string
}

interface TransactionInformations {
  allPaid: number
  allRefused: number
  allStatusPaymentPending: number
  allReversed: number
}
