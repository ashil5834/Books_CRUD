import React from 'react';
import { useForm } from 'react-hook-form';

const AddBook = ({ onSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit(data); 
    reset(); 
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <label>Name</label>
      <input {...register('name', { required: true })} />
      <label>Description</label>
      <input {...register('description')} />
      <label>Publish Date</label>
      <input type="date" {...register('publishDate')} />
      <label>Price</label>
      <input type="number" step="0.01" {...register('price', { required: true })} />
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBook;
