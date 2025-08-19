# KPN Customer Management Application

## Overview

This project is a customer management application developed as part of the KPN assignment.  
It allows users to create, read, update, and delete (CRUD) customers in a secure and structured way.

### Key Features
- Manage customer data (first name, last name, email, phone number)
- Form validation and error handling
- Secure API requests using token-based authentication
- Built with Spring Boot (backend) and React (frontend)

## Technology Stack
- **Backend:** Spring Boot (Java 23)  
- **Frontend:** React 18  
- **Database:** (Your DB here, e.g., MySQL/PostgreSQL)  
- **Authentication:** JWT tokens  

## Getting Started

### Prerequisites
- Java 23  
- Node.js 18+ and npm  
- Database setup (if not using in-memory DB)  

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Build the Spring Boot project:
    ```bash
    ./mvnw clean install
    ```

3. Run the backend server:
    ```bash
    ./mvnw spring-boot:run
    ```

4. The backend API will be available at:  
    ```
    http://localhost:8080 (port may differ depending on your setup)
    ```

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend server:
    ```bash
    npm run dev
    ```

4. Open your browser at:  
    ```
    http://localhost:5173 (port may differ depending on your setup)
    ```
