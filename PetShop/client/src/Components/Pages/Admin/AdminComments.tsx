import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminComments = () => {
  return (
    <CrudTable 
    model="comments" 
    fields={["_id","content","rating" ,"user", "product", "createdAt", "updatedAt"]} 
    createFields={["content","rating" ,"user", "product"]}
    updateFields={["content","rating", "user", "product"]}
    readOnlyFields={["_id", "user", "product", "createdAt", "updatedAt"]}
    searchableFields={["_id", "user", "product", "content"]}
    sortableFields={["rating", "createdAt", "updatedAt"]}
    />
  )
}
export default AdminComments
