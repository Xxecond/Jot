'use client'

import  {Header}  from '@/components/';
import {SkeletonLoader } from '@/components/ui'

export default function Test() {
  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div><SkeletonLoader />
      </div>  
      </div>
      </>

)}

