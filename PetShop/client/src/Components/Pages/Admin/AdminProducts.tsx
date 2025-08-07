import React from 'react'
import CrudTable from '../../CrudTable'

const AdminProducts = () => {
  return (
  // pages/AdminProducts.tsx
    <CrudTable 
    model="products" 
    fields={["imageUrl","_id","name", "description", "price","status", "stock", "category", "brand", "vendor", "createdAt", "updatedAt"]}
    createFields={["imageUrl","name", "description", "price","status", "stock", "category", "brand", "vendor"]}
    updateFields={["imageUrl","name", "description", "price","status", "stock", "category", "brand", "vendor"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields={["_id","name", "description", "status", "stock", "category", "brand", "vendor"]}
    sortableFields= {["name", "description", "price", "stock", "createdAt", "updatedAt"]}
    />
  )
}
export default AdminProducts
