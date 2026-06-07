"use client";

export default function Modal({ open, message, onCancel, onConfirm, singleButton = false }) {
  if (!open) return null; // early return if modal is not open

  return (
    <section>
      {/* Dimmed background overlay (unresponsive to clicks) */}
      <div className="fixed bg-black/60 inset-0 z-[100]"></div>

      {/* Modal content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] max-w-sm rounded-xl bg-cyan-700 z-100 space-y-4 ">
        <p className="text-white text-center pt-4 px-5">{message}</p>
        <div className="flex justify-around">
          {singleButton ? (
            <button
              className="text-white p-2 w-full hover:bg-black/20 border-t-2 border-white"
              onClick={onConfirm}
            >
              OK
            </button>
          ) : (
            <>
              <button
                className="text-white p-2 w-1/2 hover:bg-black/20 border-t-2 border-white"
                onClick={onConfirm}
              >
                Yes
              </button>
              <button
                className="text-white p-2 w-1/2 hover:bg-black/20 border-l-2 border-t-2 border-white"
                onClick={onCancel}
              >
                No
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
