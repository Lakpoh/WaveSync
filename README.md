# 🌊 WaveSync

Un outil léger et élégant de synchronisation SFTP en temps réel pour les développeurs web. Idéal pour le développement WordPress et autres projets web nécessitant une synchronisation continue avec un serveur distant.

## ✨ Caractéristiques

- 🔄 Synchronisation en temps réel
- 📁 Création automatique des dossiers distants
- 🎯 Configuration simple avec fichier .env
- 🚫 Exclusion intelligente des fichiers système
- 💨 Performances optimisées
- 🛑 Arrêt propre avec CTRL+C

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/Lakpoh/WaveSync.git

# Installer les dépendances
cd wavesync
npm install
```

## ⚙️ Configuration

1. Créez un fichier `.env` à la racine :

```env
SFTP_HOST=votre-serveur.com
SFTP_PORT=22
SFTP_USER=votre-username
SFTP_PASSWORD=votre-password
# Ou utilisez une clé SSH (recommandé)
# SFTP_KEY_PATH=/chemin/vers/votre/cle_privee
```

2. Modifiez les chemins dans `watch.js` selon vos besoins :

```javascript
const localPath = './src/votre-projet';
const remotePath = '/chemin/distant/sur/le/serveur';
```

## 🏃‍♂️ Utilisation

```bash
# Démarrer la synchronisation
npm run watch

# Pour arrêter : CTRL+C
```

## 📋 Structure du Projet

```
wavesync/
├── watch.js           # Script principal
├── package.json       # Dépendances
├── .env              # Configuration (à créer)
└── .gitignore        # Exclusions Git
```

## 🔧 Personnalisation

### Fichiers ignorés
Modifiez la section `ignored` dans `watch.js` pour ajuster les fichiers à ne pas synchroniser :

```javascript
ignored: [
    /(^|[\/\\])\../,     // Fichiers cachés
    '**/node_modules/**',
    '**/vendor/**',
    '**/*.log',
    '**/*.zip',
    // Ajoutez vos patterns ici
]
```

## 🛡️ Sécurité

- Ne jamais commiter le fichier `.env`
- Préférer l'authentification par clé SSH
- Limiter les permissions SFTP au strict nécessaire
- Utiliser un utilisateur SFTP dédié

## 📝 Notes

- Assurez-vous d'avoir les droits d'écriture sur le serveur distant
- Vérifiez les paramètres de pare-feu pour le port SFTP
- Pour les gros projets, considérez utiliser le mode `watch:debug`

## 📚 Dépendances

- chokidar : Surveillance des fichiers
- node-scp : Transferts SFTP
- dotenv : Gestion de la configuration

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

Remi Twardowski
