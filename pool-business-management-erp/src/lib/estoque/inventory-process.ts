"use server";
import { api } from "@/lib/backend/client";
export async function createInventory(input:unknown){return api<{id:number;number:string;status:string}>("/inventory/counts",{method:"POST",body:JSON.stringify(input)});}
export type InventoryListItem={id:number;numero:string;tipo:string;status:string;inventario_cego:boolean;dupla_contagem:boolean;criado_em:string;deposito:string};
export async function listInventories(){return api<InventoryListItem[]>("/inventory/counts");}
export async function getInventory(id:number){return api<{inventory:Record<string,unknown>;items:Array<Record<string,unknown>>}>(`/inventory/counts/${id}`);}
export async function countInventoryItem(id:number,itemId:number,quantity:string,notes:string){return api(`/inventory/counts/${id}/items/${itemId}/count`,{method:"POST",body:JSON.stringify({quantity,notes})});}
export async function approveInventory(id:number,reason:string,notes:string){return api(`/inventory/counts/${id}/approve`,{method:"POST",body:JSON.stringify({reason,notes})});}
export async function cancelInventory(id:number,reason:string){return api(`/inventory/counts/${id}/cancel`,{method:"POST",body:JSON.stringify({reason})});}
export async function listInventoryLocations(warehouseId:string){if(!warehouseId)return [];return api<Array<{id:number;codigo:string;name:string}>>(`/inventory/counts/locations?warehouseId=${warehouseId}`);}
