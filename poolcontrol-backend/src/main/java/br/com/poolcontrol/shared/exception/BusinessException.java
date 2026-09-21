package br.com.poolcontrol.shared.exception;



public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
