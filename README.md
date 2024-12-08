# Ring Network Protocol Implementation

A full-stack implementation of a Ring Network Protocol with visualization and management capabilities.

## Project Structure

```
.
├── Backend/                 # Spring Boot backend
│   ├── src/                # Source files
│   ├── pom.xml            # Maven dependencies
│   └── ...
└── ring-network-ui/        # React frontend
    ├── src/               # Source files
    ├── public/           # Static files
    └── package.json      # npm dependencies
```

## Features

- Ring Network Visualization
- Message Routing and Management
- User Authentication and Authorization
- Admin Dashboard
- Real-time Network Statistics
- Message Tracking System

## Technology Stack

### Frontend
- React
- Material-UI
- React Router
- Axios

### Backend
- Spring Boot
- Spring Security
- MySQL
- JPA/Hibernate

## Getting Started

### Prerequisites
- Node.js (v14+)
- Java JDK 11+
- MySQL 8.0+
- Maven

### Backend Setup
1. Navigate to Backend directory:
   ```bash
   cd Backend
   ```
2. Update database configuration in `src/main/resources/application.properties`
3. Build and run:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd ring-network-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/verify` - Verify session

### Node Operations
- GET `/api/nodes` - Get all nodes
- POST `/api/nodes` - Create node
- PUT `/api/nodes/{nodeId}/status` - Update node status

### Message Operations
- POST `/api/messages` - Send message
- GET `/api/messages/{messageId}` - Get message
- GET `/api/messages/{messageId}/history` - Get message history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 