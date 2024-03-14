"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { affiliations, fields, userType } from "@/constants";
import { useRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { fetchUser, setUser, updateUser } from "@/actions/user.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

const FormSchema = z.object({
  username: z.string().min(1, {
    message: "名前を入力してください。",
  }),
  affiliation: z.string().min(1, {
    message: "所属を入力してください。",
  }),
  field: z.string().min(1, {
    message: "専門分野を入力してください。",
  }),
  role: z.string().min(1, {
    message: "学生/教員を選択してください。",
  }),
  url: z.string().optional(),
});

export function ProfileEdittingForm({ 
  user 
}: { 
  user: userType 
}) {
  const isLoading = useRef(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        // フォームフィールドのデフォルト値を設定
        username: user.name ? user.name : "",
        affiliation: user.affiliation ? user.affiliation.toString() : "",
        field: user.field ? user.field.toString() : "",
        role: user.role ? user.role : "",
        url: user.works ? user.works.toString() : "",
        
      },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    isLoading.current = true;

    const userData: userType = {
      id: user.id,
      name: data.username,
      affiliation: [data.affiliation],
      field: [data.field],
      role: data.role,
      works: [data.url || ""],
    };

    try {
      await updateUser(userData);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update User info.");
    }
    router.push(`/user/${user.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex flex-row gap-1">名前<p className="text-red-600">*</p></FormLabel>
              <FormControl>
                <Input placeholder="名前を入力してください" 
                {...field} 
                disabled
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliation"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex flex-row gap-1">所属<p className="text-red-600">*</p></FormLabel>
              <FormDescription className="text-xs">
                自身の所属がない場合は「その他」を選んでください。
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled
                    >
                      {field.value
                        ? affiliations.find(
                            (affiliation) => affiliation.value === field.value
                          )?.label
                        : "所属を選択"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[50vw] p-0">
                  <Command>
                    <CommandInput placeholder="Search affiliation..." />
                    <CommandEmpty>Not found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[50vh] w-full rounded-md border">
                        {affiliations.map((affiliation) => (
                          <CommandItem
                            value={affiliation.label}
                            key={affiliation.value}
                            onSelect={() => {
                              form.setValue("affiliation", affiliation.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                affiliation.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {affiliation.label}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex flex-row gap-1">研究分野<p className="text-red-600">*</p></FormLabel>
              <FormDescription className="text-xs">
                自身の研究分野がない場合は「その他」を選んでください。
              </FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? fields.find((f) => f.value === field.value)?.label
                        : "研究分野を選択"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[50vw] p-0">
                  <Command>
                    <CommandInput placeholder="Search field..." />
                    <CommandEmpty>Not found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[50vh] w-full rounded-md border">
                        {fields.map((f) => (
                          <CommandItem
                            value={f.label}
                            key={f.value}
                            onSelect={() => {
                              form.setValue("field", f.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                f.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {f.label}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row gap-1">役職<p className="text-red-600">*</p></FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value} 
                disabled
                >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="役職を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="教員">教員</SelectItem>
                  <SelectItem value="学生">学生</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>実績が分かるリンク</FormLabel>
              <FormControl>
                <Input placeholder="URLを入力してください"
                {...field} 
                disabled
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading.current ? (
          <Button>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <div className="flex flex-row gap-3">
            <Button type="submit">Submit</Button>
          </div>
        )}
      </form>
    </Form>
  );
}
