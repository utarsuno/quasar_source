package com.quasar.qdb.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hazelcast.client.config.ClientConfig;
import com.hazelcast.client.config.ClientNetworkConfig;
import com.hazelcast.config.GroupConfig;

@Configuration
public class QDBHazelcastConfiguration {

  @Value("${hazelcast.group.name}")
  private String groupName;
  
  @Value("${hazelcast.group.password}")
  private String password;
  
  @Value("${hazelcast.network.addresses}")
  private String hazelcastAddresses;
  
  @Bean
  public ClientConfig clientConfig() {
    ClientConfig config = new ClientConfig();
    
    GroupConfig groupConfig = config.getGroupConfig();
    groupConfig.setName(groupName);
    groupConfig.setPassword(password);
    
    ClientNetworkConfig network = config.getNetworkConfig();
    network.addAddress(hazelcastAddresses);
    return config;
  }  
  
}
