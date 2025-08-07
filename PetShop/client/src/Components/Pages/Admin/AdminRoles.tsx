import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminRoles = () => {
  return (
    <CrudTable 
    model="roles" 
    fields={["_id", "name", "createdAt", "updatedAt"]} 
    createFields={["name"]}
    updateFields={["name"]}
    readOnlyFields={["_id", "createdAt", "updateAt"]}
    searchableFields={["_id", "name"]}
    sortableFields={["name","createdAt", "updatedAt"]}
    />
  )
}
export default AdminRoles
