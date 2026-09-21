"use server";
import {api} from "@/lib/backend/client";
export type AddressKind="building"|"street"|"rack"|"bay"|"level"|"position";
export type AddressOption={id:number;code:string;name:string;capacity?:number|null};
export type AddressTreeOption=AddressOption&{tipo:AddressKind;parent_id?:number|null;path:string;depth:number;active:boolean};
export async function listAddressLevel(kind:AddressKind,parentId:string){if(!parentId)return [];return api<AddressOption[]>(`/inventory/addresses/${kind}?parentId=${parentId}`);}
export async function listWarehouseAddressTree(warehouseId:string){if(!warehouseId)return [];return api<AddressTreeOption[]>(`/inventory/addresses/tree?warehouseId=${warehouseId}`);}
export async function createAddressLevel(kind:AddressKind,parentId:string,code:string,name:string,details:Record<string,string>={}){return api<AddressOption>(`/inventory/addresses/${kind}`,{method:"POST",body:JSON.stringify({parentId,code,name,...details})});}
export async function updateAddressLevel(kind:AddressKind,id:number,parentId:string,code:string,name:string,details:Record<string,string>={}){return api<AddressOption>(`/inventory/addresses/${kind}/${id}`,{method:"PUT",body:JSON.stringify({parentId,code,name,...details})});}
export async function getPositionPath(id:string){return api<{building_id:number;street_id:number;rack_id:number;bay_id:number;level_id:number;position_id:number;warehouse_id:number;address:string}>(`/inventory/addresses/position/${id}/path`);}
