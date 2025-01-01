export const FiveStarRatingInput = ({
  index,
  name,
  handleChange,
  defaultValue,
}: {
  index: number;
  name: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: number;
}) => (
  <div>
    <input
      key={`${name}_${index}_0`}
      type="radio"
      name={`${name}_${index}`}
      className="rating-hidden hidden"
      onChange={handleChange}
      defaultChecked={defaultValue === undefined}
    />
    {Array.from({ length: 5 }, (_, i) => {
      const value = i + 1;
      return (
        <input
          key={`${name}_${index}_${value}`}
          type="radio"
          name={`${name}_${index}`}
          value={value}
          className="mask mask-star-2"
          onChange={handleChange}
          defaultChecked={!!defaultValue ? value === defaultValue : false}
        />
      );
    })}
  </div>
);

export const FiveStarRatingDisplay = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1 p-2 rounded-lg">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`mask mask-star-2 w-4 h-4 ${i < value ? 'bg-neutral' : 'bg-base-200'}`} />
    ))}
    <span className="ml-2">{value}/5</span>
  </div>
);
