# Frontend eBank

## Direction visuelle

Une interface de gestion bancaire : navigation bleu encre, accents émeraude,
surfaces sobres et données alignées pour faciliter la lecture. La page `/accounts`
reste le point d’entrée métier ; `/` redirige vers cette page. Les liens de la
sidebar pointent vers la vue et ses sections existantes.

## Architecture et réactivité

- Composants standalone avec `ChangeDetectionStrategy.OnPush`.
- Route comptes chargée à la demande ; service `AccountsApi` pour le GET existant.
- RxJS et `switchMap` pour les requêtes, l’annulation et la reprise après erreur ;
  `toSignal` pour exposer l’état à la vue et libérer la souscription à la destruction.
- Signals pour les filtres, le tri, la pagination et le thème ; `computed` pour
  les agrégats et la liste visible. Un `effect` applique et persiste le thème.
- Cartes d’indicateurs réutilisables ; aucun ajout de bibliothèque de graphiques.
- Tailwind CSS 4 via PostCSS ; les tokens CSS partagés portent les deux thèmes.
  Bootstrap reste installé, mais ses CSS/JS globaux inutilisés ont été retirés
  du bundle pour éviter les conflits. Les icônes Bootstrap sont conservées.

## Signal Forms

Version installée lors de l’analyse : Angular **21.2.25**. L’export
`@angular/forms/signals` est disponible, mais l’API est **expérimentale en v21**.
Le frontend existant ne contient aucun formulaire métier à migrer. Les filtres
locaux ne nécessitent ni validation ni gestion de soumission : ils utilisent des
Signals et des contrôles natifs étiquetés. Aucune API expérimentale n’est donc
introduite dans ce parcours bancaire.

Références :
- https://v21.angular.dev/api/forms/signals/form
- https://v21.angular.dev/tutorials/signal-forms
- https://tailwindcss.com/docs/installation/framework-guides/angular

## Données et comportements

L’endpoint reste `http://localhost:9999/EBANK-SERVICE/bankAccounts`.
Les cinq champs de la liste initiale sont conservés. Les types TypeScript
utilisent désormais les primitives `string` ; les dates JSON acceptent des chaînes.
Aucune devise ni évolution historique n’est inventée : les indicateurs et la
répartition se fondent exclusivement sur la réponse de l’API.

Recherche par compte, client ou type, filtre par type, tri sur compte/solde/date,
pagination de huit lignes et export CSV de tous les résultats filtrés.
L’export protège les cellules textuelles contre l’interprétation de formules.
Le rafraîchissement redemande les données sans mutation métier.

## Accessibilité et vérification

Libellés explicites, lien d’évitement, régions sémantiques, tri annoncé par
`aria-sort`, états annoncés, focus visible, menu mobile au clavier, table avec
défilement horizontal et respect de `prefers-reduced-motion`. Le mode sombre
suit initialement le système puis conserve le choix local lorsqu’il est possible.
Ces améliorations ne constituent pas une certification de conformité WCAG.

Commandes depuis `angualr-front` :

```sh
npm install
npm run build
npm test -- --watch=false
npm start
```

Le backend doit être lancé séparément pour une vérification intégrée des données.

## Résultats de validation

- Compilation de production réussie en conservant les budgets existants.
- Dix tests passent après intégration du chat distant : agrégats, filtres combinés, tri/pagination, reprise API,
  données vides/incomplètes, structure accessible et menu/thème.
- Chromium : rendu inspecté à 1440, 768 et 390 px, clair et sombre ;
  recherche, filtres, pagination, navigation au clavier et persistance du thème
  vérifiés. Aucun débordement horizontal de la page aux largeurs testées.
- Export téléchargé et relu : douze comptes sur cinq colonnes, dont un solde négatif.
- Le backend local sur le port 9999 était indisponible : l’erreur réelle a été
  vérifiée, puis les parcours avec données ont utilisé une interception réseau
  dans le navigateur. Aucune donnée de démonstration n’est ajoutée au frontend.
- Captures locales dans `output/playwright/` (hors versionnement).

## Intégration des commits distants avant publication

La route `/bot`, les deux appels de chat et le service/intercepteur de chargement
ajoutés sur `origin/master` sont conservés. La sidebar inclut l’assistant et
le fil de navigation suit la route. Le chat conserve sa logique et reçoit des
styles locaux compatibles avec les tokens du thème, sans réintroduire Bootstrap
globalement. `ngx-markdown` est aligné sur la version 21 compatible avec Angular
21 (la version 22 distante exige Angular 22). Les tests distants ont été corrigés
pour fournir HttpClient et référencer le nom actuel `LoadingService`.
Compilation sans avertissement et dix tests réussis après fusion.

## Affichage Markdown de l’assistant

Le parseur SSE spécifique au endpoint Spring préserve les espaces de fragments
et les retours à la ligne à l’intérieur de chaque événement. Les événements
incomplets sont différés. Des tests vérifient le DOM Markdown pendant la
progression et à la fin de la réponse, ainsi que les erreurs et la désinfection
HTML. Les styles `.assistant-markdown` sont globaux mais limités au contenu
de l’assistant, car ce DOM est généré par ngx-markdown.

Validation après correction : 17 tests réussis, compilation sans avertissement.
La galerie versionnée se trouve dans `../docs/screenshots/`, avec les légendes
et le contexte des données de démonstration dans le README racine.
