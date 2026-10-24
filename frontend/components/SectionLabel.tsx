type SectionLabelProps = {
  children: React.ReactNode;
};

export default function SectionLabel({ children }: SectionLabelProps) {
  return <p className="text-sm leading-[1.35] tracking-[-0.02em] opacity-50 md:text-h3">{children}</p>;
  return <p className="text-sm md:text-h3 opacity-50">{children}</p>;
}