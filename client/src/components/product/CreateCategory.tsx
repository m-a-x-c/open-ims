import { Button } from 'antd';
import { useState } from 'react';
import { useCreateCategoryMutation } from '../../redux/features/management/categoryApi';
import toastMessage from '../../lib/toastMessage';
import { SpinnerIcon } from '@phosphor-icons/react';

const CreateCategory = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [category, setCategory] = useState('');

  const handleClick = async () => {
    try {
      const res = await createCategory({ name: category }).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        setCategory('');
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--text-muted)',
          marginBottom: 8,
        }}
      >
        New category
      </h3>
      <input
        type='text'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className='input-field'
        placeholder='Category name'
      />
      <Button
        htmlType='button'
        onClick={handleClick}
        type='default'
        disabled={isLoading || !category.trim()}
        style={{ width: '100%' }}
      >
        {isLoading && <SpinnerIcon className='spin' weight='bold' />}
        Add category
      </Button>
    </div>
  );
};

export default CreateCategory;
