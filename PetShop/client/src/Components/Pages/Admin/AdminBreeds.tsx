import React from 'react'
import CrudTable from '../../CrudTable'

const AdminBreeds = () => {
  return (
    <CrudTable 
    model="breeds" 
    fields={["_id","name", "description", "createdAt", "updatedAt"]} 
    createFields={["name", "description"]}
    updateFields={["name", "description"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]} 
    searchableFields={["_id", "name", "description"]}
    sortableFields={["name", "createdAt", "updatedAt"]}/>
    
  )
}
export default AdminBreeds
