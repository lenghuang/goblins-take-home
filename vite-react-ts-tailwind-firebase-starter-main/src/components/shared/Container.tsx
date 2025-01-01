export const Container = ({ children }: { children: any }) => (
  <div className="flex flex-col items-center w-full min-h-full">
    <div className="p-8 w-full max-w-320">{children}</div>
  </div>
);
