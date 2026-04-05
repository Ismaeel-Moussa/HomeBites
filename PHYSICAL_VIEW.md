# Physical View & Deployment

This document defines the deployment architecture for the Home Bites platform. The system operates on a standard Client-Server Architecture.

## System Nodes

1. **Client Device (Frontend)**
   - **Environment:** Modern web browser on a smartphone or desktop.
   - **Application:** React.js Single Page Application (SPA).
   - **Purpose:** Renders the digital food catalog and user interface.

2. **Web Server (Backend)**
   - **Environment:** ASP.NET Core Runtime.
   - **Application:** ASP.NET Core Web API.
   - **Purpose:** Handles API logic and serves data to the frontend.

3. **Database Server (Data Tier)**
   - **Environment:** SQL Server.
   - **Purpose:** Stores relational data for Families, Dishes, and Categories. Managed via Entity Framework Core.

4. **External Integrations**
   - **API:** WhatsApp API.
   - **Purpose:** Handles external order delegation using dynamic URI strings.

## Deployment Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Devices (Mobile / PC)"]
        UI["React.js SPA (Frontend)"]
    end

    subgraph Server ["Web Server"]
        API["ASP.NET Core Web API (Backend)"]
    end

    subgraph Database ["Database Server"]
        DB[("SQL Server")]
    end

    subgraph External ["External Services"]
        WA["WhatsApp API"]
    end

    UI -- "HTTPS (REST API)" --> API
    API -- "Entity Framework Core" --> DB
    UI -- "Order Redirect" --> WA
