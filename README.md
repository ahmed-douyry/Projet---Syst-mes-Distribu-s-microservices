# eBank — Gestion bancaire & assistant IA

Application bancaire composée de microservices Spring et d’un frontend Angular. Elle permet de consulter les comptes, d’explorer leurs soldes et d’interroger un assistant bancaire avec des réponses Markdown reçues en streaming.

## Aperçu de l’application

Les captures ci-dessous montrent les deux pages disponibles : **comptes** (`/accounts`) et **assistant bancaire** (`/bot`), sur desktop et mobile, en clair et en sombre.

> Captures réalisées dans Chromium avec des données de démonstration et des réponses SSE simulées : le backend n’était pas joignable lors de la capture. Les noms, adresses `example.test` et montants sont illustratifs. Aucune donnée de démonstration n’est injectée dans le code de production.

### Dashboard — desktop

Indicateurs calculés, répartition par type et liste des comptes avec recherche, filtres, tri, pagination et export CSV.

![Dashboard bancaire en mode clair : indicateurs, répartition et tableau des comptes](docs/screenshots/dashboard-desktop.png)

### Dashboard — mode sombre

![Dashboard bancaire en mode sombre](docs/screenshots/dashboard-dark.png)

### Assistant — accueil

![Assistant bancaire avant la première question](docs/screenshots/assistant-empty.png)

### Assistant — réponse des clients

Les espaces et les retours à la ligne du flux sont conservés. Le Markdown devient un véritable tableau avec en-têtes, lignes et bordures.

![Réponse de l’assistant : tableau des clients avec trois colonnes et des bordures](docs/screenshots/assistant-clients.png)

### Assistant — réponse des comptes

![Réponse de l’assistant : tableau des comptes bancaires](docs/screenshots/assistant-accounts.png)

### Assistant — mode sombre

![Tableau des comptes dans l’assistant en mode sombre](docs/screenshots/assistant-dark.png)

### Versions mobiles

Le menu est repliable. Les tableaux défilent horizontalement dans leur zone, sans élargir la page.

| Dashboard | Assistant bancaire |
| --- | --- |
| ![Dashboard sur un écran mobile de 390 pixels](docs/screenshots/dashboard-mobile.png) | ![Assistant en mode sombre sur un écran mobile de 390 pixels](docs/screenshots/assistant-mobile.png) |

## Organisation

| Dossier | Rôle |
| --- | --- |
| `angualr-front/` | Interface Angular 21, Tailwind CSS 4, Signals et Markdown |
| `customer-service/` | Service clients |
| `ebank-service/` | Service des comptes bancaires |
| `ebank-boot/` | Assistant bancaire IA et endpoints de chat |
| `gateway-service/` | Passerelle API |
| `discovery-service/` | Découverte des services |
| `docs/screenshots/` | Captures réelles du frontend avec les données de démonstration décrites ci-dessus |

## Lancer le frontend

Prérequis : Node.js compatible avec Angular 21 et npm.

```sh
cd angualr-front
npm install
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200). Les services backend doivent être démarrés séparément, avec la passerelle accessible sur `http://localhost:9999`.

Endpoints utilisés par le frontend :

- `GET /EBANK-SERVICE/bankAccounts`
- `GET /EBANK-BOOT/chat?query=...`
- `GET /EBANK-BOOT/chatStream?query=...`

## Vérifications

Depuis `angualr-front/` :

```sh
npm run build
npm test -- --watch=false
```

Dernière validation : **compilation de production sans avertissement et 17 tests réussis**. Les régressions du flux SSE sont couvertes : conservation des espaces, des paragraphes et des tableaux, fragments incomplets, progression cumulative, erreur réseau et rendu Markdown assaini.

Le navigateur a également vérifié les tableaux avec bordures et l’absence de débordement de page à 390 px.


