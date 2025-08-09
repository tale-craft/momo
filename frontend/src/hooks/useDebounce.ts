// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * 一个自定义 hook，用于对一个值进行防抖处理。
 * @param value 需要防抖的值 (例如，搜索框的输入)
 * @param delay 防抖延迟时间 (毫秒)
 * @returns 返回经过防抖处理的值
 */
function useDebounce<T>(value: T, delay: number): T {
  // 保存防抖后的值
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置一个定时器，在延迟时间后更新防抖后的值
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 在下一次 effect 运行或组件卸载时，清除上一个定时器
    // 这可以防止在 value 变化过快时，旧的定时器仍在运行
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 仅在 value 或 delay 变化时重新运行 effect

  return debouncedValue;
}

export default useDebounce;