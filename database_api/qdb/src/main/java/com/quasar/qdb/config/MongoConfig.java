package com.quasar.qdb.config;

import com.mongodb.MongoClientOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class MongoConfig {

    /**
     * SSL connection setup.
     * The MongoDB server must be started with a PEM file (node certificate + key).
     * The certificate of the CA (issuer of the node certificate) must be stored in a truststore.
     * @param trustPath Path to truststore
     * @param trustFileName Filename of the truststore
     * @param trustFilePassword Password of the truststore
     * @return
     */
    @Bean
    @Profile( {"prod", "qa", "dev" } )
    public MongoClientOptions mongoClientOptions(
            @Value("${trust.filePath}") String trustPath,
            @Value("${trust.fileName}") String trustFileName,
            @Value("${trust.filePassword}")String trustFilePassword){

        System.setProperty ("javax.net.ssl.trustStore", trustPath + "/" + trustFileName);
        System.setProperty ("javax.net.ssl.trustStorePassword", trustFilePassword);
        MongoClientOptions.Builder builder = MongoClientOptions.builder();
        return builder.sslEnabled(true)
                .sslInvalidHostNameAllowed(true)
                .build();
    }


}
