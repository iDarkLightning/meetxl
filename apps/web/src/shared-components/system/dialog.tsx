import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";
import { transitionClasses } from "./transition";

export const DialogWrapper: React.FC<
  React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
  }>
> = (props) => (
  <Transition appear show={props.isOpen} as={Fragment}>
    <Dialog as="div" className="z-10" onClose={props.onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 z-30 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center ">
          <Transition.Child as={Fragment} {...transitionClasses}>
            <Dialog.Panel className="my-8 rounded-lg border-[0.0125rem] border-accent-stroke bg-background-secondary p-6">
              {props.children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
