# Home Bites Project Architecture

## Change History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-03-30 | 1.0 | Initial architectural framework | Ali Anaam |
| 2026-04-05 | 1.1 |  Added Process Architecture, Size & Performance, and Quality | Ali Anaam  |

## Table of Contents
1. [Scope](#1-scope)
2. [References](#2-references)
3. [Software Architecture](#3-software-architecture)
4. [Architectural Goals & Constraints](#4-architectural-goals--constraints)
5. [Logical Architecture](#5-logical-architecture)
6. [Process Architecture](#6-process-architecture)
7. [Development Architecture](#7-development-architecture)
8. [Physical Architecture](#8-physical-architecture)
9. [Scenarios](#9-scenarios)
10. [Size and Performance](#10-size-and-performance)
11. [Quality](#11-quality)
12. [Appendices](#appendices)

## List of Figures
* [Figure 1: High-Level Logical Component Diagram](#figure-1)
* [Figure 2: Order Process Sequence Diagram](#figure-2)

---

## 1. Scope
*Define what this document covers and the boundaries of the system.*
* what will the system do and what will it not do 

## 2. References
* Kruchten’s 4+1 Model: Architectural framework used for this document. [4+1 architectural view model](https://en.wikipedia.org/wiki/4%2B1_architectural_view_model).

## 3. Software Architecture
*Provide a high-level overview of the system's structural design.*
* make 1-2 diagrams for the system overview

## 4. Architectural Goals & Constraints
* **Goals:** (e.g., High availability, security, 30 users at the same time)
* **Constraints:** (e.g., Must use AWS, legacy database compatibility)

## 5. Logical Architecture
This section details the domain entities, their relationships, and the architectural layers of the Home Bites platform.

<a name="figure-1"></a>
### Figure 1: High-Level Logical Component Diagram
![Home Bites Logical View Diagram](./Logical-View-UMLDigram.png)

## 6. Process Architecture
This part describes the system workflow and interactions between components during runtime.
<a name="figure-2"></a>
### Figure 2: Order Process Sequence Diagram
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend API (.NET)
    participant D as Database (SQL)
    participant W as WhatsApp

    U->>F: Opens Home Bites
    F->>B: GET /api/dishes
    B->>D: Query available dishes
    D-->>B: Return data
    B-->>F: Return JSON response
    F-->>U: Display Dish Gallery
    
    U->>F: Clicks "Order via WhatsApp"
    F->>F: Generate pre-filled message
    F->>W: Redirect to wa.me/number?text=...
    W-->>U: Open Chat with Order Details
  ```
### Process Explanation
1. **Access:** The user opens the Home Bites platform.  
2. **Request:** The frontend sends a request to the backend API to retrieve available dishes.  
3. **Fetch:** The backend communicates with the database to fetch the required data.  
4. **Display:** The data is returned to the frontend and displayed to the user.  
5. **Selection:** The user selects a dish and clicks on "Order via WhatsApp".  
6. **Generation:** The system generates a pre-filled message containing dish details.  
7. **Redirection:** The user is redirected to WhatsApp to complete the order externally.

## 7. Development Architecture
*Details regarding the code structure, libraries, and development environment.*

## 8. Physical Architecture
*The infrastructure setup, including servers, networks, and deployment environments.(e.g., users laptop)*


## 9. Scenarios
*Key use cases that demonstrate how the architecture functions under specific conditions.*
* stories, like when a customer browse for food

## 10. Size and Performance
This system is designed for a small number of users, focusing on simplicity and efficiency.

### Data Size Estimation
* **Families:** 50 – 100 records  
* **Dishes:** 200 – 500 records  
* **Categories:** 5 – 20 records  
* **Images:** Stored as external URLs (optimized for fast loading)  

### Performance Requirements
* **API Response Time:** < 2 seconds  
* **Page Load Time:** < 3 seconds  
* **Concurrent Users:** Supports up to 30 users  

### Optimization Techniques
* Basic query optimization using **Entity Framework Core**.  
* Simple pagination to limit data transfer.  
* Use of asynchronous API calls to prevent blocking.  

## 11. Quality

### Error Handling

The system uses simple error handling to ensure a smooth user experience for a small number of users.

#### Frontend Error Handling

- Display simple and clear messages:
  - "Failed to load data"
  - "Something went wrong"
- Allow the user to retry the request  
- Basic input validation before sending requests  

---

#### Backend Error Handling

- Use try-catch blocks to handle errors  
- Return simple HTTP status codes:

| Code | Description |
|------|------------|
| 200  | Success |
| 400  | Bad Request |
| 404  | Not Found |
| 500  | Internal Server Error |

---

#### Common Error Scenarios

- Server or database connection failure → 500 error  
- Requested dish not found → 404 error  
- Invalid user input → 400 error  

---

#### Logging

- Basic error logging for debugging purposes

### Security Considerations

Since the system redirects users to WhatsApp for order communication, it does not handle or store sensitive data such as payment information.

This design reduces security risks because:

- No payment or financial data is processed within the system 
- No sensitive user information is stored in the database  
- Communication is handled through WhatsApp, which provides its own security mechanisms  

Overall, the system minimizes security vulnerabilities by keeping transactions external and maintaining a simple data structure.

---

## Appendices

### Design Principles & Architectural Patterns
The Home Bites backend prioritizes maintainability and scalability through the following architectural patterns:

Layered Architecture (Separation of Concerns)
System logic is divided to prevent cascading failures:

Domain Layer: Contains core business entities (Family, Dish, Category) and Identity models.

Data Access Layer: Uses EF Core to manage the database, isolating SQL logic.

API/Presentation Layer: ASP.NET Controllers handle HTTP requests and delegate heavy lifting to services.

The Repository Pattern
Controllers interact with abstraction interfaces (IFamilyRepository, IDishRepository) instead of querying the database directly. This centralizes data access and makes unit testing much easier.

Dependency Injection (DI)
Services and repositories are injected into controllers at runtime using ASP.NET Core's built-in DI, preventing tight coupling between classes.

SOLID Principles

SRP (Single Responsibility): Classes have one strict job (e.g., WhatsAppLinkGeneratorService only formats links; it doesn't touch the database).

DIP (Dependency Inversion): Controllers depend on abstractions (interfaces) rather than concrete implementations, allowing us to swap out logic easily.

Security & Identity Abstraction
Using ASP.NET Core Identity provides secure, industry-standard password hashing and token validation, linking a family's dashboard access (FamilyId) directly to an ApplicationUser.

Acronyms and Definitions
API: Protocols allowing the React frontend to communicate with the ASP.NET Core backend.

CORS: A security feature allowing the frontend to safely make HTTP requests to the backend across different domains.

DI (Dependency Injection): Providing objects to a class rather than the class creating them directly, promoting loose coupling.

EF Core: The Object-Relational Mapper (ORM) bridging C# models with the SQL Server database (Code-First approach).

Identity (ASP.NET Core Identity): The built-in framework managing secure user authentication and authorization.

Repository Pattern: Abstracting database operations behind interfaces to separate data access from business logic.

SOLID: Five object-oriented design principles intended to make software flexible and maintainable.

SPA (Single Page Application): A web app (React.js) that dynamically updates the current page without reloading, resulting in a faster user experience.

UML: A standard modeling language used to visualize software architecture.
