import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import api from './api'; // Import the mock API

jest.mock('./api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('Finance App', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: [] }); // Default response for GET requests
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('adds a new transaction', async () => {
    // Mock the POST request
    api.post.mockResolvedValue({
      data: {
        id: 1,
        amount: 1000,
        category: 'Food',
        description: 'Lunch',
        is_income: true,
        date: '2024-10-27',
      },
    });

    // Mock the GET request after submission
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          amount: 1000,
          category: 'Food',
          description: 'Lunch',
          is_income: true,
          date: '2024-10-27',
        },
      ],
    });

   // Render the component
   await act(async () => {
    render(<App />);
  });

    // Check if the input fields are in the document
    const amountInput = await screen.findByLabelText(/Amount/i);
    expect(amountInput).toBeInTheDocument();

    // Fill in the form data and submit
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Food' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Lunch' } });
    fireEvent.click(screen.getByLabelText(/Income\?/i));
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-10-27' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Submit Transaction/i));

    // Wait for the new transaction to appear in the table
    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });
  });

  it('handles deleting a transaction', async () => {
    // Mock the GET request to fetch the initial transactions
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          amount: 1000,
          category: 'Food',
          description: 'Lunch',
          is_income: true,
          date: '2024-10-27',
        },
      ],
    });

    // Mock the DELETE request
    api.delete.mockResolvedValue({});

    // Mock the GET request after deletion to return an empty list
    api.get.mockResolvedValueOnce({ data: [] });

    // Render the component
    render(<App />);

    // Wait for the initial transaction to appear
    await waitFor(() => expect(screen.getByText('1000')).toBeInTheDocument());

    // Click the delete button for the transaction
    fireEvent.click(screen.getByText('Delete'));

    // Verify that the transaction is removed from the table
    await waitFor(() => expect(screen.queryByText('1000')).not.toBeInTheDocument());
  });
});
