# BookSwap - Digital Book Exchange Platform

BookSwap is a full-stack web application that enables users to exchange and manage digital books. Built with React for the frontend and Spring Boot for the backend, it provides a modern and secure platform for book enthusiasts.

## 🚀 Features

- User authentication and authorization
- Book browsing and management
- Modern, responsive UI with Tailwind CSS
- Secure JWT-based authentication
- RESTful API backend
- H2 in-memory database (configurable)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Java 17 or higher
- Node.js 16.x or higher
- npm 8.x or higher
- Maven 3.8.x or higher

## 🛠️ Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookswap.git
   cd bookswap
   ```

2. Build and run the Spring Boot application:
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
   The backend server will start on http://localhost:8080

3. Access H2 Console (for development):
   - URL: http://localhost:8080/h2-console
   - JDBC URL: jdbc:h2:mem:bookswap
   - Username: sa
   - Password: (leave empty)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend application will start on http://localhost:3000

## 🔧 Configuration

### Backend Configuration (application.properties)

Key configurations in `src/main/resources/application.properties`:
- Server port: 8080
- Database: H2 (in-memory)
- JWT expiration: 24 hours
- CORS: Configured for localhost:3000
- File upload limits: 10MB

### Frontend Configuration

Environment variables can be set in `.env` file:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080)

## 🏗️ Project Structure

```
bookswap/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── api/       # API integration
│   │   ├── hooks/     # Custom React hooks
│   │   └── lib/       # Utilities and constants
│   └── public/        # Static assets
└── src/               # Spring Boot backend
    └── main/
        ├── java/      # Java source files
        │   └── com/example/bookswap/
        │       ├── controller/  # REST controllers
        │       ├── model/       # Entity classes
        │       ├── repository/  # Data access
        │       ├── security/    # Security config
        │       └── service/     # Business logic
        └── resources/  # Application resources
            └── application.properties
```

## 🔒 Security

- JWT-based authentication
- Password encryption using Spring Security
- CORS configuration for frontend access
- Protected API endpoints
- Secure session management

## 🧪 Testing

### Backend Tests
```bash
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend
1. Update `application.properties` for production settings
2. Build the JAR:
   ```bash
   ./mvnw clean package
   ```
3. Run the application:
   ```bash
   java -jar target/bookswap-0.0.1-SNAPSHOT.jar
   ```

### Frontend
1. Create production build:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the contents of the `build` directory to your web server

## 📝 API Documentation

The API endpoints are available at:
- Authentication: `/api/auth/*`
- Books: `/api/books/*`
- Users: `/api/users/*`

Detailed API documentation can be accessed through Swagger UI when enabled.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

Aniqa bushra

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the frontend framework
- All contributors who have helped with the project