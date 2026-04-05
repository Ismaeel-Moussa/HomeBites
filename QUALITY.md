# Quality Attributes & Testing

This document explains the quality standards and testing approaches used in the Home Bites platform.

## 1. Quality Attributes
- **Usability:** The system applies the KISS (Keep It Simple, Stupid) principle. Users can browse the catalog and reach the WhatsApp order button quickly without complex navigation.
- **Responsiveness:** The React frontend uses Tailwind CSS to ensure the UI is fully responsive and looks great on mobile phones, which is how most users will order food.
- **Performance:** The ASP.NET Core backend uses the Repository Pattern with Entity Framework Core to make database queries fast and efficient.
- **Reliability:** By using the external WhatsApp API for order messaging, we ensure communication is handled by a highly reliable external server.

## 2. Testing Strategy
- **UI/UX Testing:** Manual testing across different screen sizes to ensure the food catalog displays correctly.
- **Integration Testing:** Verifying that the dynamic WhatsApp links generate the correct phone number and pre-filled message for the selected dish.
- **API Testing:** Checking the ASP.NET Core endpoints to ensure they return the correct JSON data for Families and Categories.
