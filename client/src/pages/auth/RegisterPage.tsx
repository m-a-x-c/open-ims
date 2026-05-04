import { SpinnerIcon } from '@phosphor-icons/react';
import { Button } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toastMessage from '../../lib/toastMessage';
import { useRegisterMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userRegistration, { isLoading }] = useRegisterMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    if (data.password !== data.confirmPassword) {
      toastMessage({ icon: 'error', text: 'Password and confirm password must match.' });
      return;
    }
    try {
      const res = await userRegistration(data).unwrap();
      if (res.statusCode === 201) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toastMessage({ icon: 'success', text: res.message });
      }
    } catch (error: any) {
      const errMsg =
        error?.data?.errors?.[Object.keys(error?.data?.errors)[0]] || error.data.message;
      toastMessage({ icon: 'error', text: errMsg });
    }
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
    marginBottom: 6,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src='/favicon.svg'
            alt='logo'
            style={{ width: 36, height: 36, marginBottom: 16 }}
          />
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
            Create your account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Start managing your inventory in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor='name' style={labelStyle}>Name</label>
            <input
              id='name'
              type='text'
              autoComplete='name'
              {...register('name', { required: true })}
              placeholder='Your name'
              className={`input-field ${errors['name'] ? 'input-field-error' : ''}`}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor='email' style={labelStyle}>Email</label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              {...register('email', { required: true })}
              placeholder='you@example.com'
              className={`input-field ${errors['email'] ? 'input-field-error' : ''}`}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor='password' style={labelStyle}>Password</label>
            <input
              id='password'
              type='password'
              autoComplete='new-password'
              placeholder='At least 6 characters'
              {...register('password', { required: true })}
              className={`input-field ${errors['password'] ? 'input-field-error' : ''}`}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label htmlFor='confirmPassword' style={labelStyle}>Confirm password</label>
            <input
              id='confirmPassword'
              type='password'
              autoComplete='new-password'
              placeholder='Re-enter your password'
              {...register('confirmPassword', { required: true })}
              className={`input-field ${errors['confirmPassword'] ? 'input-field-error' : ''}`}
            />
          </div>

          <Button
            htmlType='submit'
            type='primary'
            disabled={isLoading}
            style={{ width: '100%', height: 36 }}
          >
            {isLoading && <SpinnerIcon className='spin' weight='bold' />}
            Create account
          </Button>
        </form>

        <p
          style={{
            marginTop: 20,
            fontSize: 13,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}
        >
          Already have an account?{' '}
          <Link to='/login' style={{ color: 'var(--text)', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
