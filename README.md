# KPN Customer Management Application

## Overview

This project is a customer management application developed as part of the KPN assignment.  
It allows users to create, read, update, and delete (CRUD) customers in a secure and structured way.

**Note:** The main focus of this project was on the backend implementation.

### Key Features
- Manage customer data (first name, last name, email, phone number)
- Form validation and error handling
- Secure API requests using token-based authentication
- Built with Spring Boot (backend) and React (frontend)
- Role-based access:
  - **Admin:** Can create, update, and delete customers
  - **User:** Can only create new customers
- Database is automatically populated on running the backend

## Technology Stack
- **Backend:** Spring Boot (Java 17)  
- **Frontend:** React 19.1.1
- **Database:** SQLite  
- **Authentication:** JWT tokens  

## Getting Started

### Prerequisites
- Java 17
- Node.js 23+ and npm  

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

### Using the Application
- To use the app, simply **register an account** and **log in**.
- Depending on your role (admin or user), you will have access to different customer management features.
- The database is automatically populated when the backend runs.
