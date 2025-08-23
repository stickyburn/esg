# ESG Calculator Application

A comprehensive, full-stack ESG (Environmental, Social, and Governance) calculator application designed for funds to evaluate their issuers.

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/stickyburn/esg.git
   cd esg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   The application uses Prisma ORM with SQLite by default. To set up the database:
   
   ```bash
   # Navigate to server directory
   cd server
   
   # Install Prisma CLI (if not already installed globally)
   npm install -g prisma
   
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   
   # Optional: Seed the database with initial data
   npm run seed
   
   # Return to project root
   cd ..
   ```

   **For PostgreSQL:**
   - Update the `DATABASE_URL` in the `server/.env` file
   - The database will be created automatically when you run the backend

### Running the Application

1. **Run the Backend Server**
   In a separate terminal, start the Node.js server:
   ```bash
   npm run backend
   ```
   The backend API will be available at `http://localhost:8000`.

2. **Run the Frontend Development Server**
   In the main project directory, start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend application will be available at `http://localhost:3000`.

### Troubleshooting

If you encounter an error like `Error: Cannot find module 'tailwindcss-animate'`, ensure you have run `npm install` in the root directory of the project.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Prisma ORM, SQLite/PostgreSQL
- **Authentication**: JWT