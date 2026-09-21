package br.com.poolcontrol;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.modulith.Modulithic;

@Modulithic
@SpringBootApplication
public class PoolControlApplication {

    public static void main(String[] args) {
        SpringApplication.run(PoolControlApplication.class, args);
    }
}
