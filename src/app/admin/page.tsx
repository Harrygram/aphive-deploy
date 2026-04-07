import React from 'react';
import "tw-animate-css"
import  PostsList  from '@/components/post/adminPostsList'

export default function Home() {
  return (
    <>
    {/* Banner Section */}
    <section className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Recent posts from all the communities 
            </p>
            </div>  
          </div>
         </div>
    </section>

      

    {/* Posts Section */}
    <section className="bg-white">
      <div className="mx-auto px-4 py-6">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">

          <PostsList />        
        </div>
      </div> 
      </section>
    
     </>
  );
}