import React from 'react';
import { useForm } from 'react-hook-form';

const EditBook = ({ book, onSubmit }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: book.name,
      description: book.description,
      publishDate: new Date(book.publishDate).toISOString().substr(0, 10),
      price: book.price.toString(),
    },
  });

  const handleFormSubmit = (data) => {
    const updatedBook = {
      ...book,
      name: data.name,
      description: data.description,
      publishDate: data.publishDate,
      price: parseFloat(data.price),
    };
    onSubmit(updatedBook);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <label>Name:</label>
        <input type="text" {...register('name', { required: true })} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" {...register('description', { required: true })} />
      </div>
      <div>
        <label>Publish Date:</label>
        <input type="date" {...register('publishDate', { required: true })} />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" step="0.01" {...register('price', { required: true })} />
      </div>
      <button type="submit">Save</button>
    </form>
  );
};

export default EditBook;
