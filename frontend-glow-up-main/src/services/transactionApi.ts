/**
 * Transaction API Service
 * Handles all API calls to the backend Spring Boot API
 */

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface Transaction {
  transactionId: string;
  timestamp?: string;
  timestampVal?: string;
  currency: string;
  amount: number;
  senderAccount: string;
  receiverAccount: string;
  transactionType?: string;
  channel?: string;
  status?: string;
  ipAddress?: string;
  location?: string;
  fraudFlag?: boolean | number;
  fraudReason?: string;
  mlPrediction?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

/**
 * Create a new transaction
 */
export const createTransaction = async (transaction: Omit<Transaction, 'status' | 'fraudFlag' | 'fraudReason' | 'timestampVal'>): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorDetails = null;

      try {
        const errorData = await response.json();
        errorDetails = errorData;

        // Handle validation errors from Spring Boot
        if (Array.isArray(errorData)) {
          // Format validation errors
          const errors = errorData.map((err: any) => {
            const field = err.field || err.objectName || 'field';
            const message = err.defaultMessage || err.message || 'Invalid value';
            return `${field}: ${message}`;
          }).join(', ');
          errorMessage = `Validation failed: ${errors}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch (e2) {
          // Keep default error message
        }
      }

      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
      };
    }

    const data = await response.text();
    return {
      success: true,
      data: data || 'Transaction saved successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create transaction',
    };
  }
};

/**
 * Get all transactions
 */
export const getAllTransactions = async (): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    };
  }
};

/**
 * Get fraud transactions
 */
export const getFraudTransactions = async (): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/fraud`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch fraud transactions',
    };
  }
};

/**
 * Get successful transactions
 */
export const getSuccessTransactions = async (): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/success`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch success transactions',
    };
  }
};

/**
 * Get failed transactions
 */
export const getFailedTransactions = async (): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/failed`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch failed transactions',
    };
  }
};

/**
 * Get pending transactions
 */
export const getPendingTransactions = async (): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/transactions/pending`);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch pending transactions',
    };
  }
};

