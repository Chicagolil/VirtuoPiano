interface SummaryItem {
  label: string;
  value: string | number;
  color: string;
}

interface ChartSummaryProps {
  title: string;
  items: SummaryItem[];
}

export default function ChartSummary({ title, items }: ChartSummaryProps) {
  return (
    <>
      <p className="text-base text-slate-300 dark:text-slate-100 mb-3">
        {title}
      </p>
      <div className="flex items-center justify-between px-8">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-slate-300 dark:text-slate-100">
              {item.label}
            </span>
            <span className={`text-xl font-bold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
