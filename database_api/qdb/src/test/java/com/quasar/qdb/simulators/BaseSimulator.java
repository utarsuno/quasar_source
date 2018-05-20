package com.quasar.qdb.simulators;

import org.apache.kafka.clients.producer.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

/**
 * Base simulator for local development tests. For the moment it requires IDEA to run.
 * Prerequisites
 * - Start service as described in README
 * - Inspect output topic to verify results.
 *   $ kafkacat -C -b 0.0.0.0:9092 -t <topic-to-inspect>
 *
 * Usage (IDEA):
 * - Right click on class, and select Run
 *
 *
 * This is not required for production,
 * Not part of the main distribution.
 */
abstract public class BaseSimulator {

    public final static Logger LOGGER = LoggerFactory.getLogger(BaseSimulator.class);

    public final static String BOOTSTRAP_SERVERS = "localhost:9092";

    public static final String PRESENCE_TOPIC = "presenceUpdates";
    public static final String LOCATION_TOPIC = "locationUpdates";


    protected void sendMessage(String topic, String message) throws IOException {
        Producer<String, String> producer = new KafkaProducer<>(getProperties());
        ProducerRecord<String, String> data = new ProducerRecord<>(topic, message);

        producer.send(data, new TestCallback());
        producer.close();
    }

    protected void sendBytes(String topic, byte[] message) throws IOException {
        KafkaProducer<String, Object> producer = new KafkaProducer<>(bytesProducerProperties());
        ProducerRecord<String, Object> data = new ProducerRecord<>(topic, message);

        producer.send(data, new TestCallback());
        producer.close();
    }

    protected String getContents(String path) throws IOException {
        return new String(Files.readAllBytes(Paths.get(path)));
    }

    protected void sendPresenceEvent(String path) throws IOException {
        String presenceEvent = getContents(path);
        Producer<String, String> producer = new KafkaProducer<>(getProperties());
        //ProducerRecord<String, String> data = new ProducerRecord<>(PRESENCE_TOPIC, deviceId, presenceEvent); //Happy case
        ProducerRecord<String, String> data = new ProducerRecord<>(PRESENCE_TOPIC, presenceEvent); //Likely case

        producer.send(data, new TestCallback());
        producer.close();
    }

    protected void sendLocationEvent(String path) throws IOException {
        String locationEVent = getContents(path);
        Producer<String, String> producer = new KafkaProducer<>(getProperties());
        //ProducerRecord<String, String> data = new ProducerRecord<>(LOCATION_TOPIC, deviceId, locationEVent); //Happy Case
        ProducerRecord<String, String> data = new ProducerRecord<>(LOCATION_TOPIC, locationEVent); //Very likely case

        producer.send(data, new TestCallback());
        producer.close();
    }

    protected Properties getProperties() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        return props;
    }

    protected Properties bytesProducerProperties() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.StringSerializer");
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, "org.apache.kafka.common.serialization.ByteArraySerializer");
        return props;
    }

    protected static class TestCallback implements Callback {
        @Override
        public void onCompletion(RecordMetadata recordMetadata, Exception e) {
            if (e != null) {
                LOGGER.error("Error while producing message to topic :" + recordMetadata, e);
            } else {
                LOGGER.info("Sent message to topic:{} partition:{}  offset:{}", recordMetadata.topic(), recordMetadata.partition(), recordMetadata.offset());
            }
        }
    }
}