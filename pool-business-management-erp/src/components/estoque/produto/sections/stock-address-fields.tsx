"use client";
import {useEffect,useMemo,useState} from "react";
import {Field} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Select} from "@/components/ui/select";
import {TransferLookupField,type TransferLookupOption} from "../../transferencia/transfer-lookup-field";
import {listStockSites,listStockWarehouses,type StockStructureOption} from "@/lib/estoque/stock-structure";
import {createAddressLevel,getPositionPath,listAddressLevel,type AddressKind,type AddressOption} from "@/lib/estoque/warehouse-address";
import {useProductLookup} from "../lookup/product-lookup-provider";
import {WarehouseAddressPreview} from "./warehouse-address-preview";

const stages:Array<{kind:AddressKind;label:string}>=[{kind:"building",label:"Prédio"},{kind:"street",label:"Rua"},{kind:"rack",label:"Estante"},{kind:"bay",label:"Vão"},{kind:"level",label:"Nível"},{kind:"position",label:"Posição"}];
const lookupOptions=(rows:AddressOption[]):TransferLookupOption[]=>rows.map(row=>({id:String(row.id),code:row.code,name:row.name}));

export function StockAddressFields(){const lookup=useProductLookup(),initialWarehouse=lookup.initial("warehouseId"),initialPosition=lookup.initial("defaultPositionId");const [sites,setSites]=useState<StockStructureOption[]>([]),[warehouses,setWarehouses]=useState<StockStructureOption[]>([]),[site,setSite]=useState(""),[warehouse,setWarehouse]=useState(initialWarehouse),[values,setValues]=useState<Record<AddressKind,string>>({building:lookup.initial("defaultBuildingId"),street:lookup.initial("defaultStreetId"),rack:lookup.initial("defaultRackId"),bay:lookup.initial("defaultBayId"),level:lookup.initial("defaultLevelId"),position:initialPosition}),[options,setOptions]=useState<Record<AddressKind,AddressOption[]>>({building:[],street:[],rack:[],bay:[],level:[],position:[]});
 useEffect(()=>{void listStockSites().then(setSites);void listStockWarehouses().then(w=>{setWarehouses(w);const current=w.find(row=>String(row.id)===initialWarehouse);if(current?.site_id)setSite(String(current.site_id));});},[initialWarehouse]);
 useEffect(()=>{if(site)void listStockWarehouses(site).then(setWarehouses);},[site]);
 useEffect(()=>{if(warehouse)void load("building",warehouse);},[warehouse]);
 useEffect(()=>{void (async()=>{if(values.building)await load("street",values.building);if(values.street)await load("rack",values.street);if(values.rack)await load("bay",values.rack);if(values.bay)await load("level",values.bay);if(values.level)await load("position",values.level);})();},[]);
 useEffect(()=>{if(!initialPosition)return;void (async()=>{const path=await getPositionPath(initialPosition);const ids={building:String(path.building_id),street:String(path.street_id),rack:String(path.rack_id),bay:String(path.bay_id),level:String(path.level_id),position:String(path.position_id)};const building=await listAddressLevel("building",String(path.warehouse_id));const street=await listAddressLevel("street",ids.building);const rack=await listAddressLevel("rack",ids.street);const bay=await listAddressLevel("bay",ids.rack);const level=await listAddressLevel("level",ids.bay);const position=await listAddressLevel("position",ids.level);setOptions({building,street,rack,bay,level,position});setValues(ids);})().catch(()=>{});},[initialPosition]);
 async function load(kind:AddressKind,parentId:string){setOptions(current=>({...current,[kind]:[]}));if(parentId){const rows=await listAddressLevel(kind,parentId);setOptions(current=>({...current,[kind]:rows}));}}
 function select(index:number,id:string){const kind=stages[index].kind;setValues(current=>{const next={...current,[kind]:id};stages.slice(index+1).forEach(stage=>next[stage.kind]="");return next;});if(index<stages.length-1)void load(stages[index+1].kind,id);}
 const address=useMemo(()=>stages.map(stage=>options[stage.kind].find(row=>String(row.id)===values[stage.kind])?.code).filter(Boolean).join("-"),[options,values]);
 const addressParts=stages.map(stage=>{const selected=options[stage.kind].find(row=>String(row.id)===values[stage.kind]);return {label:stage.label,value:selected?.name||"",code:selected?.code||""};});
 return <>
  <Field label="Unidade / estabelecimento"><Select className="input" value={site} onChange={e=>{setSite(e.target.value);setWarehouse("");}}><option value="">Selecione a unidade</option>{sites.map(row=><option key={row.id} value={row.id}>{row.code} - {row.name}</option>)}</Select></Field>
  <Field label="Depósito padrão"><Select className="input" value={warehouse} disabled={!site} onChange={e=>{setWarehouse(e.target.value);setValues({building:"",street:"",rack:"",bay:"",level:"",position:""});}}><option value="">Selecione o depósito</option>{warehouses.map(row=><option key={row.id} value={row.id}>{row.code} - {row.name}</option>)}</Select></Field>
  {stages.map((stage,index)=>{const parent=index===0?warehouse:values[stages[index-1].kind];return <TransferLookupField key={stage.kind} label={stage.label} value={values[stage.kind]} options={lookupOptions(options[stage.kind])} disabled={!parent} onSelect={id=>select(index,id)} onCreate={async(code,name,details)=>{await createAddressLevel(stage.kind,parent,code,name,details);await load(stage.kind,parent);}}/>})}
  <Field label="Endereço logístico gerado"><Input readOnly className="input font-semibold" value={address} placeholder="A-01-05-02-03-04"/></Field>
  <WarehouseAddressPreview address={address} parts={addressParts}/>
  <input type="hidden" name="warehouseId" value={warehouse}/><input type="hidden" name="defaultBuildingId" value={values.building}/><input type="hidden" name="defaultStreetId" value={values.street}/><input type="hidden" name="defaultRackId" value={values.rack}/><input type="hidden" name="defaultBayId" value={values.bay}/><input type="hidden" name="defaultLevelId" value={values.level}/><input type="hidden" name="defaultPositionId" value={values.position}/><input type="hidden" name="defaultLocationId" value=""/>
 </>}
