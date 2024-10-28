import axios from 'axios';

// Mock axios before importing the API module
jest.mock('axios'); // Mock the entire axios module

let mockAxiosInstance;

// Set up the mock before importing the api
beforeAll(() => {
  // Create a mock Axios instance with the necessary properties and methods
  mockAxiosInstance = {
    defaults: {
      baseURL: 'http://localhost:8000',
    },
    get: jest.fn(),
    post: jest.fn(),
  };

  // Mock axios.create to return the mock instance
  axios.create.mockReturnValue(mockAxiosInstance);
});

// Now, import the API module after setting up the mock
let api;
beforeAll(() => {
  api = require('./api').default;
});

describe('API instance', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have the correct baseURL', () => {
    // Check if the baseURL is set correctly on the mocked instance
    expect(api.defaults.baseURL).toBe('http://localhost:8000');
  });
  it('should make a GET request to the correct URL', async () => {
    const responseData = { data: 'Test response' };
    mockAxiosInstance.get.mockResolvedValue(responseData);

    const response = await api.get('/test-endpoint');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
    expect(response).toEqual(responseData);
  });

  it('should make a POST request with the correct data', async () => {
    const responseData = { data: 'Post response' };
    mockAxiosInstance.post.mockResolvedValue(responseData);

    const requestData = { name: 'John Doe' };
    const response = await api.post('/test-endpoint', requestData);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', requestData);
    expect(response).toEqual(responseData);
  });
});
