import { Link } from 'react-router';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] bg-linear-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-orange-50 via-pink-50 to-white p-10 md:p-14 text-center shadow-lg">
          <div className="absolute -top-10 -left-10 h-36 w-36 rounded-full bg-orange-200/60 blur-2xl" />
          <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-pink-200/60 blur-2xl" />

          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 bg-white/80 text-orange-600 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              找不到頁面
            </p>
            <h2 className="text-6xl md:text-7xl font-bold mt-6 leading-none text-orange-500">404</h2>
            <h1 className="text-2xl md:text-3xl font-bold mt-4 text-gray-800">這個頁面走失了 🐾</h1>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto">
              你造訪的網址不存在或已被移動，回到首頁繼續幫毛孩挑選好物吧！
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/" className="cart-btn">
                回到首頁
              </Link>
              <Link
                to="/products"
                className="px-6 py-3 rounded-lg border border-orange-200 text-orange-500 font-medium hover:bg-orange-50 transition"
              >
                前往商品列表
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
