package com.fernandogigliotti.finance_manager.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI financeManagerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Finance Manager API")
                        .description("API para controle de despesas pessoais com autenticação JWT")
                        .version("1.0")
                        .license(new License().name("MIT License").url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Repositório do Projeto")
                        .url("https://github.com/Nerfandao/finance-manager"));
    }
}