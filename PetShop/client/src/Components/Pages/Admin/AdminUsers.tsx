import React from 'react'
import CrudTable from '../../CrudTable'

const AdminUsers = () => {
  return (
    // pages/AdminUsers.tsx
    <CrudTable 
    model="users" 
    fields={["avatar","_id","username", "password", "name", "email", "phone", "address", "isVerified", "role", "createdAt", "updatedAt"]} 
    createFields={["avatar","username", "password", "name", "email", "phone", "address", "isVerified", "role"]}
    updateFields={["avatar","username", "password", "name", "email", "phone", "address", "isVerified", "role"]}
    searchableFields={[
      "_id",
      "username",
      "name",
      "email",
      "phone",
      "address",
      "role",
      "isVerified",
    ]}
    sortableFields={[
      "username",
      "name",
      "email",
      "phone",
      "address",
      "createdAt",
      "updatedAt",
    ]}
    />
  )
}
export default AdminUsers