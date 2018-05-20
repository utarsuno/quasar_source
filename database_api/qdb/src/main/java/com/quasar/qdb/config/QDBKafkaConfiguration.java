package com.quasar.qdb.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.listener.config.ContainerProperties;
import org.springframework.kafka.requestreply.ReplyingKafkaTemplate;

@Configuration
@EnableKafka
public class QDBKafkaConfiguration {

  /**
   * The kafka host and port to pass to the configuration. Based on the environment variables KAFKA_HOST and KAFKA_PORT.
   */
  @Value("${kafka.host}:${kafka.port}")
  String kafkaServerInfo;
  
  @Bean
  public KafkaAdmin admin() {
      Map<String, Object> configs = new HashMap<>();
      configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaServerInfo);
      return new KafkaAdmin(configs);
  }
  
  @Bean
  KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, String>> kafkaListenerContainerFactory() {
      ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
      factory.setReplyTemplate(kafkaTemplate(producerFactory(), replyContainer(consumerFactory())));
      factory.setConsumerFactory(consumerFactory());
      factory.setConcurrency(30);
      factory.getContainerProperties().setPollTimeout(3000);
      return factory;
  }    

  @Bean
  public ConsumerFactory<String, String> consumerFactory() {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaServerInfo);
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "gemini_sfs_actionhandler");
    props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, true);
    props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, 100);
    props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 15000); 
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
    return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), new StringDeserializer());
  }  
  
  @Bean
  public ProducerFactory<String, String> producerFactory() {
    Map<String, Object> props = new HashMap<>();
    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaServerInfo);
    props.put(ProducerConfig.RETRIES_CONFIG, 0);
    props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);
    props.put(ProducerConfig.LINGER_MS_CONFIG, 1);
    props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
    props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    return new DefaultKafkaProducerFactory<>(props);
  }    
  
  @Bean
  public ReplyingKafkaTemplate<String, String, String> kafkaTemplate(ProducerFactory<String, String> pf, KafkaMessageListenerContainer<String, String> replyContainer) {
      return new ReplyingKafkaTemplate<>(pf, replyContainer);
  }

  @Bean
  public KafkaMessageListenerContainer<String, String> replyContainer(ConsumerFactory<String, String> cf) {
      ContainerProperties containerProperties = new ContainerProperties(profileReplySendTopic, phoneReplySendTopic);
      return new KafkaMessageListenerContainer<>(cf, containerProperties);
  }
  
  ///////////////////////////////////////
  //Configuration for profileReplyReceive
  ///////////////////////////////////////
  @Value("${kafka.replytopics.profilereply.receiveTopic.value}")
  private String profileReplyReceiveTopic;
  
  @Value("${kafka.replytopics.profilereply.receiveTopic.partitions}")
  private Integer profileReplyReceiveTopicPartition;
  
  @Value("${kafka.replytopics.profilereply.receiveTopic.replicas}")
  private Short profileReplyReceiveTopicReplica;
  
  @Bean
  public NewTopic profileReplyReceive() {
    return new NewTopic(profileReplyReceiveTopic, profileReplyReceiveTopicPartition, profileReplyReceiveTopicReplica);
  }

  ////////////////////////////////////
  //Configuration for profileReplySend
  ////////////////////////////////////
  
  @Value("${kafka.replytopics.profilereply.sendTopic.value}")
  private String profileReplySendTopic;
  
  @Value("${kafka.replytopics.profilereply.sendTopic.partitions}")
  private Integer profileReplySendTopicPartition;
  
  @Value("${kafka.replytopics.profilereply.sendTopic.replicas}")
  private Short profileReplySendTopicReplica;
  
  @Bean
  public NewTopic profileReplySend() {
    return new NewTopic(profileReplySendTopic, profileReplySendTopicPartition, profileReplySendTopicReplica);
  }      
  
  ////////////////////////////////////
  //Configuration for phoneReplyReceive
  ////////////////////////////////////
  
  @Value("${kafka.replytopics.phonereply.receiveTopic.value}")
  private String phoneReplyReceiveTopic;
  
  @Value("${kafka.replytopics.phonereply.receiveTopic.partitions}")
  private Integer phoneReplyReceiveTopicPartition;
  
  @Value("${kafka.replytopics.phonereply.receiveTopic.replicas}")
  private Short phoneReplyReceiveTopicReplica;
  
  @Bean
  public NewTopic pphoneReplyReiceive() {
    return new NewTopic(phoneReplyReceiveTopic, phoneReplyReceiveTopicPartition, phoneReplyReceiveTopicReplica);
  }
  
  ////////////////////////////////////
  //Configuration for phoneReplySend
  ////////////////////////////////////
  
  @Value("${kafka.replytopics.phonereply.sendTopic.value}")
  private String phoneReplySendTopic;
  
  @Value("${kafka.replytopics.phonereply.sendTopic.partitions}")
  private Integer phoneReplySendTopicPartition;
  
  @Value("${kafka.replytopics.phonereply.sendTopic.replicas}")
  private Short phoneReplySendTopicReplica;
  
  @Bean
  public NewTopic phoneReplySend() {
    return new NewTopic(phoneReplySendTopic, phoneReplySendTopicPartition, phoneReplySendTopicReplica);
  }    
  
}
