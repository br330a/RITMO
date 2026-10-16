package com.ritmo.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> fields = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        fields.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", 400);
        body.put("error", "Bad Request");
        body.put("message", "Dados inválidos.");
        body.put("fields", fields);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableBody(
            HttpMessageNotReadableException exception
    ) {
        Map<String, Object> body = new LinkedHashMap<>();

        body.put("status", 400);
        body.put("error", "Bad Request");
        body.put(
                "message",
                "Não foi possível interpretar os dados enviados."
        );
        body.put(
                "detail",
                exception.getMostSpecificCause().getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatus(
            ResponseStatusException exception
    ) {
        Map<String, Object> body = new LinkedHashMap<>();

        body.put(
                "status",
                exception.getStatusCode().value()
        );
        body.put(
                "error",
                exception.getStatusCode().toString()
        );
        body.put(
                "message",
                exception.getReason()
        );

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(body);
    }
}