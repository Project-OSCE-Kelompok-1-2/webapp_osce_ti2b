import React from 'react';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
  const {data} = usePage().props;
  console.log(data);
  
  return (
    <div className="p-6">
    <h2>Data stase</h2>
    </div>
  );
}
