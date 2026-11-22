package com.luchersol.gestorgastos.shared.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration 
@EnableScheduling 
@EnableConfigurationProperties (BackupProperties.class)
public class BackupConfig {
}
