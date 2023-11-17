import clsx from "clsx";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  size?: "md" | "lg";
  onClose?: () => void;
}

export const Modal: FunctionComponent<ModalProps & PropsWithChildren> = ({
  children,
  open,
  size = "md",
  onClose,
}) => {
  // Local values
  const [hideModal, setHideModal] = useState(true);

  // Style properties

  const openClass = useMemo(() => {
    return open
      ? "opacity-100 translate-y-0"
      : "h-0 w-0 opacity-0 -translate-y-60";
  }, [open]);

  const hideModalClass = useMemo(() => {
    return hideModal ? "hidden" : "";
  }, [hideModal]);

  // Event Listeners

  const onModalTransitionEnd = () => {
    if (!open) {
      setHideModal(true);
    }
  };

  // Side Effect

  useEffect(() => {
    if (open) {
      setHideModal(false);
    }
  }, [open]);

  return createPortal(
    <div
      className={clsx(
        "fixed z-10 inset-0 overflow-hidden transition-all duration-1000",
        openClass,
        hideModalClass,
      )}
      onTransitionEnd={onModalTransitionEnd}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 overflow-hidden w-full h-full bg-slate-600 opacity-50" />
      <div className="relative z-10" role="dialog" aria-modal="true">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className={clsx(
                "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl",
                size === "lg" && "lg:max-w-4xl min-h-[95vh] min-w-[320px]",
              )}
            >
              <div className="absolute top-2 right-2">
                {/* Close button, only appear if there's onClose callback passed */}
                {onClose && (
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6 text-gray-400 hover:text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
