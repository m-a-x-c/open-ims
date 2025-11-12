import { Button } from 'antd';
import { useState } from 'react';
import { useCreateBrandMutation } from '../../redux/features/management/brandApi';
import toastMessage from '../../lib/toastMessage';
import { SpinnerIcon } from '@phosphor-icons/react';

const CreateBrand = () => {
  const [createBrand, { isLoading }] = useCreateBrandMutation();
  const [brand, setBrand] = useState('');

  const handleClick = async () => {
    try {
      const res = await createBrand({ name: brand }).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        setBrand('');
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
        New brand
      </h3>
      <input
        type='text'
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className='input-field'
        placeholder='Brand name'
      />
      <Button
        htmlType='button'
        onClick={handleClick}
        type='default'
        disabled={isLoading || !brand.trim()}
        style={{ width: '100%' }}
      >
        {isLoading && <SpinnerIcon className='spin' weight='bold' />}
        Add brand
      </Button>
    </div>
  );
};

export default CreateBrand;
