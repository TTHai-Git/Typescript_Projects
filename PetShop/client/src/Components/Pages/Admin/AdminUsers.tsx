import React from 'react'
import CrudTable from '../../CrudTable'

const AdminUsers = () => {
  return (
    // pages/AdminUsers.tsx
    <CrudTable model="users" fields={["username", "email", "role"]} />
  )
}
export default AdminUsers