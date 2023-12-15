import React from 'react';

const Header = ({ survey }) => {
  return (
    <header className='bg-white py-[2px] px-[28px] sm:py-[28px] sm:px-[80px]'>
      <div className='relative flex items-center  min-h-[30px]'>
        <p className='text-[18px] sm:text-[30px] font-semibold absolute left-0'>
          LOGO
        </p>
        {survey && (
          <p className='text-dark-blue mx-auto w-[100%] text-[19px] text-center'>
            {survey}
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
