interface Props {
  step: number;
  total?: number;
  title: string;
  subtitle?: string;
}

export function StepHeader({ step, total = 10, title, subtitle }: Props) {
  return (
    <div className="mb-2">
      <div className="text-xs font-medium text-muted-foreground mb-2">
        Step {step} of {total}
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-1">{title}</h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
