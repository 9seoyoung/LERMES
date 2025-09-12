package com.kdt.KDT_PJT;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class KdtPjtApplication {

	public static void main(String[] args) {
		SpringApplication.run(KdtPjtApplication.class, args);
	}

}
