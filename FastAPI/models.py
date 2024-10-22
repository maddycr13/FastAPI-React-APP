from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer)  # Ensure the correct type
    category = Column(String)
    description = Column(String)
    is_income = Column(Boolean)
    date = Column(Date)  # This should be a Date type if you're working with dates
