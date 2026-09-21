"use client";
import { useEffect, useState } from "react";
import { ArrowUpDown, Plus, Search, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProductReference, listProductReferences } from "@/lib/estoque/product-references";
import type { LookupKind, LookupRecord } from "../produto/lookup/lookup-types";
import { ProductReferenceFormModal } from "./product-reference-form-modal";
import { DeleteProductReferenceDialog } from "./delete-product-reference-dialog";

export function ProductReferenceRegistrationModal({kind,label,onClose}:{kind:LookupKind;label:string;onClose:()=>void}) {
 const [rows,setRows]=useState<LookupRecord[]>([]),[query,setQuery]=useState("");
 const [form,setForm]=useState<{open:boolean;record:LookupRecord|null}>({open:false,record:null}),[loading,setLoading]=useState(true);
 const [deleting,setDeleting]=useState<{record:LookupRecord|null;error:string;busy:boolean}>({record:null,error:"",busy:false});
 const [sort,setSort]=useState<{key:"id"|"name"|"code"|"level"|"status";direction:1|-1}>({key:"id",direction:1});
 const load=async()=>{setLoading(true);setRows(await listProductReferences(kind));setLoading(false);};
 useEffect(()=>{void load();},[kind]);
 const filtered=rows.filter((row)=>`${row.id} ${row.name} ${row.value}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>{const value=(row:LookupRecord)=>sort.key==="id"?Number(row.id):sort.key==="name"?row.name.toLowerCase():sort.key==="code"?row.value.toLowerCase():sort.key==="level"?(row.level||1):(row.active===false?0:1);const av=value(a),bv=value(b);return (av<bv?-1:av>bv?1:0)*sort.direction;});
 const order=(key:typeof sort.key)=>setSort((current)=>({key,direction:current.key===key&&current.direction===1?-1:1}));
 const remove=async()=>{
  if(!deleting.record)return;
  setDeleting((current)=>({...current,busy:true,error:""}));
  try { await deleteProductReference(kind,deleting.record.id); setDeleting({record:null,error:"",busy:false}); await load(); }
  catch (cause) { setDeleting((current)=>({...current,busy:false,error:cause instanceof Error?cause.message:"Não foi possível excluir o registro."})); }
 };
 return <><Modal open title={label} width="max-w-4xl" height="h-[78vh]" onClose={onClose}><div className="space-y-3">
  <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/35">
   <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-ink-100 p-3"><div className="relative min-w-0"><Input className="w-full !pl-10" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={`Pesquisar ${label.toLowerCase()}...`}/><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" size={16}/></div><Button variant="primary" onClick={()=>setForm({open:true,record:null})}><Plus size={16}/>Cadastrar</Button></div>
   <div className={`grid ${kind==="category"?"grid-cols-[70px_1fr_150px_90px_90px_70px]":"grid-cols-[90px_1fr_180px_70px]"} gap-3 border-b border-ink-100 px-4 py-3 text-xs font-bold uppercase text-ink-400`}><button onClick={()=>order("id")} className="flex items-center gap-1">ID<ArrowUpDown size={12}/></button><button onClick={()=>order("name")} className="flex items-center gap-1">Descrição<ArrowUpDown size={12}/></button><button onClick={()=>order("code")} className="flex items-center gap-1">Código<ArrowUpDown size={12}/></button>{kind==="category"&&<><button onClick={()=>order("level")} className="flex items-center gap-1">Nível<ArrowUpDown size={12}/></button><button onClick={()=>order("status")} className="flex items-center gap-1">Status<ArrowUpDown size={12}/></button></>}<span>Ações</span></div><div className="max-h-[48vh] overflow-y-auto">
   {filtered.map((row)=><div key={row.id} onDoubleClick={()=>setForm({open:true,record:row})} className={`grid w-full ${kind==="category"?"grid-cols-[70px_1fr_150px_90px_90px_70px]":"grid-cols-[90px_1fr_180px_70px]"} items-center gap-3 border-b border-ink-100 px-4 py-3 text-left text-sm hover:bg-water-50/70`}><strong>{row.id}</strong><span>{row.name}</span><span>{row.value!==row.name?row.value:"—"}</span>{kind==="category"&&<><span>{row.level||1}</span><span>{row.active===false?"Inativa":"Ativa"}</span></>}<button type="button" aria-label={`Excluir ${row.name}`} title="Excluir" onDoubleClick={(event)=>event.stopPropagation()} onClick={(event)=>{event.stopPropagation();setDeleting({record:row,error:"",busy:false});}} className="flex h-8 w-8 items-center justify-center rounded-lg text-coral-500 hover:bg-coral-50"><Trash2 size={16}/></button></div>)}
   {!loading&&!filtered.length&&<p className="p-6 text-center text-sm text-ink-400">Nenhum registro encontrado.</p>}{loading&&<p className="p-6 text-center text-sm text-ink-400">Carregando...</p>}
  </div></div><p className="text-xs text-ink-400">Clique duas vezes em um registro para editar.</p>
 </div></Modal>{form.open&&<ProductReferenceFormModal kind={kind} label={label} record={form.record} onClose={()=>setForm({open:false,record:null})} onSaved={async()=>{setForm({open:false,record:null});await load();}}/>}{deleting.record&&<DeleteProductReferenceDialog name={deleting.record.name} error={deleting.error} busy={deleting.busy} onClose={()=>setDeleting({record:null,error:"",busy:false})} onConfirm={()=>void remove()}/>}</>;
}
