import React from 'react';
import { FaAddressBook } from 'react-icons/fa';
import { MdAddHome } from 'react-icons/md';

const AddressInput = ({ address, addressDetail, handleChange, handleSearchAddress }) => (
    <div className='flex flex-col mx-auto w-full mt-10'>
        <p className='flex justify-center text-lg'>숙소 주소를 수정해주세요.</p>
        <div className='border-t-2 border-gray-200 mt-4 pt-4'></div>
        <div className='flex justify-center items-center space-x-3'>
            <FaAddressBook className='min-w-fit' size={20}/>
            <input
                className='flex w-1/2 border border-gray-300 rounded py-2 pl-8 mb-3'
                type='text'
                name='address'
                placeholder='주소'
                value={address}
                onChange={handleChange}
            />
            <button
                onClick={handleSearchAddress}
                className='px-5 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none'>
                검색
            </button>
        </div>
        <div className='flex justify-center items-center space-x-3'>
            <MdAddHome className='min-w-fit' size={20}/>
            <input
                className='flex border border-gray-300 rounded py-2 pl-8'
                type='text'
                value={addressDetail}
                name='addressDetail'
                placeholder='상세주소'
                onChange={handleChange}
            />
        </div>
    </div>
);

export default AddressInput;