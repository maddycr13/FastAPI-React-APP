# FastAPI-React-App

This project is a full-stack application using FastAPI for the backend and React for the frontend. It allows users to manage transactions (e.g., adding, deleting, and viewing transactions). Below is a guide to set up and run the project.


## Backend Setup

1. **Install Python dependencies**:

   Navigate to the backend directory and run:

 ```bash
 pip install -r requirements.txt
 ```
2. **Create and Activate Virtual Environment**:

   First, create a virtual environment if you haven't already:

```bash
python -m venv env
```


3. **Run the FastAPI backend**:

  After installing dependencies, start the FastAPI server:

  ```bash
  uvicorn main:app --reload
  ```

  The backend will be running on ```http://localhost:8000```.

4. **Database Initialization**:

  Ensure the SQLite database is set up by running any necessary migrations or setting up the database manually.

## Frontend Setup

1. **Navigate to the frontend directory and run**:

  ```bash
  npm install
  ```

2. **Run the React frontend** :

  After installing dependencies, start the React app:
  
  ```bash
  npm start
  ```

  The frontend will be running on ```http://localhost:3000.```

### Key Features
  - Transaction Management: Users can add, delete, and view transactions.
  - Date Picker: Integrated date picker in the frontend for transaction dates.
  - Pydantic Validation: Ensures correct request and response format in FastAPI.
  - SQLAlchemy ORM: Models and database interactions in the backend.
  - React Frontend: Displays and manages transaction records.



