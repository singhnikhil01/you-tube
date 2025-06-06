import React from 'react'
import { SearchIcon } from 'lucide-react'
export const SearchInput = () => {
    //TODO: Add search functionality
  return (
    <div>
        <form className='flex w-full lg:min-w-[600px] max-w-[600px]'>
            <div className='relative w-full'>
                <input
                type="text"
                placeholder='Search'
                className='w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none 
                focus:border-blue-500'
                />
                {/* TODO: add remove search button thing */}
            </div>
            <button type='submit' className='px-6 py-2.5 border border-l-0  rounded-r-full bg-gray-50 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                <SearchIcon className="size-5"/>
        </button>
      
        </form>  
    </div>
  )
}


