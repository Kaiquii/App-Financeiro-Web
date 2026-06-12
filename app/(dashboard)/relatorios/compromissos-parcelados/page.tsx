import { InstallmentCommitmentsView } from "@/features/reports/components/InstallmentCommitmentsView";

type InstallmentCommitmentsPageProps = {
  searchParams: Promise<{
    month?: string | string[];
    year?: string | string[];
  }>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseNumberParam(value: string | string[] | undefined) {
  const parsed = Number(getSingleParam(value));

  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function CompromissosParceladosPage({
  searchParams,
}: InstallmentCommitmentsPageProps) {
  const params = await searchParams;

  return (
    <InstallmentCommitmentsView
      initialMonth={parseNumberParam(params.month)}
      initialYear={parseNumberParam(params.year)}
    />
  );
}
