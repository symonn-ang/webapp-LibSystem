## Instructions for Setting Up and Running the Application

### Prerequisites

- Node.js and npm
- SQL Server

### 1. Running the Backend

1. Open the backend project folder.
2. Configure the database connection string in `appsettings.json`.
3. Open a terminal in the backend project directory.
4. Restore the required packages

```bash
dotnet restore
```

5. Run the backend application:

```bash
dotnet run
```

The API will start at the URL specified in the project's launch settings.

### 2. Running the Frontend (React + Vite)

1. Open the frontend project folder.
2. Open a terminal in that directory.
3. Install the required dependencies:

```bash
npm install
```

4. Start the Vite development server:

```bash
npm run dev
```

5. Open the local URL displayed in the terminal, usually:

```text
http://localhost:5xxx
```

Make sure the frontend is configured to communicate with the running backend API.

### 3. Running the Application

1. Start the backend API first.
2. Start the frontend development server.
3. Open the frontend in your browser.
4. Use the application to manage books, members, and loans.
