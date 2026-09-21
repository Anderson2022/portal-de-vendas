"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { createAddressLevel, listAddressLevel, updateAddressLevel, type AddressKind, type AddressOption } from "@/lib/estoque/warehouse-address";
import type { StockStructureOption } from "@/lib/estoque/stock-structure";
import { TransferLookupField } from "../transferencia/transfer-lookup-field";

const stages:Array<{kind:AddressKind;label:string}>=[{kind:"building",label:"Prédio"},{kind:"street",label:"Rua"},{kind:"rack",label:"Estante"},{kind:"bay",label:"Vão"},{kind:"level",label:"Nível"},{kind:"position",label:"Posição"}];
const emptyValues:Record<AddressKind,string>={building:"",street:"",rack:"",bay:"",level:"",position:""};
const emptyOptions:Record<AddressKind,AddressOption[]>={building:[],street:[],rack:[],bay:[],level:[],position:[]};

export function WarehouseAddressFormModal({warehouse,record,onClose,onSaved}:{warehouse:string;record?:StockStructureOption|null;onClose:()=>void;onSaved:()=>Promise<void>}){
 const initialKind=(record?.tipo as AddressKind)||"building";
 const [kind,setKind]=useState<AddressKind>(initialKind),[values,setValues]=useState(emptyValues),[options,setOptions]=useState(emptyOptions);
 const [code,setCode]=useState(record?.code||""),[name,setName]=useState(record?.name||""),[description,setDescription]=useState(record?.description||""),[capacity,setCapacity]=useState(record?.capacity==null?"":String(record.capacity));
 const [storage,setStorage]=useState(true),[picking,setPicking]=useState(false),[blocked,setBlocked]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const targetIndex=stages.findIndex(stage=>stage.kind===kind);
 useEffect(()=>{void listAddressLevel("building",warehouse).then(rows=>setOptions(current=>({...current,building:rows})));},[warehouse]);
 const select=async(index:number,id:string)=>{const nextValues={...values,[stages[index].kind]:id};for(let position=index+1;position<stages.length;position++)nextValues[stages[position].kind]="";setValues(nextValues);if(index+1<stages.length){const child=stages[index+1].kind;const rows=id?await listAddressLevel(child,id):[];setOptions(current=>({...current,[child]:rows}));}};
 const parentId=targetIndex===0?warehouse:values[stages[targetIndex-1].kind];
 const changeKind=(next:AddressKind)=>{if(record)return;setKind(next);setCode("");setName("");setDescription("");setCapacity("");setError("");};
 const save=async()=>{if(!parentId||!name.trim())return;setBusy(true);setError("");try{const details={description,capacity,storage:String(storage),picking:String(picking),blocked:String(blocked)};if(record)await updateAddressLevel(kind,record.id,parentId,code,name,details);else await createAddressLevel(kind,parentId,code,name,details);await onSaved();onClose();}catch(reason){setError(reason instanceof Error?reason.message:"Não foi possível salvar o endereço logístico.");}finally{setBusy(false);}};
 return <Modal open title={`${record?"Editar":"Cadastrar"} endereço logístico`} width="max-w-4xl" onClose={onClose}><div className="space-y-5">
  <div className="rounded-2xl border bg-white/30 p-4"><p className="mb-3 text-sm font-semibold">Tipo de endereço</p><div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{stages.map(stage=><button type="button" key={stage.kind} disabled={!!record} onClick={()=>changeKind(stage.kind)} className={`rounded-xl px-3 py-3 text-sm font-semibold disabled:opacity-70 ${kind===stage.kind?"bg-ink-900 text-white":"bg-white/60"}`}>{stage.label}</button>)}</div></div>
  {targetIndex>0&&<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{stages.slice(0,targetIndex).map((stage,index)=>{const stageParent=index===0?warehouse:values[stages[index-1].kind];return <TransferLookupField key={stage.kind} label={stage.label} value={values[stage.kind]} options={options[stage.kind].map(item=>({id:String(item.id),code:item.code,name:item.name}))} disabled={!stageParent} onSelect={id=>void select(index,id)} onCreate={async(newCode,newName,details)=>{await createAddressLevel(stage.kind,stageParent,newCode,newName,details);const rows=await listAddressLevel(stage.kind,stageParent);setOptions(current=>({...current,[stage.kind]:rows}));}}/>;})}</div>}
  <div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1 text-sm font-semibold"><span>Código</span><Input value={code} onChange={event=>setCode(event.target.value)} placeholder="Gerado automaticamente se vazio"/></label><label className="space-y-1 text-sm font-semibold"><span>Nome</span><Input value={name} onChange={event=>setName(event.target.value)} placeholder={`Nome do ${stages[targetIndex].label.toLowerCase()}`}/></label><label className="space-y-1 text-sm font-semibold sm:col-span-2"><span>Descrição</span><Input value={description} onChange={event=>setDescription(event.target.value)} placeholder="Descrição opcional"/></label>
   {(kind==="level"||kind==="position")&&<label className="space-y-1 text-sm font-semibold"><span>Capacidade</span><Input type="number" min="0" value={capacity} onChange={event=>setCapacity(event.target.value)} placeholder="Capacidade do endereço"/></label>}
  </div>
  {kind==="position"&&<div className="grid gap-3 sm:grid-cols-3"><label className="flex items-center gap-2 rounded-xl bg-white/50 p-3 text-sm"><input type="checkbox" checked={storage} onChange={event=>setStorage(event.target.checked)}/>Permite armazenagem</label><label className="flex items-center gap-2 rounded-xl bg-white/50 p-3 text-sm"><input type="checkbox" checked={picking} onChange={event=>setPicking(event.target.checked)}/>Permite picking</label><label className="flex items-center gap-2 rounded-xl bg-white/50 p-3 text-sm"><input type="checkbox" checked={blocked} onChange={event=>setBlocked(event.target.checked)}/>Posição bloqueada</label></div>}
  <div className="rounded-xl bg-white/40 p-3 text-sm"><strong>Hierarquia:</strong> Unidade → Depósito → Prédio → Rua → Estante → Vão → Nível → Posição</div>
  {record&&targetIndex>0&&<p className="text-xs text-ink-400">Selecione pelas lupas o caminho onde este registro ficará vinculado.</p>}{error&&<p className="text-sm text-coral-500">{error}</p>}<div className="flex justify-end gap-3"><Button onClick={onClose}>Cancelar</Button><Button variant="primary" disabled={busy||!parentId||!name.trim()} onClick={save}>{busy?"Salvando...":record?"Salvar alterações":"Cadastrar"}</Button></div>
 </div></Modal>;
}
