interface Props {
  step: number;
  total?: number;
  title: string;
  subtitle?: string;
  stepLabel?: string;
  ofLabel?: string;
}

export function StepHeader({
  step,
  total = 10,
  title,
  subtitle,
  stepLabel = "Step",
  ofLabel = "of",
}: Props) {
  return (
    <div className="mb-2">
      <div className="city-section-kicker mb-2">
        {stepLabel} {step} {ofLabel} {total}
      </div>
      <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">{title}</h2>
      {subtitle && (
        <p className="text-sm text-[var(--city-muted-fg)]">{subtitle}</p>
      )}
    </div>
  );
}
