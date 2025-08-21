export function ListaDettagli({ dati, campi, hasError, errorMessage }) {
  if (!dati)
    return <div className="text-center m-10 text-2xl">Caricamento...</div>;

  if (hasError) {
    return (
      <div
        className="
          width-full
          bg-gradient-to-r from-red-800 to-red-600 text-white
          p-3
          rounded-lg
          shadow-xl shadow-gray-700
        "
      >
        <h1>{errorMessage.error || "Errore durante il caricamento"}</h1>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          width-full
          bg-gradient-to-r from-gray-700 to-gray-500 text-white
          p-3
          rounded-lg
          shadow-xl shadow-gray-700
        "
      >
        <h2>{dati.struttura}</h2>
        <h2>{dati.data}</h2>
      </div>

      <div className="mt-6 rounded-lg shadow-lg overflow-hidden">
        <div className="table w-full">
          <div className="table-header-group bg-gray-700 text-white font-title uppercase">
            <div className="table-row">
              {campi.map((c, idx) => (
                <div className="table-cell px-4 py-2" key={idx}>
                  {c}
                </div>
              ))}
            </div>
          </div>

          <div className="table-row-group font-body bg-gray-50">
            {dati.prodotti.map((p, idx) => (
              <div
                key={p}
                className={`table-row ${
                  idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                } hover:bg-gray-300 transition`}
              >
                <div className="table-cell px-4 py-2">{p.nome}</div>
                <div className="table-cell px-4 py-2">{p.codice}</div>
                <div className="table-cell px-4 py-2">{p.quantita}</div>
                {p.prezzo_unitario && (
                  <div className="table-cell px-4 py-2">
                    {p.prezzo_unitario}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
