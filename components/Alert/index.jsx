import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';

const Alert = ({ open, setOpen, text }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription className='text-[16px]'>
            {text}
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
