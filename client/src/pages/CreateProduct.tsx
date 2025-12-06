import { Button } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import CustomInput from '../components/CustomInput';
import toastMessage from '../lib/toastMessage';
import { useGetAllBrandsQuery } from '../redux/features/management/brandApi';
import { useGetAllCategoriesQuery } from '../redux/features/management/categoryApi';
import { useCreateNewProductMutation } from '../redux/features/management/productApi';
import { useGetAllSellerQuery } from '../redux/features/management/sellerApi';
import { ICategory } from '../types/product.types';
import CreateSeller from '../components/product/CreateSeller';
import CreateCategory from '../components/product/CreateCategory';
import CreateBrand from '../components/product/CreateBrand';
import { SpinnerIcon } from '@phosphor-icons/react';

const fieldRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
};

const CreateProduct = () => {
  const [createNewProduct, { isLoading: isCreatingProduct }] = useCreateNewProductMutation();
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: sellers } = useGetAllSellerQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const payload = { ...data };
    payload.price = Number(data.price);
    payload.stock = Number(data.stock);

    if (payload.size === '') {
      delete payload.size;
    }

    try {
      const res = await createNewProduct(payload).unwrap();
      if (res.statusCode === 201) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>Add product</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
        Create a new product and assign it to a seller, category and brand.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 280px',
          gap: 64,
          alignItems: 'flex-start',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomInput
            name='name'
            errors={errors}
            label='Name'
            register={register}
            required={true}
          />
          <CustomInput
            errors={errors}
            label='Price'
            type='number'
            name='price'
            register={register}
            required={true}
          />
          <CustomInput
            errors={errors}
            label='Stock'
            type='number'
            name='stock'
            register={register}
            required={true}
          />

          <div style={fieldRow}>
            <label htmlFor='seller' className='label'>Seller</label>
            <select
              id='seller'
              {...register('seller', { required: true })}
              className={`input-field ${errors['seller'] ? 'input-field-error' : ''}`}
            >
              <option value=''>Select a seller</option>
              {sellers?.data.map((item: ICategory) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div style={fieldRow}>
            <label htmlFor='category' className='label'>Category</label>
            <select
              id='category'
              {...register('category', { required: true })}
              className={`input-field ${errors['category'] ? 'input-field-error' : ''}`}
            >
              <option value=''>Select a category</option>
              {categories?.data.map((item: ICategory) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div style={fieldRow}>
            <label htmlFor='brand' className='label'>Brand</label>
            <select
              id='brand'
              {...register('brand')}
              className={`input-field ${errors['brand'] ? 'input-field-error' : ''}`}
            >
              <option value=''>Select a brand</option>
              {brands?.data.map((item: ICategory) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>

          <CustomInput label='Description' name='description' register={register} />

          <div style={fieldRow}>
            <label htmlFor='size' className='label'>Size</label>
            <select id='size' className='input-field' {...register('size')}>
              <option value=''>Select a size</option>
              <option value='SMALL'>Small</option>
              <option value='MEDIUM'>Medium</option>
              <option value='LARGE'>Large</option>
            </select>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-start' }}>
            <Button htmlType='submit' type='primary' disabled={isCreatingProduct}>
              {isCreatingProduct && <SpinnerIcon className='spin' weight='bold' />}
              Add product
            </Button>
          </div>
        </form>

        <aside
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            paddingLeft: 32,
            borderLeft: '1px solid var(--border)',
          }}
        >
          <CreateSeller />
          <CreateCategory />
          <CreateBrand />
        </aside>
      </div>
    </div>
  );
};

export default CreateProduct;
