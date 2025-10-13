'use client';

import { useEffect, useState } from 'react';
import { CustomAdapter } from '../../../../auth/adapters/custome-adapter';
import { CustomerTable } from './component/CustomerTable';


export function MultipleTimeVisitedCustomerList() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await CustomAdapter.visitedCustomerStats();
      if (res?.success) {
        setCustomers(res.repeatCustomers || []);
      }
    }
    fetchData();
  }, []);

  return <CustomerTable customers={customers} title="Multiple Time Visited Customers" />;
}
