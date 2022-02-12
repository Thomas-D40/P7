# P7

Ceci est le Projet 7 pour la formation de Développeur Web avec OpenClassRooms.

Ce projet consiste à créer un réseau social d'entreprise.
Pour l'API, les technologies Node.js, express et Sequelize (ORM pour communiquer avec les BDD SQL) ont été utilisées.
Pour le côté client, React.js est le framework principal pour structurer le projet. Sass a été utilisé pour gérer le style et Redux comme conteneur d'état.
Afin de permettre un système de chat instantannée, un serveur gérant les websockets a été mis en place en utilisant la librairie Socket.io

INSTRUCTIONS
Il vous faudra avoir installé sur votre machine:
Node.js,
MySQL

## BDD ##

## Installation ##

Une fois ce repo cloné, dans votre terminal, faites "cd api", "npm install" pour installer l'ORM Sequelize puis "npx sequelize db:create" et " npx sequelize db:migrate" 

N'hésitez pas à vérifier que les options des Foreign Keys sont bien en "CASCADE", si cela s'avère nécessaire, je vous invite à le régler directement dans votre BDD.

## API ##

## Usage ##

Dans un second terminal, faites "cd api" puis "npm start" pour démarrer le serveur gérant l'API.

Le serveur devrait se lancer sur votre localhost:5000

## Client ##

## Installation ##

Dans un troisième terminal, faites "cd client" puis "npm install"

## Usage ##

Faites "npm start", ceci démarrera le serveur de développement React.

Si le navigateur ne se lance pas ou affiche une erreur 404, cliquez sur http://localhost:3000

## Socket ##

## Installation ##

Dans un quatrième terminal, faites "cd socket" puis "npm install" 

## Usage ##

Faites "nodemon".

Le serveur devrait se lancer sur votre localhost:8900

