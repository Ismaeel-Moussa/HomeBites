# HomeBites Implementation Plan - Team Assignment

This plan outlines the development roadmap for the HomeBites digital catalog platform. The project will use **React**, **Ant Design**, and **SCSS** for the frontend, connecting to the existing **ASP.NET Core** backend.

## User Review Required

> [!IMPORTANT]
> **Technology Stack**: We have confirmed the use of **Ant Design** and **SCSS**. All team members should follow the established theme (Orange/Warm colors derived from the Stitch designs).
> **Images**: Images are served as static files from the backend (`wwwroot/images/`). Ensure the frontend points to the correct backend host URL.

## Proposed Changes

### 1. Account, Auth & System Design
**Assigned to: Ismaeel Moussa**

- **Account**: Build Login and Sign-Up pages using Ant Design `Form` components.
- **Auth**: Integrate with `AuthController` for JWT authentication and state management.
- **System Design**: Establish the global SCSS theme and shared UI layouts (Header/Footer/Sidebar).
- **UI Foundation**: Configure Ant Design's `ConfigProvider` for a consistent look.

#### [MODIFY] [App.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/App.tsx)
#### [MODIFY] [index.scss](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/index.scss)
#### [NEW] [Login.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/pages/Login.tsx)
#### [NEW] [SignUp.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/pages/SignUp.tsx)

---

### 2. Home Page & Discovery
**Assigned to: Ali Salih Ali Ishwayil (Ali Shwail)**

- Build the main Home Page layout.
- Implement the Hero section and search bar.
- Create the Dish Gallery with Ant Design `Card` components.
- Integrate with `DishesController` and `CategoriesController` for filtering and searching.

#### [NEW] [Home.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/pages/Home.tsx)
#### [NEW] [DishCard.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/components/DishCard.tsx)

---

### 3. Menu Management (Cook Dashboard)
**Assigned to: Ali Fuad Ali Qaid Anaam (Ali Anaam)**

- Build the dish management interface for family owners.
- Implement a table or list view of current menu items.
- Create a Modal for adding/editing dishes, including `Upload` component for images.
- Connect to `DishesController` (POST/PUT/DELETE).

#### [NEW] [MenuManagement.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/pages/dashboard/MenuManagement.tsx)
#### [NEW] [DishForm.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/components/DishForm.tsx)

---

### 4. Family Profile & Menu (Public View)
**Assigned to: Omar Mohamed Mahdi**

- Build the public-facing profile page for a specific family business.
- Display family biography, location, and their full dish catalog.
- Implement the "Order via WhatsApp" service/button that generates dynamic links based on dish name and family phone number.

#### [NEW] [FamilyProfile.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/pages/FamilyProfile.tsx)
#### [NEW] [WhatsAppButton.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/components/WhatsAppButton.tsx)

---

### 5. Profile Management (Cook Dashboard)
**Assigned to: Yousef Alreyashi**

- Build the "Edit Profile" section in the Cook Dashboard.
- Allow families to update their story, location, and coverage area.
- Ensure integration with the backend `FamiliesController` for profile updates.

#### [NEW] [ProfileManagement.tsx](file:///c:/Users/ismail/Documents/Programming/HomeBites/HomeBites.Frontend/src/pages/dashboard/ProfileManagement.tsx)

## Verification Plan

### Automated Tests
- Build verification: `npm run build` in the frontend area.
- API Connectivity: Verify that `FamiliesController` returns data when called from the profile page.

### Manual Verification
- Test User Flow: Sign up as a family -> Add a dish -> View dish on Home Page -> Click "Order via WhatsApp".
- Responsive Design: Test pages on mobile and desktop views using the browser.
