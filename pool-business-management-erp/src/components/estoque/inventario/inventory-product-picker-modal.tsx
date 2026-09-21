"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { Option } from "../produto/product-types";

export function InventoryProductPickerModal({products,selected,onConfirm,onClose}:{products:Option[];selected:string[];onConfirm:(ids:string[])=>void;onClose:()=>void}){
 const [query,setQuery]=useState("");
 const [draft,setDraft]=useState(selected);
 const visible=useMemo(()=>{const term=query.trim().toLocaleLowerCase("pt-BR");return products.filter(product=>!term||product.name.toLocaleLowerCase("pt-BR").includes(term)||String(product.id).includes(term));},[products,query]);
 const toggle=(id:string)=>setDraft(current=>current.includes(id)?current.filter(item=>item!==id):[...current,id]);
 const allVisible=visible.length>0&&visible.every(product=>draft.includes(product.id));
 const confirm=(ids=draft)=>{onConfirm(ids);onClose();};
 return <Modal open title="Pesquisar produtos" width="max-w-4xl" height="h-[70vh]" onClose={onClose}><div className="flex h-full min-h-0 flex-col gap-4">
  <div className="relative shrink-0"><Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={18}/><Input autoFocus className="!pl-11" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Pesquisar por código ou descrição..."/></div>
  <label className="flex shrink-0 items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={allVisible} onChange={event=>setDraft(event.target.checked?Array.from(new Set([...draft,...visible.map(product=>product.id)])):draft.filter(id=>!visible.some(product=>product.id===id)))}/>Selecionar todos os resultados</label>
  <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-[#eeeeef]"><tr><th className="w-14 p-3"></th><th className="p-3">ID</th><th className="p-3">Descrição</th></tr></thead><tbody>{visible.map(product=><tr key={product.id} className="cursor-pointer border-t hover:bg-white/40" onClick={()=>toggle(product.id)} onDoubleClick={()=>confirm(draft.includes(product.id)?draft:[...draft,product.id])}><td className="p-3"><input type="checkbox" checked={draft.includes(product.id)} onChange={()=>toggle(product.id)} onClick={event=>event.stopPropagation()}/></td><td className="p-3">{product.id}</td><td className="p-3">{product.name}</td></tr>)}</tbody></table>{!visible.length&&<p className="p-5 text-sm text-ink-400">Nenhum produto encontrado.</p>}</div>
  <div className="flex shrink-0 items-center justify-between"><span className="text-sm text-ink-400">{draft.length} produto(s) selecionado(s)</span><div className="flex gap-3"><Button onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={()=>confirm()}>Confirmar seleção</Button></div></div>
 </div></Modal>;
}
