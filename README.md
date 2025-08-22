# ESG Calculator Application

A comprehensive, full-stack ESG (Environmental, Social, and Governance) calculator application designed for funds to evaluate their issuers. This application features a modern dark-themed UI, a configurable scoring engine, Excel export capabilities, and support for bulk data operations.

## Features

### Core ESG Calculator Module
- **Issuer Management**: Full CRUD operations for managing issuers with customizable fields.
- **Company Management**: Full CRUD operations for companies, with the ability to link them to issuers.
- **Questionnaire System**:
  - Dynamic questionnaire creation.
  - Support for various question types (multiple choice, yes/no, scale, text input).
  - Question categorization by ESG sections (Environmental, Social, Governance).
  - Ability to create custom question templates.

### Configurable Scoring Engine
- **Question Scoring**:
  - Points-based system for each question.
  - Weight assignment for questions.
  - Conditional scoring logic.
- **Section Scoring**:
  - Aggregation methods (sum, average, weighted average).
  - Section weight configuration.
  - Custom scoring formulas.
- **Overall Scoring**:
  - Final ESG score calculation.
  - Section contribution visualization.
  - Historical score tracking.

### Excel Export System
- **Configurable Templates**:
  - Customizable report layouts.
  - Company branding (logo, name, colors).
  - Additional text sections.
- **Data Export**:
  - All question responses.
  - Score breakdowns.
  - Visualizations (charts).
- **Historical Data Export**:
  - Grid view of all historical runs.
  - Comparison views.
  - Trend analysis.

### User Interface
- **Design System**:
  - Dark theme as default.
  - Light theme option.
  - Responsive design for all screen sizes.
  - Consistent component library using shadcn/ui.
- **User Experience**:
  - Loading screens during calculations.
  - Progress indicators for bulk operations.
  - Toast notifications for user feedback.
  - Intuitive navigation and information hierarchy.

### Data Management
- **Bulk Upload**:
  - CSV/Excel template download.
  - Data validation during upload.
  - Error reporting and correction interface.
- **Data Import/Export**:
  - Backup and restore functionality.
  - Data migration tools.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Language**: Python
- **Database**: SQLite (for development, easily switchable to PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Data Processing**: Pandas
- **Excel Export**: openpyxl, xlsxwriter

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- Python (v3.8 or later)
- Python (v3.9 - v3.12 recommended). Using newer, pre-release Python versions (like 3.13+) may cause build failures for dependencies like Pandas.
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd esg-calculator
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Python Backend with `uv`**
    This project uses `uv`, a fast Python package installer and resolver, to manage the backend environment.

    *   **Install `uv`** (if you haven't already):
        ```bash
        curl -LsSf https://astral.sh/uv/install.sh | sh
        ```
        After installing, you may need to restart your shell or add `uv` to your PATH.

    *   **Create a Virtual Environment and Install Dependencies**:
        Navigate to the backend directory and use `uv` to create a virtual environment and install the packages from `requirements.txt`.
        ```bash
        cd backend
        uv venv -p python3.12  # Or another supported Python version
        source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
        uv pip install -r requirements.txt
        cd ..
        ```
        This single command chain creates a `.venv` folder, activates it, and installs all necessary Python packages.

4.  **Set up the Database**
    The application uses SQLite by default. The database file will be created automatically when you run the backend for the first time. If you want to use PostgreSQL, update the `SQLALCHEMY_DATABASE_URL` in `backend/models.py` and `backend/database.py`.

### Running the Application

1.  **Run the Backend Server**
    In a separate terminal, start the FastAPI server.
    ```bash
    npm run backend
    # or manually
    # cd backend
    # uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    The backend API will be available at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

2.  **Run the Frontend Development Server**
    In the main project directory, start the Next.js development server.
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application will be available at `http://localhost:3000`.

    **Troubleshooting:**
    If you encounter an error like `Error: Cannot find module 'tailwindcss-animate'`, it means that the frontend dependencies were not installed correctly. Please ensure you have run `npm install` in the root directory of the project.

## Project Structure

```
.
├── backend/                 # Python FastAPI backend
│   ├── routers/            # API endpoint modules
│   │   ├── auth.py
│   │   ├── companies.py
│   │   ├── issuers.py
│   │   ├── questionnaires.py
│   │   ├── questions.py
│   │   ├── responses.py
│   │   ├── scoring.py
│   │   └── reports.py
│   ├── models.py           # SQLAlchemy database models
│   ├── schemas.py          # Pydantic models for request/response
│   ├── crud.py             # CRUD operations
│   ├── database.py         # Database session management
│   ├── main.py             # FastAPI app entry point
│   └── requirements.txt    # Python dependencies
├── src/                    # Next.js frontend source code
│   ├── app/                # App Router pages and layouts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   └── index.ts
│   ├── hooks/              # Custom React hooks (e.g., useApi)
│   ├── lib/                # Utility functions (e.g., cn)
│   ├── providers/          # React providers (e.g., ReactQueryProvider)
│   ├── types/              # TypeScript type definitions
│   └── globals.css         # Global CSS styles
├── components.json         # shadcn/ui configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Node.js dependencies and scripts
└── README.md               # This file
```

## API Endpoints

The backend provides a RESTful API with the following key endpoints:

- **Authentication**: `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/refresh`
- **Issuers**: `/api/v1/issuers` (GET, POST), `/api/v1/issuers/{id}` (GET, PUT, DELETE)
- **Companies**: `/api/v1/companies` (GET, POST), `/api/v1/companies/{id}` (GET, PUT, DELETE), `/api/v1/companies/bulk-upload` (POST)
- **Questionnaires**: `/api/v1/questionnaires` (GET, POST), `/api/v1/questionnaires/{id}` (GET, PUT, DELETE)
- **Questions**: `/api/v1/questions` (GET, POST), `/api/v1/questions/{id}` (GET, PUT, DELETE)
- **Responses**: `/api/v1/responses` (GET, POST), `/api/v1/responses/{id}` (GET, PUT, DELETE)
- **Scoring**: `/api/v1/scoring/calculate` (POST), `/api/v1/scoring/configurations` (GET, POST)
- **Reports**: `/api/v1/reports` (GET), `/api/v1/reports/{id}` (GET), `/api/v1/reports/generate` (POST), `/api/v1/reports/excel/{id}` (GET)

For a complete and interactive documentation, run the backend and navigate to `http://localhost:8000/docs`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.