FROM amazoncorretto:17-alpine
WORKDIR /email-sender
COPY target/*.jar email-sender.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "email-sender.jar"]

#FROM maven:3.8.8 as builder
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN maven package
#
#FROM amazoncorretto:17-alpine
#WORKDIR /email-sender
#COPY --from=builder /app/target/*.jar email-sender.jar
#EXPOSE 8081
#ENTRYPOINT ["java", "-jar", "email-sender.jar"]