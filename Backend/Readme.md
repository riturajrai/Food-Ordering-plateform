
FoodExpress
FoodExpress is a modern food ordering web application built with React, Redux, and Tailwind CSS. It allows users to browse menus, view dish details, add items to a cart, and manage their orders. The application supports user authentication, a responsive navigation bar with search functionality, and a guest cart that syncs with the backend upon login.
Table of Contents

Features
Tech Stack
Installation
Usage
Folder Structure
Available Scripts
API Endpoints
Contributing
License

Features

Responsive Navigation: A sticky navbar with search, cart, and user profile links, optimized for mobile and desktop.
Menu Browsing: Filter dishes by category (e.g., Pizza, Burgers) and search by name or description.
Dish Details: View detailed information about dishes, including images, nutritional info, and related items.
Cart Management: Add/remove items, adjust quantities, and persist cart for guest and authenticated users.
Authentication: Login/logout functionality with guest cart syncing to the backend.
Protected Routes: Restrict access to profile and order history for authenticated users.
Animations: Smooth transitions and hover effects using Framer Motion.

Tech Stack

Frontend: React, React Router, Redux (with redux-persist), Tailwind CSS, Framer Motion
Libraries: Axios (HTTP requests), React Icons
State Management: Redux Toolkit for cart management
Build Tool: Vite
Backend: Assumed to be a REST API (e.g., Node.js/Express) serving /api/dishes, /api/cart, etc.

Installation

Clone the Repository:
git clone https://github.com/your-username/foodexpress.git
cd foodexpress


Install Dependencies:Ensure you have Node.js (v16 or higher) installed. Then run:
npm install


Set Up Environment Variables:Create a .env file in the root directory and add the API URL:
VITE_API_URL=http://your-api-url


Start the Development Server:
npm run dev

Open http://localhost:5173 in your browser.


Usage

Browse Menu: Navigate to /menu to view dishes, filter by category, or search.
View Dish Details: Click a dish card to go to /food/:id for details and add to cart.
Manage Cart: Add items to the cart as a guest or logged-in user. Guest cart persists in localStorage and syncs to the backend on login.
Authentication: Log in to access /profile and /order-history. Log out to clear the cart.
Search: Use the navbar search bar to find dishes by name.

To debug cart issues:

Check localStorage for cart and persist:root:console.log(localStorage.getItem('cart'));
console.log(localStorage.getItem('persist:root'));


Clear localStorage if quantities are incorrect:localStorage.removeItem('cart');
localStorage.removeItem('persist:root');



Folder Structure
foodexpress/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── AuthContext.js   # Authentication context and utilities
│   │   ├── Navbar.js        # Responsive navigation bar
│   │   ├── Menu.js          # Menu page with filtering and search
│   │   ├── FoodDetails.js   # Dish details page
│   ├── redux/
│   │   ├── cartSlice.js     # Redux slice for cart management
│   │   ├── store.js         # Redux store with persistence
│   ├── App.js               # Main app with routing
│   ├── index.css            # Global styles (Tailwind)
│   ├── main.jsx             # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── README.md                # Project documentation

Available Scripts

npm run dev: Start the development server.
npm run build: Build the app for production.
npm run preview: Preview the production build locally.
npm run lint: Run ESLint for code linting (if configured).

API Endpoints
The app assumes a REST API with the following endpoints:

GET /api/dishes: Fetch all dishes.
GET /api/dishes/:id: Fetch a single dish by ID.
GET /api/cart/:user_id: Fetch cart for a user.
POST /api/cart: Add an item to the cart.
GET /api/offers: Fetch promotional offers.

Example API response for /api/dishes:
[
  {
    "id": 1,
    "name": "Margherita Pizza",
    "image_url": "url",
    "is_veg": true,
    "price": 200,
    "description": "Classic pizza with tomato and mozzarella",
    "category": "pizza",
    "nutrition": { "calories": "800", "protein": "20g", "fat": "30g", "carbs": "100g" }
  }
]

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature/your-feature.
Commit changes: git commit -m "Add your feature".
Push to the branch: git push origin feature/your-feature.
Open a pull request with a clear description of changes.

Please ensure:

Code follows ESLint rules (if configured).
Components are reusable and follow React best practices.
API calls handle errors gracefully.

License
This project is licensed under the MIT License. See the LICENSE file for details.
