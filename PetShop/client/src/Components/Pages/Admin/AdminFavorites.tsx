import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminFavorites = () => {
   return (
    <CrudTable 
    model="favorites" 
    fields={["_id","user", "product", "isFavorite", "createdAt", "updatedAt"]} 
    createFields={["user", "product", "isFavorite"]}
    updateFields={["user", "product", "isFavorite"]}
    readOnlyFields={["_id", "createAt", "updateAt"]}
    searchableFields={["_id", "user", "product"]}
    sortableFields={["createdAt", "updatedAt"]}
    />
  )
}
export default AdminFavorites
