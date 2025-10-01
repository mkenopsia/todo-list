//package ru.mkenopsia.tasktrackeremailsender.config;
//
//import org.apache.kafka.clients.consumer.Consumer;
//import org.apache.kafka.clients.consumer.ConsumerRecord;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
//import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
//import org.springframework.kafka.listener.CommonErrorHandler;
//import org.springframework.kafka.listener.DefaultErrorHandler;
//import org.springframework.kafka.listener.MessageListenerContainer;
//
//@Configuration
//public class KafkaConfig {
//
//    @Autowired
//    private KafkaProperties kafkaProperties;
//
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, String> factory =
//                new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(new DefaultKafkaConsumerFactory<>(kafkaProperties.buildConsumerProperties()));
//        factory.setCommonErrorHandler(new CommonErrorHandler() {
//            @Override
//            public boolean handleOne(Exception thrownException, ConsumerRecord<?, ?> record, Consumer<?, ?> consumer, MessageListenerContainer container) {
//                return CommonErrorHandler.super.handleOne(thrownException, record, consumer, container);
//            }
//        });
//        return factory;
//    }
//}
//
