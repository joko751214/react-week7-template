import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { message, Spin } from 'antd';
import { getCartList } from '@/api/server/cart';
import { checkout } from '@/api/server/order';
import { useNavigate } from 'react-router';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      address: '',
      message: '',
    },
    mode: 'onTouched',
  });

  const loadCart = async () => {
    try {
      setCartLoading(true);
      const {
        data: { data },
      } = await getCartList();
      setCart(data);
      console.log(data, 'data');
    } catch (err) {
      console.error(err);
      message.error('載入購物車失敗');
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const onSubmit = async (formData) => {
    if (!cart?.carts?.length) {
      message.warning('購物車是空的');
      return;
    }

    try {
      const params = {
        user: { ...formData },
        message: formData.message,
      };
      console.log(params, 'params');
      await checkout({
        user: { ...formData },
        message: formData.message,
      });
      message.success('結帳成功');
      reset();
      navigate('/cart');
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || '結帳失敗');
      throw err;
    }
  };

  const subtotal = cart?.total ?? 0;
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 120;
  const total = cart?.final_total ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">結帳付款</h1>
        <Link to="/cart" className="text-orange-500 hover:underline">
          返回購物車
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">收件資訊</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  <span className="text-red-500">*</span>姓名
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: '請輸入姓名' })}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    errors.name ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="請輸入姓名"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  <span className="text-red-500">*</span>Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: '請輸入 Email',
                    pattern: { value: emailRegex, message: 'Email 格式不正確' },
                  })}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tel">
                  <span className="text-red-500">*</span>電話
                </label>
                <input
                  id="tel"
                  type="tel"
                  {...register('tel', {
                    required: '請輸入電話',
                    minLength: { value: 9, message: '電話需超過 8 碼' },
                  })}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    errors.tel ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="請輸入電話"
                />
                {errors.tel && <p className="text-red-500 text-xs mt-1">{errors.tel.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                  <span className="text-red-500">*</span>地址
                </label>
                <input
                  id="address"
                  type="text"
                  {...register('address', { required: '請輸入地址' })}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${
                    errors.address ? 'border-red-400' : 'border-gray-200'
                  }`}
                  placeholder="請輸入地址"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                  留言
                </label>
                <textarea
                  id="message"
                  rows="4"
                  {...register('message')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
                  placeholder="有任何需求都可以寫在這裡"
                />
              </div>

              <button type="submit" className="w-full cart-btn" disabled={isSubmitting}>
                {isSubmitting ? '送出中...' : '確認送出'}
              </button>
            </form>
          </div>
        </section>

        <aside>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">付款摘要</h2>
            {cartLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : (
              <>
                <div className="space-y-3 text-gray-600">
                  {(cart?.carts || []).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate mr-3">{item.product?.title}</span>
                      <span className="text-gray-900">x{item.qty}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t my-4" />

                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>商品小計</span>
                    <span>NT${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>運費</span>
                    <span>{shipping === 0 ? '免運' : `NT$${shipping}`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between text-gray-900 font-semibold">
                    <span>應付金額</span>
                    <span>NT${total}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">* 實際金額以購物車結算為準</p>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
