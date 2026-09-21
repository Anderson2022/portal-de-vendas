package br.com.poolcontrol.inventory.controller;
import br.com.poolcontrol.inventory.dto.InventoryProcessRequest;
import br.com.poolcontrol.inventory.service.InventoryProcessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/v1/inventory/counts") @RequiredArgsConstructor
public class InventoryProcessController {
 private final InventoryProcessService service;
 @GetMapping public List<Map<String,Object>> list(){return service.list();}
 @GetMapping("/locations") public List<Map<String,Object>> locations(@RequestParam Long warehouseId){return service.locations(warehouseId);}
 @GetMapping("/{id}") public Map<String,Object> get(@PathVariable Long id){return service.get(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> create(@Valid @RequestBody InventoryProcessRequest.Create request){return service.create(request);}
 @PostMapping("/{id}/items/{itemId}/count") public Map<String,Object> count(@PathVariable Long id,@PathVariable Long itemId,@Valid @RequestBody InventoryProcessRequest.Count request){return service.count(id,itemId,request);}
 @PostMapping("/{id}/approve") public Map<String,Object> approve(@PathVariable Long id,@RequestBody InventoryProcessRequest.Approve request){return service.approve(id,request);}
 @PostMapping("/{id}/cancel") public Map<String,Object> cancel(@PathVariable Long id,@Valid @RequestBody InventoryProcessRequest.Cancel request){return service.cancel(id,request);}
}
