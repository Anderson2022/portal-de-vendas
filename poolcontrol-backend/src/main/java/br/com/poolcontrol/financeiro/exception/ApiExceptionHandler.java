package br.com.poolcontrol.financeiro.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.*;
@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(BusinessException.class) ResponseEntity<?> business(BusinessException e){ return ResponseEntity.badRequest().body(Map.of("timestamp",OffsetDateTime.now(),"erro",e.getMessage())); }
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){
   var errors=e.getBindingResult().getFieldErrors().stream().collect(java.util.stream.Collectors.toMap(f->f.getField(), f->Optional.ofNullable(f.getDefaultMessage()).orElse("inválido"),(a,b)->a));
   return ResponseEntity.badRequest().body(Map.of("timestamp",OffsetDateTime.now(),"erros",errors));
 }
}
