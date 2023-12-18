import React from 'react';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FormControl, FormItem } from '../ui/form';
import { Label } from '../ui/label';
import { useFormContext } from 'react-hook-form';
import { Button } from '../ui/button';

const CustomFormField = ({ type, field, customField }) => {
  const { register, setValue, getValues, trigger } = useFormContext();
  switch (type) {
    case 'fill-in':
      return <Input className='max-w-[340px]' {...field} />;
    case 'single-select':
    case 'condition':
      return (
        <RadioGroup
          className='!mt-[16px]'
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          {customField.options.map((option) => {
            return (
              <FormItem key={`${field.questionId}-${option.value}`}>
                <FormControl>
                  <div className='flex hover:cursor-pointer'>
                    <RadioGroupItem
                      value={option.value}
                      id={`${field.questionId}-${option.value}-${customField?.label}`}
                    />
                    <Label
                      className='ml-2 text-[14px] leading-[14px] sm:text-[16px] hover:cursor-pointer'
                      htmlFor={`${field.questionId}-${option.value}-${customField?.label}`}
                    >
                      {option.label}
                    </Label>
                  </div>
                </FormControl>
              </FormItem>
            );
          })}
        </RadioGroup>
      );
    case 'therapy-assessment-buttons':
      return (
        <div className='flex justify-center space-x-[11px] sm:space-x-[21px]'>
          {customField.options.map((option) => {
            const selected = getValues(customField.questionId) === option.value;
            return (
              <div
                key={`${customField.questionId}-${option.value}`}
                className='flex'
              >
                <Button
                  type='button'
                  variant={'therapy'}
                  onClick={() => {
                    setValue(customField.questionId, option.value);
                    trigger(customField.questionId);
                  }}
                  className={
                    selected ? 'bg-primary text-white' : 'bg-therapy-button-bg'
                  }
                >
                  {option.value}
                </Button>
              </div>
            );
          })}
        </div>
      );

    default:
      break;
  }
};

export default CustomFormField;
