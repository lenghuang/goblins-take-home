export const LabelStep = ({ step, text }: { step: number; text: string }) => (
  <div className="flex items-center gap-2 text-lg font-semibold">
    <div className="flex items-center justify-center rounded-full w-8 h-8 bg-primary ">{step}</div>
    <p>{text}</p>
  </div>
);
