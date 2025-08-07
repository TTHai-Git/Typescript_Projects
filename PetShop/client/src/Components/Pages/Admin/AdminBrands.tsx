import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminBrands = () => {
  return (
  
    <CrudTable 
    model="brands" 
    fields={["logoUrl","_id","name", "description", "createdAt", "updatedAt"]} 
    createFields={["logoUrl", "name", "description"]}
    updateFields={["logoUrl", "name", "description"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields= {["_id", "name", "description"]}
    sortableFields= {["name", "descrption", "createdAt", "updatedAt"]}/>

  )
}
export default AdminBrands
