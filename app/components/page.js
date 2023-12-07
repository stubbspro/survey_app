import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

import { ArrowRight } from 'lucide-react';

const Components = () => {
  return (
    <div>
      Page for components. Will be deleted
      <div>
        <Button>
          Button
          <ArrowRight className='ml-[10px] h-[24px] w-[24px]' />
        </Button>
        <Input type='email' placeholder='Email' />
        <div className='mt-2'>
          <RadioGroup defaultValue='comfortable'>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='default' id='r1' />
              <Label htmlFor='r1'>Default</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='comfortable' id='r2' />
              <Label htmlFor='r2'>Comfortable</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='compact' id='r3' />
              <Label htmlFor='r3'>Compact</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline'>Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  You cannot go to the next step, the minimum time for an answer
                  is 30 seconds
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Ok</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div>
          <div className='flex items-center space-x-2'>
            <Checkbox id='terms' />
            <label
              htmlFor='terms'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Accept terms and conditions
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Components;
