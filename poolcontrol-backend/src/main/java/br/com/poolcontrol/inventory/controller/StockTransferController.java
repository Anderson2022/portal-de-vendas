package br.com.poolcontrol.inventory.controller;
import br.com.poolcontrol.inventory.dto.StockTransferRequest;
import br.com.poolcontrol.inventory.service.StockTransferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/v1/inventory/transfers") @RequiredArgsConstructor
public class StockTransferController {
 private final StockTransferService service;
 @GetMapping public List<Map<String,Object>> list(){return service.list();}
 @GetMapping("/reasons") public List<Map<String,Object>> reasons(){return service.reasons();}
 @PostMapping("/reasons") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> createReason(@RequestBody Map<String,String> body){return service.createReason(body.get("code"),body.get("name"));}
 @PostMapping("/locations") @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> createLocation(@RequestBody Map<String,String> body){return service.createLocation(Long.valueOf(body.get("warehouseId")),body.get("code"),body.get("name"));}
 @GetMapping("/product-info") public Map<String,Object> productInfo(@RequestParam Long productId,@RequestParam Long warehouseId){return service.productInfo(productId,warehouseId);}
 @GetMapping("/product-origin") public Map<String,Object> productOrigin(@RequestParam Long productId){return service.productOrigin(productId);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Map<String,Object> create(@Valid @RequestBody StockTransferRequest request){return service.create(request);}
}
