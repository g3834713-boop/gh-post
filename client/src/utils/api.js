// API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  // Submit user form and payment data
  submitForm: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/unruly-business/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Get all submissions (admin)
  getSubmissions: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Get single submission
  getSubmission: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch submission');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Delete submission
  deleteSubmission: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Update submission status
  updateStatus: async (id, status, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Search submissions
  searchSubmissions: async (query, startDate, endDate, token) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/api/submissions/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to search submissions');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Export to CSV
  exportCSV: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/submissions/export/csv`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }
      return await response.text();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};

// Validation utilities
export const validate = {
  // Validate email
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate phone number (basic)
  phone: (phone) => {
    const regex = /^[\d\s\-+()]{10,}$/;
    return regex.test(phone);
  },

  // Validate card number (basic format only for test cards)
  cardNumber: (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '').replace(/-/g, '');
    // Just check if it's 16 digits (Luhn validation can be strict for test)
    return /^\d{16}$/.test(cleaned);
  },

  // Validate CVV
  cvv: (cvv) => {
    return /^\d{3,4}$/.test(cvv.replace(/\s/g, ''));
  },

  // Validate expiry date
  expiryDate: (expiryDate) => {
    return /^\d{2}\/\d{2}$/.test(expiryDate);
  },

  // Validate postal code
  postalCode: (postalCode) => {
    return postalCode.trim().length > 0;
  },
};

// Format utilities
export const format = {
  // Format card number (XXXX-XXXX-XXXX-XXXX)
  cardNumber: (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join('-');
    } else {
      return value;
    }
  },

  // Format expiry date (MM/YY)
  expiryDate: (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  },

  // Format phone number
  phone: (value) => {
    return value.replace(/\D/g, '').slice(0, 10);
  },

  // Format date for display
  date: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};
