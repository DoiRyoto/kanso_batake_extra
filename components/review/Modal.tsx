import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

export function Modal({ imageUrl }: { imageUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-1/5">
          <Image
            alt="etc"
            src={imageUrl}
            width={1024}
            height={595}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <ScrollArea className="max-h-[60vh]">
          <Image
            alt="etc"
            src={imageUrl}
            width={1920}
            height={1080}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
