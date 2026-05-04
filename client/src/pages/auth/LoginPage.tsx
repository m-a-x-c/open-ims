import { SpinnerIcon } from '@phosphor-icons/react';
import { Button } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toastMessage from '../../lib/toastMessage';
import { useLoginMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';

const LoginPage = () => {
  const [userLogin, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await userLogin(data).unwrap();

      if (res.statusCode === 200) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
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
            style={{ width: 36, height: 36 }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 12 }}>
            <label
              htmlFor='email'
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              {...register('email', { required: true })}
              placeholder='you@example.com'
              className={`input-field ${errors['email'] ? 'input-field-error' : ''}`}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor='password'
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              autoComplete='current-password'
              placeholder='Enter your password'
              className={`input-field ${errors['password'] ? 'input-field-error' : ''}`}
              {...register('password', { required: true })}
            />
          </div>

          <Button
            htmlType='submit'
            type='primary'
            disabled={isLoading}
            style={{ width: '100%', height: 36 }}
          >
            {isLoading && <SpinnerIcon className='spin' weight='bold' />}
            Sign in
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
          Don't have an account?{' '}
          <Link to='/register' style={{ color: 'var(--text)', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
