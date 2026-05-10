export default function InicioPage() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        Inicio
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-50">
        Resumo principal
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
        Esta tela vai concentrar os dados iniciais do painel, separados da Home
        que funciona como entrada e navegacao principal.
      </p>
    </section>
  );
}
