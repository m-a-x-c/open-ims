interface Props {
  name: string;
  errors?: any;
  label: string;
  type?: string;
  register: any;
  required?: boolean;
  defaultValue?: any;
}

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '160px 1fr',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
};

const CustomInput = ({
  name,
  errors = {},
  required = false,
  label,
  register,
  type = 'text',
}: Props) => {
  return (
    <div style={rowStyle}>
      <label htmlFor={name} className='label'>
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        {...register(name, { required: required })}
        className={`input-field ${errors[name] ? 'input-field-error' : ''}`}
      />
    </div>
  );
};

export default CustomInput;
