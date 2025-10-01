//package ru.mkenopsia.tasktrackeremailsender.config;
//
//import org.apache.kafka.clients.consumer.ConsumerRecord;
//import org.springframework.kafka.listener.ErrorHandler;
//import org.springframework.kafka.listener.SeekToCurrentErrorHandler;
//import org.springframework.stereotype.Component;
//
//@Component
//public class CustomErrorHandler implements ErrorHandler {
//
//    @Override
//    public void handle(Exception thrownException, ConsumerRecord<?, ?> data) {
//        // Логирование ошибки
//        System.err.println("Error processing record: " + data + ", exception: " + thrownException.getMessage());
//        // Дополнительная логика обработки ошибок (например, отправка уведомлений)
//    }
//}
//
