'use client';

import { useEffect, useState, useMemo } from 'react';
import { CustomAdapter } from '../../../../auth/adapters/custome-adapter';
import { CustomerTable } from './component/CustomerTable';


export function OneTimeVisitedCustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await CustomAdapter.visitedCustomerStats();
      if (res?.success) {
        setCustomers(res.oneTimeCustomers || []);
      }
    }
    fetchData();
  }, []);

  return <CustomerTable customers={customers} title="One-Time Visited Customers" />;
}
