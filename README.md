DocuPulse AI 🧠⚡
DocuPulse AI on moderni, täysin tyyppiturvallinen asiakirja-analyysialusta, joka on suunniteltu suurten PDF-tiedostojen louhintaan ja niistä keskusteluun tekoälyn avulla. Sovellus käyttää neuraalista käyttöliittymää ja Gemini 1.5 Flash -mallia tarjotakseen nopean ja tarkan analyysin.
🏗️ Arkkitehtuuri & Tekninen Pino
Projekti on rakennettu painottaen skaalautuvuutta, suorituskykyä ja huippuluokan käyttäjäkokemusta.
Frontend: Next.js 16 (App Router) ja React 19.
Kieli: TypeScript (Strict mode) kattavaan tyyppiturvallisuuteen.
Tyylittely: Tailwind CSS kustomoidulla "Cyberpunk/SaaS"-teemalla ja lasiefekteillä (backdrop-blur).
AI-moottori: Google Gemini 1.5 Flash – optimoitu suurille konteksti-ikkunoille ja nopeille vastauksille.
Tietokanta & Backend: Supabase PostgreSQL.
Tallennus: Supabase Storage dokumenttien hallintaan.
Auth: Supabase Auth (Google OAuth) turvalliseen kirjautumiseen.
PDF-prosessointi: PDF.js (v5.4.624) asiakaspuolen tekstinlouhintaan.
🚀 Senior-tason ominaisuudet
Tämä projekti osoittaa syvällistä ymmärrystä modernista web-kehityksestä:
Custom RAG-logiikka: PDF-tiedostojen tekstin louhinta suoraan selaimessa (Client-side extraction), mikä vähentää palvelimen kuormitusta.
RLS-tietoturva: Row Level Security (RLS) varmistaa, että käyttäjät näkevät ja voivat hallita vain omia dokumenttejaan.
Resoluutiolukitus: Keskitetty tarkistus page.tsx-tasolla estää sovelluksen käytön liian pienillä näytöillä, varmistaen optimaalisen analyysikokemuksen.
Dynaaminen lataus: Komponenttien dynaaminen importtaus (next/dynamic) parantaa alkulatausnopeutta ja suorituskykyä.
Neuraalinen UI: Kustomoidut ilmoitus- ja vahvistuskomponentit (SystemNotification, SystemModal), jotka korvaavat selaimen oletuselementit.
🛠️ Tietokantamalli
Järjestelmä käyttää relaatiomallia, joka on suunniteltu tehokkaaseen hakuun:
Käyttäjä (User): Supabase Authin hallitsema identiteetti.
Dokumentti (Document): Sisältää tiedoston metatiedot, user_id-viittauksen, tallennuspolun ja erotetun tekstisisällön (content).
⚙️ Aloitusohjeet
Esivaatimukset
Node.js 20+
Supabase-projekti
API-avaimet: Google Gemini API, Supabase URL & Anon Key.
Asennus
Kloonaa repositorio: git clone https://github.com
Asenna riippuvuudet: npm install
Määritä ympäristömuuttujat: Kopioi .env.example -> .env.local ja täytä avaimet.
Alusta tietokanta: Aja SQL-skriptit Supabasen SQL Editorissa (taulun luonti ja RLS-säännöt).
Käynnistä kehityspalvelin: npm run dev