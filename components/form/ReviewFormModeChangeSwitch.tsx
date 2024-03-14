'use client'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
 
export function SwitchDemo({ defaultChecked = true }:{ defaultChecked: boolean }) {
    const searchParams = useSearchParams();// URLの検索パラメータを管理するフック
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleSwitchChange = () => {
    setIsChecked(!isChecked)
    if(isChecked) {
      params.set("mode", "manual")
    } else {
      params.set("mode", "auto")
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="relative w-full mb-5">
      <div className="flex items-center space-x-2 absolute -top-5 right-0" >
        <Switch id="mode-switch" onCheckedChange={handleSwitchChange} checked={isChecked} />
        <Label htmlFor="mode-switch">DOIから情報を取得</Label>
    </div>
    </div>
  )
}