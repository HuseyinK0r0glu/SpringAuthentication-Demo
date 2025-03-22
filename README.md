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


## Requirements

Before running the application, ensure you have the following environment variables configured:

- **GitHub OAuth2 Credentials**:
  - `GITHUB_CLIENT_ID` - Your GitHub OAuth2 client ID.
  - `GITHUB_CLIENT_SECRET` - Your GitHub OAuth2 client secret.

- **Google OAuth2 Credentials**:
  - `GOOGLE_CLIENT_ID` - Your Google OAuth2 client ID.
  - `GOOGLE_CLIENT_SECRET` - Your Google OAuth2 client secret.

- **SendGrid API Key**:
  - `SENDGRID_API_KEY` - Your SendGrid API key for sending emails.

- **MySQL Database Configuration**:
  - `spring.datasource.url` - Your MySQL database URL.
  - `spring.datasource.username` - The MySQL database username.
  - `spring.datasource.password` - The MySQL database password.

## How to Set Environment Variables

1. **On Linux or macOS**: You can add the environment variables to your `.bashrc` or `.zshrc` file:

    ```bash
    export GITHUB_CLIENT_ID="your_github_client_id"
    export GITHUB_CLIENT_SECRET="your_github_client_secret"
    export GOOGLE_CLIENT_ID="your_google_client_id"
    export GOOGLE_CLIENT_SECRET="your_google_client_secret"
    export SENDGRID_API_KEY="your_sendgrid_api_key"
    ```

   Then, run:

    ```bash
    source ~/.bashrc  # or source ~/.zshrc
    ```

2. **On Windows**: Set the environment variables using the command prompt or PowerShell:

    ```powershell
    setx GITHUB_CLIENT_ID "your_github_client_id"
    setx GITHUB_CLIENT_SECRET "your_github_client_secret"
    setx GOOGLE_CLIENT_ID "your_google_client_id"
    setx GOOGLE_CLIENT_SECRET "your_google_client_secret"
    setx SENDGRID_API_KEY "your_sendgrid_api_key"
    ```

## Running the Application

1. Make sure you have MySQL running and the database is set up.
2. Ensure all environment variables are configured.
3. Run your backend code.
4. Run your frontend code with npm start.

5. Visit `http://localhost:3000` to access the application.

## Notes

- The application will use the credentials stored in the environment variables to authenticate with GitHub and Google.
- Emails are sent using SendGrid. Make sure the `SENDGRID_API_KEY` is set correctly.
