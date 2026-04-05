# Home Bites Project Architecture

## Change History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-03-30 | 1.0 | Initial architectural framework | [Your Name] |

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
* [Figure 2: Deployment Mapping](#figure-2)

---

## 1. Scope
*Define what this document covers and the boundaries of the system.*
* what will the system do and what will it not do 

## 2. References
*List any external documents, requirement specs, or technical standards used.*

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
*Explain the system's runtime behavior, including communication between services.*
<a name="figure-2"></a>
### Figure 2: Deployment Mapping
*(Place your infrastructure diagram here)*

## 7. Development Architecture
*Details regarding the code structure, libraries, and development environment.*

## 8. Physical Architecture
*The infrastructure setup, including servers, networks, and deployment environments.(e.g., users laptop)*


## 9. Scenarios
*Key use cases that demonstrate how the architecture functions under specific conditions.*
* stories, like when a customer browse for food

## 10. Size and Performance
*Metrics regarding data volume, user capacity, and expected latency.*

## 11. Quality
*How the system ensures reliability, maintainability, and portability.*

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
