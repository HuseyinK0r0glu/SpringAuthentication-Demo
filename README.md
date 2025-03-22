# OAuth2 Project

This project demonstrates an OAuth2 authentication flow with both traditional login and email verification functionality using Spring Boot for the backend and React for the frontend.

## Features:
- **OAuth2 Authentication**: Secure authentication using OAuth2.
- **Traditional Login**: User registration and login with email verification.
- **Frontend**: Built with React, providing a user-friendly interface for login, sign-up, and email verification.

## Technologies Used:
- **Backend**: Spring Boot, OAuth2, JWT, Spring Security
- **Frontend**: React
- **Database**: (MySQL)

## Setting Up the Project

### Backend Setup:
1. Clone the repository.
2. In the backend directory, create a file named `application.properties` to store sensitive information like your OAuth2 client credentials, database configurations, etc.

Example of `application.properties` content:

properties
# OAuth2 Client Credentials
oauth.client.id=your-client-id
oauth.client.secret=your-client-secret
oauth.client.authorizationUri=https://oauth.provider.com/authorize
oauth.client.tokenUri=https://oauth.provider.com/token
oauth.client.redirectUri=http://localhost:8080/login/oauth2/code

# Database Configuration (Example)
spring.datasource.url=jdbc:mysql://localhost:3306/yourdatabase
spring.datasource.username=your-username
spring.datasource.password=your-password
