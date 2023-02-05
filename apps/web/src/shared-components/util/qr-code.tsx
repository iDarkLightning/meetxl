import { Button } from "@/shared-components/system/button";
import { DialogWrapper } from "@/shared-components/system/dialog";
import { Heading } from "@/shared-components/system/heading";
import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { FaQrcode } from "react-icons/fa";
import Code from "react-qr-code";

export const QRCode: React.FC<{ code?: string }> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} icon={<FaQrcode />}>
        QR Code
      </Button>
      <DialogWrapper isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4">
          <Dialog.Title
            as={Heading}
            level="h2"
            className="flex justify-between gap-2"
          >
            <span>QR Code</span>
            {props.code && (
              <span className="font-mono text-green-500">{props.code}</span>
            )}
          </Dialog.Title>
          <Code value={window.location.href} bgColor="#1C1C1C" fgColor="#fff" />
        </div>
      </DialogWrapper>
    </>
  );
};
