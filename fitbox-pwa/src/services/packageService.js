import { apiClient } from '../config/api'

// Service CRUD ke endpoint /packages
const packageService = {
    getPackages: () => apiClient.get('/packages'),                      // READ ALL
    getPackageById: (id) => apiClient.get(`/packages/${id}`),           // READ BY ID
    createPackage: (payload) => apiClient.post('/packages', payload),  // CREATE
    updatePackage: (id, payload) => apiClient.put(`/packages/${id}`, payload), // UPDATE
    deletePackage: (id) => apiClient.delete(`/packages/${id}`),         // DELETE
}

export default packageService