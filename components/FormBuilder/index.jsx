'use client';
import React from 'react';
import CustomFormItem from './formItem';
import { Button } from '../ui/button';
import { Loader2, MoveRight } from 'lucide-react';
import { FormControl, FormField, FormItem, Form } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import CustomFormField from './customFormField';

const TYPES_FORM = [
  'fill-in',
  'single-select',
  'therapy-assessment-buttons',
  'condition',
];

const FormBuilder = ({
  formHook,
  formFields,
  onSubmit,
  disabled,
  loading,
  buttonText,
  withNextIcon,
  allowSendData,
}) => {
  return (
    <>
      <Form {...formHook}>
        <form
          className='flex flex-col flex-1'
          onSubmit={formHook.handleSubmit((data) => {
            onSubmit(data);
          })}
        >
          <div className='flex space-y-[20px] flex-col bg-content-wrapper-bg rounded-[6px] border-[1px] border-solid p-[32px] sm:p-[42px]'>
            {formFields?.map((customField, i) => {
              return TYPES_FORM.includes(customField.type) ? (
                <FormField
                  name={customField.questionId}
                  control={formHook.control}
                  key={`${i}-${customField.type}`}
                  render={({ field }) => (
                    <FormItem>
                      {customField?.label && <Label>{customField.label}</Label>}
                      <FormControl>
                        <CustomFormField
                          type={customField.type}
                          field={field}
                          customField={customField}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              ) : (
                <CustomFormItem key={i} field={customField} />
              );
            })}
          </div>
          <div className='flex flex-1 justify-center items-end mt-[20px]'>
            <Button
              type='submit'
              className={`w-[200px] opacity-${allowSendData ? '100' : '50'}`}
              disabled={disabled || loading}
            >
              {buttonText}
              {loading && <Loader2 className='ml-2 h-4 w-4 animate-spin' />}
              {withNextIcon && !loading && (
                <MoveRight className='h-4 w-4 ml-[10px]' />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FormBuilder;
