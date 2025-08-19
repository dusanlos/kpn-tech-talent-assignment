// CustomerList.jsx
import React, { useEffect, useState } from 'react';
import { ApiService } from '../../api/ApiService';
import { Search, Trash2, Edit, Plus, Check, X, Users, Mail, Phone, MapPin } from 'lucide-react';

const CustomerList = ({ token }) => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ firstName: '', lastName: '', address: '', phoneNumber: '', email: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const extractErrorMessage = (err) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.status === 403) return "You don't have permission";
    if (err.message) return err.message;
    return 'An unknown error occurred';
  };

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getAllCustomers(token);
      const customerArray = Array.isArray(data) ? data : data?.data || [];
      setCustomers(customerArray);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    Object.values(customer)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // CREATE
  const handleAddCustomer = async () => {
    try {
      await ApiService.createCustomer(newCustomer, token);
      fetchCustomers();
      setNewCustomer({ firstName: '', lastName: '', address: '', phoneNumber: '', email: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // UPDATE
  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return;
    try {
      await ApiService.updateCustomer(editingCustomer.id, editingCustomer, token);
      fetchCustomers();
      setEditingCustomer(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  // DELETE
  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await ApiService.deleteCustomer(id, token);
      fetchCustomers();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-[#1297fe]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
                <p className="text-gray-600 mt-1">Manage your customer database</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 bg-[#1297fe] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Add Customer Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00c300] to-green-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Plus className="w-6 h-6 mr-2" />
                Add New Customer
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={newCustomer.firstName}
                    onChange={e => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={newCustomer.lastName}
                    onChange={e => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newCustomer.email}
                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={newCustomer.phoneNumber}
                    onChange={e => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full address"
                    value={newCustomer.address}
                    onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1297fe] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddCustomer}
                  className="flex items-center space-x-2 bg-[#00c300] hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Check className="w-5 h-5" />
                  <span>Add Customer</span>
                </button>
                
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCustomer({ firstName: '', lastName: '', address: '', phoneNumber: '', email: '' });
                  }}
                  className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1297fe]" />
            <input
              type="text"
              placeholder="Search customers by name, email, phone, or address..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-[#1297fe] rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-[#1297fe] transition-all duration-200 text-gray-900 bg-white placeholder-gray-500 text-lg"
            />
          </div>
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              Found {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1297fe]"></div>
            <span className="ml-3 text-lg text-gray-600">Loading customers...</span>
          </div>
        )}

        {/* Customer Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1297fe] to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Customer Database ({filteredCustomers.length})
              </h2>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No customers found' : 'No customers yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : 'Get started by adding your first customer'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer, index) => (
                      <tr 
                        key={customer.id} 
                        className={`hover:bg-blue-50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                            #{customer.id}
                          </span>
                        </td>

                        <td className="px-6 py-6">
                          {editingCustomer?.id === customer.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editingCustomer.firstName}
                                onChange={e => setEditingCustomer({ ...editingCustomer, firstName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1297fe] focus:border-transparent text-sm bg-white text-gray-900"
                                placeholder="First Name"
                              />
                              <input
                                type="text"
                                value={editingCustomer.lastName}
                                onChange={e => setEditingCustomer({ ...editingCustomer, lastName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1297fe] focus:border-transparent text-sm bg-white text-gray-900"
                                placeholder="Last Name"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-6">
                          {editingCustomer?.id === customer.id ? (
                            <div className="space-y-2">
                              <input
                                type="email"
                                value={editingCustomer.email}
                                onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1297fe] focus:border-transparent text-sm bg-white text-gray-900"
                                placeholder="Email"
                              />
                              <input
                                type="tel"
                                value={editingCustomer.phoneNumber}
                                onChange={e => setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1297fe] focus:border-transparent text-sm bg-white text-gray-900"
                                placeholder="Phone"
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-700">
                                <Mail className="w-4 h-4 mr-2 text-[#1297fe]" />
                                <a href={`mailto:${customer.email}`} className="hover:text-[#1297fe] transition-colors">
                                  {customer.email}
                                </a>
                              </div>
                              <div className="flex items-center text-sm text-gray-700">
                                <Phone className="w-4 h-4 mr-2 text-[#00c300]" />
                                <a href={`tel:${customer.phoneNumber}`} className="hover:text-[#00c300] transition-colors">
                                  {customer.phoneNumber}
                                </a>
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-6">
                          {editingCustomer?.id === customer.id ? (
                            <input
                              type="text"
                              value={editingCustomer.address}
                              onChange={e => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1297fe] focus:border-transparent text-sm bg-white text-gray-900"
                              placeholder="Address"
                            />
                          ) : (
                            <div className="flex items-start text-sm text-gray-700">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{customer.address}</span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-6 text-center">
                          {editingCustomer?.id === customer.id ? (
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={handleUpdateCustomer}
                                className="bg-[#00c300] hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-200 shadow hover:shadow-lg"
                                title="Save changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingCustomer(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-200"
                                title="Cancel editing"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => setEditingCustomer(customer)}
                                className="bg-[#1297fe] hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 shadow hover:shadow-lg"
                                title="Edit customer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(customer.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 shadow hover:shadow-lg"
                                title="Delete customer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;