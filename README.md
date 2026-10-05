# Projet : PC indestructible

Mini-site d’anniversaire autonome : ouvrez simplement `index.html` dans un navigateur.

## Personnaliser le cadeau

Dans le haut de [`script.js`](script.js), modifiez l’objet `CONFIG` :

- `prenom` : prénom affiché durant les tests ;
- `montantFinal` : montant révélé à la fin ;
- `devise` : symbole monétaire ;
- `paliers` : montants de la fausse négociation ; 250 € lance la machine à sous, puis 500 € lance le Snake pour le ×2 final ;
- `participants` : liste prévue pour personnaliser les personnes qui offrent le cadeau.
- `devMode` : laissez `true` pour afficher les raccourcis d’étapes ; passez-le à `false` avant de montrer le site à Camille.

Les principaux textes sont directement dans `index.html`. Les couleurs du thème sont rassemblées au début de `style.css` (`--acid`, `--red`, etc.).

Le site charge deux polices Google ; sans connexion, il utilisera les polices de secours déjà présentes sur l’ordinateur.
