import { Link } from 'react-router';
import { getCartList, updateCartItem, deleteCartItem } from '@/api/server/cart';
import TipsModal from '@/component/TipsModal';
import { useBtnLoading } from '@/utils/util';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { refreshCartCount } from '@/slices/cartSlice';

export const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { btnLoading, withBtnLoading } = useBtnLoading();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      setLoading(true);
      const {
        data: { data },
      } = await getCartList();
      setItems(data);
      // 同步更新 header 的購物車數量
      dispatch(refreshCartCount());
    } catch (err) {
      console.error(err);
      message.error('載入購物車失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const changeQty = async (item, qty) => {
    if (qty === 0) {
      return handleOpenTipsModal(item);
    }
    try {
      await updateCartItem(item.id, { product_id: item.product.id, qty });
      message.success('已更新數量');
      await loadCart();
    } catch (err) {
      console.error(err);
      message.error('更新數量失敗');
    }
  };

  const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
  const [deleteItemTitle, setDeleteItemTitle] = useState('');
  const [deletingProductId, setDeletingProductId] = useState(null);
  const handleOpenTipsModal = (item) => {
    setIsTipsModalOpen(true);
    setDeleteItemTitle(item.product.title);
    setDeletingProductId(item.id);
  };

  const handleCloseTipsModal = () => {
    setIsTipsModalOpen(false);
    setDeleteItemTitle('');
  };

  const handleRemove = async () => {
    await withBtnLoading(`delete_${deletingProductId}`, async () => {
      try {
        await deleteCartItem(deletingProductId);
        message.success('刪除成功');
        handleCloseTipsModal();
        await loadCart();
      } catch (err) {
        console.error(err);
        message.error('刪除失敗');
      }
    });
  };

  const subtotal = items.total;
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 120;
  const total = items.final_total;
  const isCartEmpty = !items?.carts?.length;

  const goCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">購物車</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {items.carts.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">🛒</div>
                <div className="text-lg font-semibold">您的購物車是空的</div>
                <div className="mt-4">
                  <Link to="/products" className="text-orange-500 hover:underline">
                    去逛逛商品
                  </Link>
                </div>
              </div>
            ) : (
              items.carts.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.imageUrl || 'https://via.placeholder.com/200?text=No+Image'}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-lg">{item.product.title}</div>
                        <div className="text-gray-500 text-sm mt-1">NT${item.product.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-orange-500">NT${item.final_total}</div>
                        <button
                          type="button"
                          onClick={() => handleOpenTipsModal(item)}
                          className="text-sm text-gray-400 hover:text-red-500 mt-2 cursor-pointer"
                        >
                          刪除
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQty(item, item.qty - 1)}
                          className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <div className="px-2 min-w-[40px] text-center">{item.qty}</div>
                        <button
                          type="button"
                          onClick={() => changeQty(item, item.qty + 1)}
                          className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <aside>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">訂單摘要</h2>
            <div className="flex justify-between text-gray-600 mb-2">
              <div>小計</div>
              <div>NT${subtotal}</div>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <div>運費</div>
              <div>{shipping === 0 ? '免運' : `NT${shipping}`}</div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <div className="text-lg font-bold">總計</div>
              <div className="text-2xl font-bold text-orange-500">NT${total}</div>
            </div>

            <button
              disabled={isCartEmpty}
              className="mt-6 w-full cart-btn block text-center"
              onClick={() => goCheckout()}
            >
              前往結帳
            </button>
          </div>
        </aside>
      </div>

      {/* 刪除產品 Modal */}
      <TipsModal
        isOpen={isTipsModalOpen}
        onClose={handleCloseTipsModal}
        title={`是否要刪除「${deleteItemTitle}」?`}
        loading={btnLoading[`delete_${deletingProductId}`]}
        onConfirm={handleRemove}
      />
    </div>
  );
};
