import { useCallback, useState } from "react";

// 按鈕載入中狀態（共用 Hook）
export const useBtnLoading = () => {
  const [btnLoading, setBtnLoading] = useState({});

  const withBtnLoading = useCallback(async (key, callback) => {
    setBtnLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await callback();
    } finally {
      setBtnLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  return { btnLoading, withBtnLoading };
};

