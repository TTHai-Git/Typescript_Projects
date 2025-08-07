import React from 'react'
import CrudTable from '../../CrudTable'

 const AdminVouchers = () => {
  return (
    <CrudTable 
    model="vouchers" 
    fields={["_id", "code","discount", "expiryDate", "isActive", "usageCount", "maxUsage"]} 
    createFields={["code","discount", "expiryDate", "isActive", "usageCount", "maxUsage"]}
    updateFields={["code","discount", "expiryDate", "isActive", "usageCount", "maxUsage"]}
    readOnlyFields={["_id", "createdAt", "updatedAt"]}
    searchableFields={["_id", "code", "isActive"]}
    sortableFields={["code",
      "discount",
      "expiryDate",
      "usageCount",
      "maxUsage",
      "createdAt",
      "updatedAt",
    ]}
    />
  )
}
export default AdminVouchers
