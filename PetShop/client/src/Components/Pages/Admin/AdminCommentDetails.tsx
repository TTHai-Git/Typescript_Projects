import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminCommentDetails = () => {
  return (
    <CrudTable 
    model="commentDetails" 
    fields={["_id","url", "public_id", "comment"]} 
    createFields={["url", "public_id", "comment"]}
    updateFields={["url", "public_id", "comment"]}
    readOnlyFields={["_id"]}
    searchableFields={["_id", "url", "public_id", "comment"]}
    sortableFields={["createdAt", "updatedAt"]}
    />
    
  )
}
export default AdminCommentDetails
