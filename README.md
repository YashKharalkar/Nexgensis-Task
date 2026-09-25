# Product Admin Dashboard (Frontend)

A high-performance, responsive Product Management Admin Dashboard built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios** using the [DummyJSON API](https://dummyjson.com).

Designed with a high-contrast **Orange, Black, and White** color palette, full **Indian Rupee (INR ₹)** pricing localization, and authentic **Indian names** for reviewer and user context.

---

## Live Demo & Repository
- **GitHub Repository**: [https://github.com/YashKharalkar/Nexgensis-Task](https://github.com/YashKharalkar/Nexgensis-Task)
- **Live Deployment**: *(Vercel / Netlify URL)*

---

## Color Palette & Visual Identity

Modern corporate palette using the requested colors:
- 🔵 **Deep Midnight Navy** (`#072D44`): Primary navigation bar, table headers, dark surfaces, and high-contrast text.
- 🌊 **Ocean Teal Blue** (`#064469`): Primary call-to-actions, active pagination tabs, edit buttons, badges, and focus indicators.
- ⚪ **Pure White** (`#FFFFFF`): Data table, cards, modal dialogs, and clean contrast surfaces.
- **Top-Left Logo Removal**: Per requirements, the icon box logo was removed in favor of clean, bold branding (`ADMINHUB`).

---

## Quick Start & Setup Steps

### 1. Prerequisites
- Node.js 18.x or 20.x installed
- npm or yarn

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/YashKharalkar/Nexgensis-Task.git
cd Nexgensis-Task

# Install dependencies
npm install
```

### 3. Run Locally in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## Demo Login Credentials

The DummyJSON API requires authentication against `POST /auth/login`:
- **Username**: `emilys`
- **Password**: `emilyspass`
- **Admin Display**: `Aarav Sharma (Admin)`

>  **Pro Tip**: Click the **"Auto Fill"** button directly on the login page for instant sign-in!

---

## Finished Features Checklist

| Feature | Description | Status |
| :--- | :--- | :---: |
| **Authentication** | `POST /auth/login`, stores JWT token in `localStorage`, route guard for protected `/products` routes, user name dropdown menu with profile info and logout button. |  Complete |
| **Indian Localization** | Prices displayed in Indian Rupees (**INR ₹**) with Indian number formatting (`₹2,499.00`). Admin and customer review names mapped to authentic Indian names (*Aarav Sharma, Priya Patel, Rohan Verma*, etc.). |  Complete |
| **Navy/Teal/White Theme** | 3-color palette (`#072D44`, `#064469`, and White) applied across Navbar, buttons, table headers, modals, cards, badges, and login screen. |  Complete |
| **Logo Removal** | Top-left logo icon removed from Navbar and login card; clean typography maintained. |  Complete |
| **Shared Axios Client** | Centralized Axios instance (`src/api/axiosClient.js`) that automatically injects `Authorization: Bearer <token>` and intercepts errors. |  Complete |
| **Product List View** | Desktop responsive data table with black header and mobile card layout with image, title, category, price in INR, rating, and stock. |  Complete |
| **Pagination** | Server-side `limit` and `skip` pagination, dynamic page buttons, Prev/Next buttons, page size selector (10, 20, 50), and counter (*"Showing 1–10 of 194"*). |  Complete |
| **Search with Debounce** | Searches `/products/search?q=...` with a 400ms debounce to prevent API spam while typing. Resets to page 1 automatically. |  Complete |
| **Race Condition Guard** | Request ID sequence counter ensures older/delayed responses (`&delay=2000`) never overwrite newer search results. |  Complete |
| **Category Filter & Sorting** | Dynamic categories from `/products/categories` and sorting by `title`, `price (INR)`, and `rating` in ascending/descending order. |  Complete |
| **URL State Sync** | All parameters (`?page=`, `?limit=`, `?search=`, `?category=`, `?sortBy=`, `?order=`) remain in sync with the URL. Refreshing or sharing maintains state. |  Complete |
| **URL Resiliency** | Invalid inputs like `?page=abc`, `?page=-1`, or `?page=999` are safely sanitized and gracefully handled without crashing. |  Complete |
| **Product Details (`/products/[id]`)**| Comprehensive details view with interactive image gallery, INR price, stock, policies, reviews with Indian names, and custom 404 screen. |  Complete |
| **Add / Edit / Delete CRUD** | Add & Edit modal with field validation (positive price & stock checks) and custom Delete confirmation popup. |  Complete |
| **Optimistic Frontend Updates** | Changes reflect immediately in UI state even though DummyJSON's backend is a read-only mock API. |  Complete |
| **Loading, Empty & Error States**| Brand orange spinner, friendly empty states with filter reset, and network error alerts with a **Retry** button. |  Complete |
| **Rapid-Click Protection** | Buttons disable during active submission to prevent duplicate concurrent API calls. |  Complete |

---

## Architectural Choices & Explanations

### 1. Pure Frontend Approach & Optimistic CRUD
- **Why**: DummyJSON is a static mock API; calling `POST /products/add`, `PUT /products/:id`, or `DELETE /products/:id` returns a simulated object but does not persist changes to DummyJSON's remote database.
- **Approach**: The application maintains local React state (`localAddedProducts`, `localUpdatedProducts`, `localDeletedIds`) and merges them with fetched API responses. When a user creates, edits, or deletes an item, the action is dispatched to the API and simultaneously updated in frontend state for an authentic admin experience.

### 2. Search vs. Category Handling
- **Constraint**: The DummyJSON API offers distinct endpoints (`/products/search?q=` and `/products/category/:category`) and does not support filtering by category and searching by keyword simultaneously on the server.
- **Solution**: When a user inputs a search keyword, the application searches globally across all products and disables the category selector with a clear info badge (`"Searching across all categories"`). Clearing the search reactivates category filtering.

### 3. Shared Axios Setup (`src/api/axiosClient.js`)
- Request interceptors inspect `localStorage` and inject the `Authorization: Bearer <token>` header on every outgoing HTTP request.
- Centralized response interceptors catch 401 Unauthorized errors and handle session cleanup in one location.

### 4. Price & Name Localization
- A dedicated utility `src/utils/currency.js` formats all prices using the `Intl.NumberFormat('en-IN')` standard with the `₹` symbol.
- `src/utils/indianNames.js` uses a deterministic hashing algorithm to map original customer review names to realistic Indian names (*Aarav Sharma, Priya Patel, Sneha Reddy*, etc.) consistently.

---

## Problem Faced & How It Was Fixed

### The Challenge: Search Race Conditions with Fast Typing
When users type quickly into a search box, multiple network requests can be in flight simultaneously. If an older search query takes longer to resolve (for instance, due to network latency or when testing with `&delay=2000`), its stale response could arrive **after** a newer request and overwrite the latest search results on screen.

### The Solution:
1. **Debounce Timer**: Implemented a 400ms delay so API calls only trigger after the user finishes typing.
2. **Request Sequence Reference (`latestRequestIdRef`)**: In `src/app/products/page.js`, every fetch operation increments an integer ref:
   ```javascript
   const currentRequestId = ++latestRequestIdRef.current;
   const data = await productService.getProducts(...);

   // If another search triggered while this request was in flight, discard the stale response
   if (currentRequestId !== latestRequestIdRef.current) {
     return;
   }
   ```
   This guarantees that only the newest request ever updates the application state, regardless of response arrival order.

---

## Where AI Helped

1. **Architecture & Race-Condition Hardening**: Crafting the deterministic request ID reference pattern to safeguard against asynchronous race conditions.
2. **Design Tokens & High-Contrast Aesthetics**: Translating the orange, black, and white design identity into Tailwind utility classes with accessible contrast ratios.
3. **Robust Sanitization**: Writing edge-case validation for URL search parameters (`?page=abc`, `?page=999`) and input forms.
4. **Indian Localization Utilities**: Generating the deterministic Indian naming mapper for reviews and profile personas.

---

## Project Structure

```text
├── src/
│   ├── api/
│   │   └── axiosClient.js          # Shared Axios instance with Bearer interceptors
│   ├── services/
│   │   ├── authService.js          # Auth API calls (login)
│   │   └── productService.js       # Product list, categories, details, CRUD calls
│   ├── context/
│   │   └── AuthContext.js          # React Auth Context & session management
│   ├── utils/
│   │   ├── currency.js             # INR (₹) formatting utility
│   │   └── indianNames.js          # Indian name localization utility
│   ├── components/
│   │   ├── Navbar.js               # Black navbar with user dropdown & logout
│   │   ├── FilterBar.js            # Debounced search, categories, sort, & add button
│   │   ├── ProductTable.js         # Responsive desktop table with black header & INR prices
│   │   ├── ProductCards.js         # Responsive mobile card layout
│   │   ├── Pagination.js           # Limit/skip pagination & page size dropdown
│   │   ├── ProductModal.js         # Add & Edit modal with INR validation
│   │   ├── DeleteConfirmModal.js   # Delete confirmation modal
│   │   ├── LoadingSpinner.js       # Brand orange loading spinner
│   │   └── ErrorState.js           # Error state with Retry action
│   └── app/
│       ├── layout.js               # Root layout & providers
│       ├── page.js                 # Smart redirect to /products or /login
│       ├── globals.css             # Base styles & orange selection color
│       ├── login/page.js           # Sign-in page with demo credentials
│       ├── products/page.js        # Main product dashboard
│       └── products/[id]/page.js   # Product details & 404 page
```
