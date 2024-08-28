import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<
    {
      paperTitle: string;
      venue: string;
      year: string;
      journalName: string;
      journalPages: string;
      journalVol: string;
      authors: string;
      doi: string;
      link: string;
      tags: string;
      imageUrl: string;
      reviewContents: string;
    },
    any,
    undefined
  >;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export const ImageForm = ({ form, setFiles }: Props) => {
  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormControl className="flex text-base-semibold text-gray-200">
              <Input
                type="file"
                accept="image/*"
                placeholder="Add profile photo"
                className="account-form_image-input hidden"
                onChange={(e) => handleImage(e, field.onChange)}
              />
            </FormControl>
            <FormLabel>画像</FormLabel>
            <FormLabel className="account-form_image-label">
              {field.value ? (
                <Image
                  src={field.value}
                  alt="reviewImage"
                  width={1920}
                  height={1080}
                  priority
                  className="object-contain max-h-[30vh]"
                />
              ) : (
                <div className="flex justify-center items-center h-[30vh] border-dashed border-2 text-gray-600">
                  左クリックで画像を選択
                </div>
              )}
            </FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
};
