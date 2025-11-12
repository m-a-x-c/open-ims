import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateSellerModal from '../modal/CreateSellerModal';

const CreateSeller = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}
        >
          Sellers
        </h3>
        <button
          type='button'
          onClick={() => setOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 8px',
            background: 'transparent',
            border: 'none',
            borderRadius: 4,
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 120ms',
            marginLeft: -8,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <PlusOutlined style={{ fontSize: 12 }} />
          New seller
        </button>
      </div>

      <CreateSellerModal openModal={open} setOpenModal={setOpen} />
    </>
  );
};

export default CreateSeller;
