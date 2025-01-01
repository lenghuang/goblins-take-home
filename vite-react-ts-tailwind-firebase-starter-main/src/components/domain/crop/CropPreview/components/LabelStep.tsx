export const LabelStep = ({ step, text, caption }: { step: number; text: string; caption: string }) => (
  <div className="flex flex-col gap-3">
    {step != 1 && <hr className="m-4" />}
    <div className="flex items-center gap-2 text-lg font-semibold">
      <div className="flex items-center justify-center rounded-full w-8 h-8 bg-primary ">{step}</div>
      <p>{text}</p>
    </div>
    <div className="text-sm rounded-xl px-3 py-2 bg-base-200">{caption}</div>
  </div>
);
