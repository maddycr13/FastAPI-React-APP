from fastapi import FastAPI, HTTPException, Depends, Body
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Transaction
from datetime import datetime



app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/transactions/")
def create_transaction(transaction_data: dict = Body(...), db: Session = Depends(get_db)):
    try:
        # Log the received data
        print(f"Received data: {transaction_data}")

        # Convert the date string to a Python date object if it's a string
        if isinstance(transaction_data['date'], str):
            transaction_data['date'] = datetime.strptime(transaction_data['date'], "%Y-%m-%dT%H:%M:%S.%fZ").date()

        # Create a new transaction instance
        transaction = Transaction(
            amount=transaction_data['amount'],
            category=transaction_data['category'],
            description=transaction_data['description'],
            is_income=transaction_data['is_income'],
            date=transaction_data['date']
        )

        # Add the transaction to the database
        db.add(transaction)
        db.commit()

        return {"message": "Transaction created successfully"}

    except Exception as e:
        print(f"Error during transaction creation: {e}")
        raise HTTPException(status_code=400, detail=f"Error processing transaction: {str(e)}")


@app.get("/transactions/")
def get_transactions(db: Session = Depends(get_db)):
    try:
        transactions = db.query(Transaction).all()
        return transactions
    except Exception as e:
        print(f"Error fetching transactions: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.delete("/transactions/")
def delete_transaction(transaction_data: dict = Body(...), db: Session = Depends(get_db)):
    transaction_id = transaction_data.get('id')
    
    if not transaction_id:
        raise HTTPException(status_code=400, detail="Invalid data, 'id' is required")

    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()

    return {"message": "Transaction deleted successfully"}


@app.put("/transactions/{transaction_id}")
def update_transaction(transaction_id: int, transaction_data: dict, db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Convert date string to Python date object if it is a string
    if 'date' in transaction_data and isinstance(transaction_data['date'], str):
        try:
            transaction_data['date'] = datetime.strptime(transaction_data['date'], "%Y-%m-%dT%H:%M:%S.%fZ").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")

    transaction.amount = transaction_data.get('amount', transaction.amount)
    transaction.category = transaction_data.get('category', transaction.category)
    transaction.description = transaction_data.get('description', transaction.description)
    transaction.is_income = transaction_data.get('is_income', transaction.is_income)
    transaction.date = transaction_data.get('date', transaction.date)

    db.commit()
    return {"message": "Transaction updated successfully"}