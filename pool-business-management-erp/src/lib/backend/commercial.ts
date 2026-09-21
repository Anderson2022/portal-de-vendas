import { api } from "./client";
import { validateDocument,cents,type DocumentInput } from "../commercial/domain";
type QuoteResponse={quote:{id:string}};
type SaleResponse={sale:{id:string}};
function payload(input:DocumentInput){
  const total=validateDocument(input);
  return {customerId:input.customerId,salespersonId:input.salespersonId || null,project:input.project.trim(),notes:input.notes.trim(),validUntil:input.validUntil || null,discount:total.discount/100,items:input.items.map(i=>({productId:i.productId || null,description:i.description.trim(),quantity:Number(i.qty),unitPrice:cents(i.unitPrice)/100,unitCost:cents(i.unitCost)/100})),costs:[],payments:[{amount:total.total/100,dueDate:input.dueDate,paymentMethod:input.paymentMethod || "PIX"}]};
}
export async function saveQuote(input:DocumentInput,id?:string){
  const response=await api<QuoteResponse>(id?`/quotes/${id}`:"/quotes",{method:id?"PUT":"POST",body:JSON.stringify(payload(input))});return response.quote.id;
}
export async function saveSale(input:DocumentInput){
  const response=await api<SaleResponse>(`/sales/register?paid=${Boolean(input.paid)}`,{method:"POST",body:JSON.stringify(payload(input))});return response.sale.id;
}
export async function convertQuote(id:string,payment:{paymentMethod:string;paid:boolean;dueDate:string}){
  const response=await api<SaleResponse>(`/quotes/${id}/convert`,{method:"POST",body:JSON.stringify(payment)});return response.sale.id;
}
export async function setQuoteStatus(id:string,status:string){
  const translated=({ORCAMENTO:"DRAFT",NEGOCIACAO:"NEGOTIATION",CANCELADO:"REJECTED"} as Record<string,string>)[status];
  if(!translated)throw new Error("Status inválido.");
  await api(`/quotes/${id}/status?status=${translated}`,{method:"PATCH"});
}
