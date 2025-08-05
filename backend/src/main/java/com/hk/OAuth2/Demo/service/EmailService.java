package com.hk.OAuth2.Demo.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${spring.sendgrid.api-key}")
    private String sendgridApiKey;

    public void sendEmail(String toEmail, String subject, String body) throws IOException {

        Email from = new Email("2004hk271620@gmail.com");
        Email to = new Email(toEmail);
        Content content = new Content("text/html", body);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendgridApiKey);
        Request request = new Request();

        try{
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            System.out.println("===== SENDGRID EMAIL RESPONSE =====");
            System.out.println("Status Code: " + response.getStatusCode());

            if (response.getBody() != null && !response.getBody().isEmpty()) {
                System.out.println("Response Body: " + response.getBody());
            }

            System.out.println("Response Headers:");
            response.getHeaders().forEach((key, value) -> {
                System.out.println(key + ": " + value);
            });

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                System.out.println("Email sent successfully. Response Code: " + response.getStatusCode());
            } else {
                System.err.println("Failed to send email. Status: " + response.getStatusCode());
            }

        }catch (IOException e){
            System.out.println("Email send failed");
            System.err.println("IOException while sending email:");
            e.printStackTrace();
            throw e;
        }
    }
}
