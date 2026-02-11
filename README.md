# Budjettisovellus

Full-stack budjettisovellus, jossa käyttäjä voi lisätä tuloja ja menoja,
muokata ja poistaa tapahtumia sekä seurata taloudellista yhteenvetoa
(tulot / menot / saldo + kaavio).

## Ominaisuudet

-   Lisätään tapahtuma (otsikko, summa, tyyppi, päivä)
-   Muokataan ja poistetaan tapahtumia
-   Näytetään yhteenveto (tulot, menot, saldo)
-   Yhteenvedossa myös ympyräkaavio (Chart.js)
-   Rahasummat tallennetaan tietokantaan sentteinä, UI näyttää euroina (esim. 500,00 €)

---

## Teknologiat

### Frontend

-   Angular 
-   Chart.js

### Backend

-   Node.js ja npm
-   Express
-   MongoDB (esim. MongoDB Atlas)

---

# Asennus

## Esivaatimukset

-   Node.js (v18+ suositeltu)
-   npm
-   MongoDB (Atlas tai lokaalisti)
-   Git

Tarkista versiot:

``` bash
node --version
npm --version
git --version
```

------------------------------------------------------------------------

## 💾 Asennus

### 1. Kloonaa repositorio

``` bash
git clone https://github.com/Anssi22/Budjettisovellus.git
cd Budjettisovellus
```

### 2. Asenna riippuvuudet

#### Backend

``` bash
cd backend
npm install
```

#### Frontend

``` bash
cd ../frontend
npm install
```

### 3. Ympäristömuuttujat (.env)

### Backend (`backend/.env`)

Luo tiedosto:

    MONGODB_URI=<OMA_MONGODB_URI>
    PORT=3000

Jos käytät eri porttia, päivitä se myös proxy-asetuksiin. Eli tiedostoon proxy.conf.json.

Frontend ei tarvitse erillistä `.env`-tiedostoa, koska API-kutsut tehdään suhteellisella polulla `/api/...` ja Angularindev-proxy ohjaa ne backendille.


#### Proxy (frontend → backend)

`angular.json`:

``` json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

Proxy ohjaa `/api`-pyynnöt backendille kehitystilassa.

------------------------------------------------------------------------

## 🚀 Käynnistys

### Backend

``` bash
cd backend
npm run dev
```

Jätä käyntiin.

Backend:\
http://localhost:3000



## Frontend

``` bash
cd frontend
npm start
```

Jätä käyntiin.

Frontend:\
http://localhost:4200


---

## API Endpoints

Base (proxyn kautta frontendistä):

    /api/transactions

### Reitit

-   GET /api/transactions\
-   POST /api/transactions\
-   PUT /api/transactions/:id\
-   DELETE /api/transactions/:id

------------------------------------------------------------------------

## Jatkokehitysideoita

-   Suodatus (päivä / tyyppi / hakuteksti)
-   Kuukausinäkymä
-   Kategoriat (ruoka, asuminen, harrastukset)
-   Käyttäjät + kirjautuminen