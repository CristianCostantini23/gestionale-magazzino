# Gestionale Magazzino

> Web app per la gestione di magazzino, costruita con React, Redux Toolkit, Tailwind CSS e Vite.

## Descrizione

Questo progetto è un gestionale per monitorare prodotti, entità, fornitori, vendite e movimenti di merce. È pensato per offrire una struttura scalabile e modulare, facilitando l'inserimento e la modifica dei dati tramite una dashboard intuitiva e componenti riutilizzabili.

## Stack Tecnologico

- ⚛️ **React** – UI dinamica e component-based  
- 📦 **Redux Toolkit** – Stato globale con slice modulari  
- 💨 **Tailwind CSS** – Styling rapido e responsive  
- ⚡ **Vite** – Dev server ultra-veloce e build ottimizzata  
- 🌐 **Axios** – HTTP client per comunicazione con API  
- 🛠️ **Node.js/Express** - lato backend

🏗️ ## Struttura del Progetto

Gestionale magazzino/
├── server/               # cartella con codice backend
|    ├── controller/      # tutti i controller per le tutte le rotte
|    ├── db/              # codice per connettersi al db 
|    ├── middleware/      # funzioni di middleware  
|    ├── routes/          # configurazione di tutte le rotte 
|    ├── schemas/         # schemas zod per validare i dati ricevuti
|    ├── utils/           # funzioni per validare e conforntare dati e query builder
|    ├── .env             # variabili di ambiente
|    └── app.js           # configurazione express e connessione alla PORT
├── src/                  # cartella con codice frontend
|    ├── components/      # tutti i componenti riutilizzabili 
|    ├── pages/           # tutte le pagine che compongono la SPA dove si passano i props ai componenti
|    ├── store/           # cartella con il codice per configurare lo store Redux
|    |    ├── slices/     # tutte le slice Redux
|    |    ├── utils/      # funzioni riutilizzabile che vengono usate spesso nelle slices
|    |    └── store.js    # configurazione dello store con tutti i reducers
|    ├── App.jsx          # componente per homepage
|    ├── Main.jsx         # configurazione React Router e gestione delle rotte visitabili
|    └── style.css        # file CSS per configurare tailwind
├── desktop.ini
├── eslint.config.js      # configurazione di eslint
├── index.html            # entry point
├── package.json          # dipendenze Node.js
└── vite.config.js        # configurazione di Vite


🚀 Funzionalità principali
- 🔄 CRUD completo per le seguenti sezioni:
- ✅ Prodotti
- ✅ Entità (es. clienti, negozi, ecc.)
- ✅ Fornitori
- ✅ Brand
- ✅ Vendite e Scarichi merce
- 🧠 Gestione dello stato avanzata tramite Redux Toolkit con createAsyncThunk per chiamate asincrone
- 
🧩 Componenti dinamici e riutilizzabili:
- Form generico che si adatta ai campi della sezione selezionata
- Lista tabellare che si aggiorna automaticamente dopo operazioni CRUD

- ⚡ Aggiornamento dati in tempo reale dopo inserimenti, modifiche e cancellazioni
  
🎨 Interfaccia responsive e moderna con Tailwind CSS:
- Layout a 3 colonne: sidebar, lista centrale, form dinamico a destra
- Ottimizzata anche per schermi ridotti
  
-🧹 Pulizia e modularità del codice con struttura scalabile e suddivisione logica di componenti, slice, e utilità comuni
