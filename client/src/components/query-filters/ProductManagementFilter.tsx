import { Slider } from 'antd';
import React from 'react';
import { useGetAllCategoriesQuery } from '../../redux/features/management/categoryApi';
import { useGetAllBrandsQuery } from '../../redux/features/management/brandApi';

interface ProductManagementFilterProps {
  query: { name: string; category: string; brand: string; limit: number };
  setQuery: React.Dispatch<
    React.SetStateAction<{ name: string; category: string; brand: string; limit: number }>
  >;
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-faint)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
};

const ProductManagementFilter = ({ query, setQuery }: ProductManagementFilterProps) => {
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const { data: brands } = useGetAllBrandsQuery(undefined);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 2fr 1fr 1fr',
        gap: 16,
        alignItems: 'end',
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
        marginBottom: 16,
      }}
    >
      <div>
        <label style={labelStyle}>Price range</label>
        <div style={{ padding: '0 4px' }}>
          <Slider
            range
            step={100}
            max={20000}
            defaultValue={[1000, 5000]}
            onChange={(value) => {
              setQuery((prev) => ({
                ...prev,
                minPrice: value[0],
                maxPrice: value[1],
              }));
            }}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Search</label>
        <input
          type='text'
          value={query.name}
          className='input-field'
          placeholder='Product name'
          style={{ marginBottom: 0 }}
          onChange={(e) => setQuery((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div>
        <label style={labelStyle}>Category</label>
        <select
          name='category'
          className='input-field'
          style={{ marginBottom: 0 }}
          defaultValue={query.category}
          onChange={(e) => setQuery((prev) => ({ ...prev, category: e.target.value }))}
        >
          <option value=''>All categories</option>
          {categories?.data?.map((category: { _id: string; name: string }) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Brand</label>
        <select
          name='Brand'
          className='input-field'
          style={{ marginBottom: 0 }}
          defaultValue={query.brand}
          onChange={(e) => setQuery((prev) => ({ ...prev, brand: e.target.value }))}
        >
          <option value=''>All brands</option>
          {brands?.data?.map((brand: { _id: string; name: string }) => (
            <option value={brand._id} key={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductManagementFilter;
