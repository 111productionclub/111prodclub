type SectionLabelProps = {
  children: React.ReactNode;
};

export default function SectionLabel({ children }: SectionLabelProps) {
  return <p className="text-sm md:text-h3 opacity-50">{children}</p>;
}