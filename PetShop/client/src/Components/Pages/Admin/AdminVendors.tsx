import React from 'react'
import CrudTable from '../../CrudTable'

const AdminVendors = () => {
  return (
    <CrudTable 
    model="vendors" 
    fields={["_id", "name","contactInfo", "address", "email", "phone", "createdAt", "updatedAt"]} 
    createFields={["name","contactInfo", "address", "email", "phone"]}
    updateFields={["name","contactInfo", "address", "email", "phone"]}
    readOnlyFields={['_id', "createdAt", "updatedAt"]}
    searchableFields={[
      "_id",
      "name",
      "contactInfo",
      "address",
      "email",
      "phone",
    ]}
    sortableFields={[
      "name",
      "contactInfo",
      "address",
      "email",
      "phone",
      "createdAt",
      "updatedAt",
    ]}
    />
  )
}
export default AdminVendors
