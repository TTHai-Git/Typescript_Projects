import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminCategories = () => {
  return (
    <CrudTable 
    model="categories" 
    fields={["_id","name","status" ,"description", "createdAt", "updatedAt"]} 
    createFields={["name","status" ,"description"]}
    updateFields={["name","status" ,"description"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields={["_id", "name", "description"]}
    sortableFields={["name", "createdAt", "updatedAt"]}/>
  )
}
export default AdminCategories
