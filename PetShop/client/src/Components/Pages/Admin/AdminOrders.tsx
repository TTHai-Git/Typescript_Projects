import React from 'react'
import CrudTable from '../../CrudTable'

const AdminOrders = () => {
  return (
    <CrudTable 
    model="orders" 
    fields={["_id","user", "totalPrice", "status", "createdAt", "updatedAt"]} 
    createFields={["user", "totalPrice", "status"]}
    updateFields={["user", "totalPrice", "status"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields={["_id", "user", "status"]}
    sortableFields= {["totalPrice", "createdAt", "updatedAt"]}
    />
  )
}
export default AdminOrders
