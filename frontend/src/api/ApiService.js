const API_BASE_URL = 'http://localhost:8080';

export class ApiService {
  // --------------------
  // Token management
  // --------------------
  static getToken() {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
    }
  }

  static removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('permissions');
    console.log('Token and permissions removed');
  }

  // --------------------
  // Permissions management
  // --------------------
  static getPermissions() {
    const perms = localStorage.getItem('permissions');
    return perms ? JSON.parse(perms) : [];
  }

  static setPermissions(permissions) {
    localStorage.setItem('permissions', JSON.stringify(permissions));
    console.log('Permissions stored:', permissions);
  }

  // --------------------
  // Generic request handler
  // --------------------
  static async request(endpoint, options = {}, skipAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    console.log(`Fetching ${url} with token: ${skipAuth ? 'skipped' : token}`);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      let responseData = null;

      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      if (!response.ok) {
        // Normalize error message
        let message;
        if (responseData && typeof responseData === 'object') {
          message = Object.entries(responseData)
            .map(([field, err]) => `${field}: ${err}`)
            .join(', ');
        } else {
          message = responseData || `HTTP ${response.status}`;
        }
        console.error('API error:', message);

        // Throw normalized error for frontend
        throw { status: response.status, message };
      }

      return response.status === 204 ? null : responseData;
    } catch (error) {
      console.error('Request failed:', error);
      if (error.status && error.message) throw error;
      throw { status: 0, message: error.message || 'Network error' };
    }
  }

  // --------------------
  // Auth
  // --------------------
  static async login(username, password) {
    const data = await this.request(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      },
      true
    );

    const token = data.token || data.accessToken;
    if (!token) throw { status: 0, message: 'Login failed: no token received' };
    this.setToken(token);

    // Fetch permissions safely
    let permissions = [];
    try {
      const permResponse = await this.request('/api/me/permissions');
      permissions = permResponse.permissions || [];
      this.setPermissions(permissions);
    } catch (err) {
      console.warn('Fetching permissions failed:', err);
    }

    // Fetch customers but don't break login if it fails
    let customers = [];
    try {
      customers = await this.getAllCustomers();
    } catch (err) {
      console.warn('Fetching customers failed:', err);
    }

    return { ...data, permissions, customers };
  }

  static async register(username, password, role = 'USER') {
    return this.request(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ username, password, role }),
      },
      true
    );
  }

  // --------------------
  // Customer APIs
  // --------------------
  static async getAllCustomers() {
    const customers = await this.request('/api/customers');
    console.log('Fetched customers:', customers);
    return customers;
  }

  static async getCustomerById(id) {
    return this.request(`/api/customers/${id}`);
  }

  static async createCustomer(customer) {
    return this.request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  static async updateCustomer(id, customer) {
    return this.request(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  static async deleteCustomer(id) {
    return this.request(`/api/customers/${id}`, { method: 'DELETE' });
  }

  static async searchCustomers(params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim()) searchParams.append(key, value.trim());
    });
    return this.request(`/api/customers/search?${searchParams.toString()}`);
  }
}
