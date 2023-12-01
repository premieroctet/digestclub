'use client';
import { useFormStatus } from 'react-dom';
import Button from '../Button';

const FormButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending}>
      {pending ? 'Loading...' : 'Save'}
    </Button>
  );
};

export default FormButton;
