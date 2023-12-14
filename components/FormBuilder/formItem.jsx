import React from 'react';
import Divider from '../ui/divider';

const FormItem = ({ field }) => {
  switch (field.type) {
    case 'text':
      return (
        <div
          className='text-black font-semibold text-[16px] sm:text-[21px] sm:leading-[34px]'
          dangerouslySetInnerHTML={{ __html: field.text }}
        />
      );
    case 'welcome-text':
      return (
        <div
          className='text-black font-normal text-[16px] leading-[26px] sm:text-[21px] sm:leading-[34px]'
          dangerouslySetInnerHTML={{ __html: field.text }}
        />
      );
    case 'therapy-text':
      return (
        <div
          className='text-black font-medium leading-[20px] sm:text-[16px] sm:leading-[34px]'
          dangerouslySetInnerHTML={{ __html: field.text }}
        />
      );
    case 'therapy-assessment':
      return (
        <div
          className='text-black font-medium text-[16px] leading-[20px] sm:text-[19px] leading-[34px]'
          dangerouslySetInnerHTML={{ __html: field.text }}
        />
      );

    case 'divider':
      return <Divider />;

    default:
      break;
  }
};

export default FormItem;
