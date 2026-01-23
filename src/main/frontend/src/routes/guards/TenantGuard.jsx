import React from 'react'
import { Outlet } from 'react-router-dom'

function TenantGuard() {
  return <Outlet></Outlet>
}

export default TenantGuard