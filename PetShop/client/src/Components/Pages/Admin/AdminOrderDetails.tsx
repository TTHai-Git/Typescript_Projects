import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminOrderDetails = () => {
  return (
    <CrudTable 
    model="orderDetails" 
    fields={["_id","order", "product", "quantity", "price", "note"]} 
    createFields={["order", "product", "quantity", "price", "note"]}
    updateFields={["order", "product", "quantity", "price", "note"]}
    readOnlyFields={["_id"]}
    searchableFields={["_id", "order", "product", "note"]}
    sortableFields={["price", "quantity"]}
    />
  )
}
export default AdminOrderDetails
