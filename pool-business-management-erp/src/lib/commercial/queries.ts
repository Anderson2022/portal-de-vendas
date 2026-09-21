import { backendData } from "@/lib/backend/data";
import { quotesList, salesList } from "@/lib/queries";
export async function formOptions() { const data=await backendData(); return {customers:data.cust,sellers:data.sell,products:data.prods}; }
export async function commercialQuotes(){const [quotes,data]=await Promise.all([quotesList(),backendData()]);return quotes.map(q=>({...q,items:data.qItems.filter(i=>i.quoteId===q.id),saleNumber:q.convertedSaleId}));}
export async function commercialSales(){const [sales,data]=await Promise.all([salesList(),backendData()]);return sales.map(s=>{const entries=data.recv.filter(r=>r.saleId===s.id);return {...s,paid:entries.length>0&&entries.every(r=>r.status==="RECEBIDO"),received:entries.filter(r=>r.status==="RECEBIDO").reduce((sum,r)=>sum+Number(r.amount),0),outstanding:entries.filter(r=>r.status!=="RECEBIDO").reduce((sum,r)=>sum+Number(r.amount),0)};});}
export type CommercialQuote = Awaited<ReturnType<typeof commercialQuotes>>[number];
export type CommercialSale = Awaited<ReturnType<typeof commercialSales>>[number];
