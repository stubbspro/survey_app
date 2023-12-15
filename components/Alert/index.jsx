import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';

const Alert = ({ open, setOpen, time }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className='text-[16px]'>
            You cannot go to the next step, the minimum time for an answer is{' '}
            {time} seconds
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='justify-center sm:justify-center'>
          <AlertDialogAction className='bg-dark-blue'>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
