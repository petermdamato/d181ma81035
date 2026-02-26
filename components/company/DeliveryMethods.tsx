type DeliveryMethodsProps = { methods: string[] };

export function DeliveryMethods({ methods }: DeliveryMethodsProps) {
  if (!methods.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-[#546B4C] mr-1">Delivery:</span>
      {methods.map((name) => (
        <span
          key={name}
          className="inline-flex items-center rounded-md bg-[#546B4C]/10 px-2.5 py-0.5 text-sm text-[#233620]"
        >
          {name}
        </span>
      ))}
    </div>
  );
}
