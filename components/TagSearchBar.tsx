'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedCallback } from 'use-debounce';

// Searchコンポーネントの定義
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();// URLの検索パラメータを管理するフック
  const pathname = usePathname();
  const { replace } = useRouter();
  
  // 検索処理をデバウンスするフック
  // ユーザーの入力が300ミリ秒止まった後に処理を実行
  const handleSearch = useDebouncedCallback((term) => {
    // 現在の検索パラメータを取得
    const params = new URLSearchParams(searchParams);
    if (term) {
        // 検索語があれば、queryパラメータを設定
      params.set('tag', term);
    } else {
        // 検索語がなければ、queryパラメータを削除
      params.delete('tag');
    }
    // パスと更新された検索パラメータでURLを置き換え
    replace(`${pathname}?${params.toString()}`);
  }, 300)

  // コンポーネントのレンダリング部分
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // defaultValue={searchParams.get('tag')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}