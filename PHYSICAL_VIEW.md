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
