# Tanjore Degree Coffee ☕

![Tanjore Degree Coffee Banner](https://via.placeholder.com/1200x400.png?text=Tanjore+Degree+Coffee)  
*A modern e-commerce platform for authentic South Indian coffee and snacks.* 🌟

## Overview 📖

Tanjore Degree Coffee is a Next.js-based web application designed to bring the rich flavors of South Indian coffee and cuisine to your doorstep. Built with TypeScript, Supabase for backend services, and a sleek UI powered by custom components, this project offers a seamless browsing, cart management, and checkout experience. 🚀

## Features ✨

- **Menu Browsing**: Explore a variety of coffee specialties, traditional brews, contemporary coffees, South Indian snacks, and desserts. 🍵
- **Cart Management**: Add, reduce, or remove items from your cart with real-time updates synced to local storage and Supabase. 🛒
- **User Profiles**: Authenticated users can view their profile details and manage orders. 👤
- **Checkout Process**: Multi-step checkout with cart review, delivery details, and order confirmation. ✅
- **Responsive Design**: Optimized for both desktop and mobile devices. 📱💻
- **WhatsApp Support**: Integrated support link for customer assistance. 📞

## Tech Stack 🛠️

- **Framework**: [Next.js](https://nextjs.org/) (React framework with server-side rendering) ⚛️
- **Language**: [TypeScript](https://www.typescriptlang.org/) 📜
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL-based backend-as-a-service) 🗄️
- **Styling**: Tailwind CSS via custom `globals.css` and PostCSS 🎨
- **UI Components**: Shadcn components (e.g., Button, Card, Dialog) 🧩
- **Icons**: [Lucide React](https://lucide.dev/) 🖼️
- **Linting**: ESLint with TypeScript support ✅

## Getting Started 🚀

### Prerequisites ✅

- [Node.js](https://nodejs.org/) (v18 or later) 🟢
- [npm](https://npm.io/) (or npm/yarn) 📦
- [Supabase Account](https://supabase.com/) with a project set up 🗄️

### Installation ⚙️

1. **Clone the Repository** 📥
   ```bash
   git clone https://github.com/akshay0611/tanjore-degree-coffee.git
   cd tanjore-degree-coffee
   ```

2. **Install Dependencies** 📦
   ```bash
   npm install
   ```

3. **Set Up Environment Variables** 🔑
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the Development Server** ▶️
   ```bash
   npm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app. 🌐

### Scripts 📜

- `npm dev`: Start the development server ▶️
- `npm build`: Build the production app 🏗️
- `npm start`: Start the production server 🚀
- `npm lint`: Run ESLint to check code quality ✅

## Usage 🎯

- **Browse Menu**: Visit the `/menu` page to explore items. 🍽️
- **Add to Cart**: Click the "+" button on any item to add it to your cart. ➕
- **Manage Cart**: Open the cart dialog (shopping bag icon) to review, update quantities, or remove items. 🛒
- **Checkout**: Proceed through the checkout steps to place an order (requires authentication). ✅
- **Profile**: View your profile details under the `/auth` section after signing in. 👤


## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the repository. 🍴
2. Create a new branch (`git checkout -b feature/your-feature`). 🌿
3. Commit your changes (`git commit -m "Add your feature"`). 💾
4. Push to the branch (`git push origin feature/your-feature`). 📤
5. Open a pull request. 🙌

## License 📜

This project is licensed under the [MIT License](LICENSE). ✅

## Acknowledgments 🌟

- Built with ❤️ by [Akshay](https://github.com/akshay0611)
- Inspired by the rich tradition of South Indian coffee culture ☕
