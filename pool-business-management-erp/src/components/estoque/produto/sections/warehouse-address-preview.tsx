"use client";
import {useState} from "react";
import {ArrowDown,ArrowLeft,Eye} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Modal} from "@/components/ui/modal";

type Part={label:string;value:string;code?:string};type Props={address:string;parts:Part[]};
const spots=[
 {box:"left-[7%] top-[9%]",arrow:"down",color:"bg-[#1261b8]"},
 {box:"left-[36%] top-[24%]",arrow:"down",color:"bg-[#168ddd]"},
 {box:"right-[22%] top-[9%]",arrow:"down",color:"bg-[#f4a30b] text-[#082d5b]"},
 {box:"right-[4%] top-[26%]",arrow:"left",color:"bg-[#ed263b]"},
 {box:"right-[4%] top-[45%]",arrow:"left",color:"bg-[#079b45]"},
 {box:"right-[4%] top-[64%]",arrow:"left",color:"bg-[#ed263b]"},
] as const;

export function WarehouseAddressPreview({address,parts}:Props){const [open,setOpen]=useState(false);return <><div className="flex items-end"><Button type="button" className="btn btn-neu w-full" disabled={!address} onClick={()=>setOpen(true)}><Eye size={17}/>Visualizar endereço</Button></div>{open&&<Modal open title="Endereço logístico WMS" width="max-w-[1450px]" height="h-[94vh]" onClose={()=>setOpen(false)}><AddressMap address={address} parts={parts}/></Modal>}</>}

function AddressMap({address,parts}:Props){return <div className="flex h-full items-center justify-center overflow-hidden rounded-3xl bg-white p-3"><div className="relative aspect-[4/3] h-full max-h-full max-w-full"><img src="/images/warehouse-address-wms-clean.png" alt="Mapa 3D do endereço logístico" className="h-full w-full object-contain"/>{parts.map((part,index)=>part.value&&<Callout key={part.label} part={part} {...spots[index]}/>)}<div className="absolute bottom-[3%] left-1/2 w-[72%] -translate-x-1/2 rounded-2xl border-4 border-white bg-[#e1effb]/95 px-4 py-2 text-center shadow-xl"><span className="block text-[clamp(8px,1vw,13px)] font-black uppercase tracking-widest text-[#0b3768]">Endereço logístico completo</span><strong className="block truncate text-[clamp(16px,2.5vw,36px)] font-black text-[#082d5b]">{address}</strong></div></div></div>}

function Callout({part,box,arrow,color}:{part:Part;box:string;arrow:"left"|"down";color:string}){return <div className={`absolute z-10 ${box}`}><div className={`min-w-[92px] max-w-[140px] rounded-xl border-2 border-white px-3 py-2 text-center font-black leading-none text-white shadow-xl ${color}`}><span className="block text-[clamp(8px,.9vw,13px)]">{part.label}</span><strong className="mt-1 block truncate text-[clamp(11px,1.35vw,20px)]">{part.code||part.value}</strong></div>{arrow==="down"?<ArrowDown className="mx-auto mt-1 text-[#0b3768] drop-shadow" size={30} strokeWidth={4}/>:<ArrowLeft className="absolute right-full top-1/2 mr-1 -translate-y-1/2 text-[#0b3768] drop-shadow" size={30} strokeWidth={4}/>}</div>}
