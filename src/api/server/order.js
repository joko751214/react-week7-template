import request from '../axios';

const path = import.meta.env.VITE_API_PATH;

// 客戶購物 - 結帳
export function checkout(data) {
  return request({
    url: `/api/${path}/order`,
    method: 'post',
    data: {data}
  });
}