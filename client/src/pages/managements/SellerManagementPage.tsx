import { DeleteFilled, EditFilled } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Table } from 'antd';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  useDeleteSellerMutation,
  useGetAllSellerQuery,
} from '../../redux/features/management/sellerApi';
import { IProduct, ISeller } from '../../types/product.types';
import toastMessage from '../../lib/toastMessage';
import SearchInput from '../../components/SearchInput';

const SellerManagementPage = () => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: '',
    sortBy: '' as string,
    sortOrder: '' as '' | 'asc' | 'desc',
  });

  const { data, isFetching } = useGetAllSellerQuery(query);

  const onChange: PaginationProps['onChange'] = (page, pageSize) => {
    setQuery((prev) => ({ ...prev, page, limit: pageSize ?? prev.limit }));
  };

  const handleTableChange = (_pag: any, _filters: any, sorter: any) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (!s || !s.order) {
      setQuery((prev) => ({ ...prev, sortBy: '', sortOrder: '', page: 1 }));
      return;
    }
    const fieldKey = (s.columnKey || s.field) as string;
    setQuery((prev) => ({
      ...prev,
      sortBy: fieldKey,
      sortOrder: s.order === 'ascend' ? 'asc' : 'desc',
      page: 1,
    }));
  };

  const sortedColumnOrder = (key: string): 'ascend' | 'descend' | null =>
    query.sortBy === key ? (query.sortOrder === 'asc' ? 'ascend' : 'descend') : null;

  const tableData = data?.data?.map((seller: ISeller) => ({
    key: seller._id,
    name: seller.name,
    email: seller.email,
    contactNo: seller.contactNo,
  }));

  const columns: TableColumnsType<any> = [
    {
      title: 'Seller Name',
      key: 'name',
      dataIndex: 'name',
      sorter: true,
      sortOrder: sortedColumnOrder('name'),
    },
    {
      title: 'Email',
      key: 'email',
      dataIndex: 'email',
      align: 'center',
      sorter: true,
      sortOrder: sortedColumnOrder('email'),
    },
    {
      title: 'Contact Number',
      key: 'contactNo',
      dataIndex: 'contactNo',
      align: 'center',
      sorter: true,
      sortOrder: sortedColumnOrder('contactNo'),
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        return (
          <div style={{ display: 'flex' }}>
            <UpdateModal product={item} />
            <DeleteModal id={item.key} />
          </div>
        );
      },
      width: '1%',
    },
  ];

  return (
    <>
      <Flex justify='end' style={{ margin: '5px' }}>
        <SearchInput setQuery={setQuery} placeholder='Search Seller...' />
      </Flex>
      <Table
        size='small'
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        onChange={handleTableChange}
      />
      <Flex justify='center' style={{ marginTop: '1rem' }}>
        <Pagination
          current={query.page}
          pageSize={query.limit}
          onChange={onChange}
          onShowSizeChange={(_c, size) =>
            setQuery((prev) => ({ ...prev, page: 1, limit: size }))
          }
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100]}
          total={data?.meta?.total}
        />
      </Flex>
    </>
  );
};

/**
 * Update Modal
 */
const UpdateModal = ({ product }: { product: IProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    console.log({ data, product });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ! Remove this early return to work with this component
  return;
  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        className='table-btn-small'
        style={{ backgroundColor: 'green' }}
      >
        <EditFilled />
      </Button>
      <Modal title='Update Product Info' open={isModalOpen} onCancel={handleCancel} footer={null}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Working on it...!!!</h1>
          <Button htmlType='submit'>Submit</Button>
        </form>
      </Modal>
    </>
  );
};

/**
 * Delete Modal
 */
const DeleteModal = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSeller] = useDeleteSellerMutation();

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSeller(id).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        className='table-btn-small'
        style={{ backgroundColor: 'red' }}
      >
        <DeleteFilled />
      </Button>
      <Modal title='Delete Product' open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Are you want to delete this product?</h2>
          <h4>You won't be able to revert it.</h4>
          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}
          >
            <Button
              onClick={handleCancel}
              type='primary'
              style={{ backgroundColor: 'lightseagreen' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(id)}
              type='primary'
              style={{ backgroundColor: 'red' }}
            >
              Yes! Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SellerManagementPage;
