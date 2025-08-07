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

## 🏗️ Struttura del Progetto

```
gestionale-magazzino/
├── server/                   # Cartella con codice backend
│   ├── controller/          # Tutti i controller per le rotte
│   ├── db/                  # Codice per connettersi al database
│   ├── middleware/          # Funzioni di middleware
│   ├── routes/              # Configurazione di tutte le rotte
│   ├── schemas/             # Schemi Zod per validare i dati ricevuti
│   ├── utils/               # Funzioni per validare/confrontare dati e query builder
│   ├── .env                 # Variabili di ambiente
│   └── app.js               # Configurazione Express e connessione alla porta
│
├── src/                     # Cartella con codice frontend
│   ├── components/          # Componenti riutilizzabili (Form, Lista, Sidebar, ecc.)
│   ├── pages/               # Pagine della SPA che utilizzano i componenti
│   ├── store/               # Configurazione Redux
│   │   ├── slices/          # Slice Redux per ogni entità (prodotti, fornitori, ecc.)
│   │   ├── utils/           # Funzioni riutilizzabili usate dalle slice
│   │   └── store.js         # Configurazione Redux store
│   ├── App.jsx              # Componente principale dell'app
│   ├── Main.jsx             # Configurazione React Router
│   └── style.css            # Configurazione Tailwind CSS
│
├── desktop.ini
├── eslint.config.js         # Configurazione ESLint
├── index.html               # Entry point HTML
├── package.json             # Dipendenze e script Node.js
└── vite.config.js           # Configurazione di Vite
```


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
