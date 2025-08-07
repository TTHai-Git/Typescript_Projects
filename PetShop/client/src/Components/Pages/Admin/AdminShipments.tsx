import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminShipments = () => {
  return (
    <CrudTable 
    model="shipments" 
    fields={["_id", "method","buyerName", "buyerPhone", "buyerAddress", "fee", "order", "createdAt", "updatedAt"]}
    createFields={["method","buyerName", "buyerPhone", "buyerAddress", "fee", "order", "createdAt", "updatedAt"]}
    updateFields={["method","buyerName", "buyerPhone", "buyerAddress", "fee", "order", "createdAt", "updatedAt"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields={[
      "_id",
      "method",
      "buyerName",
      "buyerPhone",
      "buyerAddress",
      "order",
    ]}
    sortableFields={["fee", "createdAt", "updatedAt"]}
    />
  )
}
export default AdminShipments
