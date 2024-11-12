// watch.js
const chokidar = require('chokidar');
const { Client } = require('node-scp');
const path = require('path');
require('dotenv').config();

const config = {
    host: process.env.SFTP_HOST || 'example.com',
    port: process.env.SFTP_PORT || 22,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
};

// Chemins modifiés
const localPath = path.resolve('./src/mon-projet');
const remotePath = '/www/mon-projet'; // Chemin simplifié

// Création du client SCP
async function createClient() {
    try {
        return await Client(config);
    } catch (error) {
        console.error('Erreur de connexion SFTP:', error);
        process.exit(1);
    }
}

// Fonction pour créer un dossier distant et ses parents
async function ensureRemoteDirectory(client, remotePath) {
    const parts = remotePath.split('/').filter(Boolean);
    let currentPath = '/';
    
    for (const part of parts) {
        currentPath = path.posix.join(currentPath, part);
        try {
            await client.mkdir(currentPath);
            console.log(`📁 Création dossier: ${currentPath}`);
        } catch (error) {
            // Ignore l'erreur si le dossier existe déjà
            if (error.code !== 4) {
                console.warn(`Note: Le dossier ${currentPath} existe peut-être déjà`);
            }
        }
    }
}

// Fonction pour uploader un fichier
async function uploadFile(client, localFile) {
    const relativePath = path.relative(localPath, localFile);
    const remoteFile = path.posix.join(remotePath, relativePath);
    const remoteDir = path.posix.dirname(remoteFile);

    try {
        // Assure que le dossier distant existe
        await ensureRemoteDirectory(client, remoteDir);
        
        // Upload du fichier
        await client.uploadFile(localFile, remoteFile);
        console.log(`✅ Synchronisé: ${relativePath}`);
    } catch (error) {
        console.error(`❌ Erreur upload ${relativePath}:`, error);
    }
}

// Fonction pour supprimer un fichier distant
async function deleteFile(client, localFile) {
    const relativePath = path.relative(localPath, localFile);
    const remoteFile = path.posix.join(remotePath, relativePath);
    
    try {
        await client.unlink(remoteFile);
        console.log(`🗑️  Supprimé: ${relativePath}`);
    } catch (error) {
        if (error.code !== 2) {
            console.error(`❌ Erreur suppression ${relativePath}:`, error);
        }
    }
}

// Démarrage du watcher
async function startWatcher() {
    console.log('🔄 Démarrage avec les paramètres:');
    console.log(`📂 Dossier local: ${localPath}`);
    console.log(`🌐 Dossier distant: ${remotePath}`);
    
    const client = await createClient();
    console.log('🔌 Connecté au serveur SFTP');    
    console.log('👀 Surveillance des modifications...');

    // Configuration du watcher
    const watcher = chokidar.watch(localPath, {
        ignored: [
            /(^|[\/\\])\../,
            '**/node_modules/**',
            '**/vendor/**',
            '**/*.log',
            '**/*.zip',
            '**/release/**'
        ],
        persistent: true
    });

    // Gestion des événements
    watcher
        .on('add', path => uploadFile(client, path))
        .on('change', path => uploadFile(client, path))
        .on('unlink', path => deleteFile(client, path))
        .on('error', error => console.error('Erreur Watcher:', error));

    // Gestion de l'arrêt propre
    process.on('SIGINT', async () => {
        console.log('\n🛑 Arrêt de la surveillance...');
        await client.close();
        process.exit();
    });
}

startWatcher().catch(console.error);