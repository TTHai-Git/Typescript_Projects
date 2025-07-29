import React from 'react'
import CrudTable from '../../CrudTable'

const AdminProducts = () => {
  return (
// pages/AdminProducts.tsx
    <CrudTable model="products" fields={["name", "price", "category"]} />
  )
}
export default AdminProducts
