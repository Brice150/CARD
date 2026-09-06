<div align="center">
<img height="130px" width="130px" src="./src/assets/images/Logo.webp">
</div>

# CARD, un site web d’entreprise avec une carte de visite interactive

[![CI](https://github.com/Brice150/CARD/actions/workflows/ci.yml/badge.svg)](https://github.com/Brice150/CARD/actions/workflows/ci.yml)

Frontend : Angular
<br>

<details>
  <summary>Features</summary>

### 🏠 Accueil

- Visualisation d’une carte de visite animée (effet flip) sur la page d’accueil

---

### ℹ️ À propos

- Consultation des informations sur l’entreprise

---

### 📬 Contact

- Accès à un formulaire de contact avec validation des champs

---

</details>

<details>
  <summary>Installation locale</summary>

### Cloner le projet

```bash
  git clone https://github.com/Brice150/CARD.git
```

### Installer les dépendances

```bash
  npm install
```

### Lancer l'application

```bash
  ng serve -o
```

### Lancer les tests

```bash
  npm test
```

### Vérifier le formatage et le style

```bash
  npm run format:check
  npm run lint
```

</details>

<details>
  <summary>Qualité et tests</summary>

### Socle technique

Angular 21, composants autonomes, détection de changement **zoneless**, routes chargées à la
demande. Les entrées et sorties des composants passent par les fonctions `input()` et `output()`,
les requêtes de vue par `viewChild()` : aucun décorateur de ce type ne subsiste.

### Couverture

La suite tourne sous **Vitest** et la couverture est verrouillée : le lancement échoue sous
**100 %** sur les quatre compteurs. Elle ne peut donc pas baisser sans que la CI le refuse.

```bash
  npm run test:ci
```

### Intégration continue

Chaque push et chaque pull request déclenchent un job unique : installation, vérification du
formatage Prettier, ESLint, tests unitaires sur jsdom, puis build de production. Un nouveau
push sur une branche annule le run encore en cours.

Dependabot suit les dépendances npm et les actions GitHub, groupées par famille. Les majors
d'Angular en sont exclus : ils se migrent avec `ng update`, pas en fusionnant un bot.

</details>
