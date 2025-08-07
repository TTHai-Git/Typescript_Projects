import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminPayments = () => {
  return (
    <CrudTable 
    model="payments" 
    fields={["_id","method", "provider", "status", "order", "createdAt", "updatedAt"]} 
    createFields={["method", "provider", "status", "order"]}
    updateFields={["method", "provider", "status", "order"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields={["_id", "method", "provider", "order"]}
    sortableFields={["createdAt", "updatedAt"]}
    />
  )
}
export default AdminPayments
