\#  Projet Smart Home



Description

Ce projet permet de gérer et contrôler des équipements domotiques (lumières, thermostats, caméras, serrures, alarmes) via une interface web moderne. L'application utilise une architecture microservices pour séparer les responsabilités :



Authentification : Microservice Symfony avec génération de tokens JWT

Gestion des équipements : Microservice .NET avec API REST sécurisée

Interface utilisateur : Application Angular moderne et responsive



\##  Architecture



\- \*\*Frontend\*\* : Angular 18

\- \*\*Backend Auth\*\* : Symfony (PHP)

\- \*\*Backend Devices\*\* : .NET 8 (C#)

\- \*\*Base de données\*\* : MySQL



\##  Installation



\### 1. Backend .NET

```bash

cd SmartHomeDevices

dotnet restore

dotnet run

```



\### 2. Frontend Angular

```bash

cd smart-home-frontend

npm install

ng serve

```



\### 3. Backend Symfony

```bash

cd auth-microservice

composer install

symfony server:start



```

\### Nom de base de donner : smarthome\_db





\##  Accès



\- Frontend : http://localhost:4200

\- API .NET : http://localhost:5001

\- API Symfony : http://localhost:8000







Salma Ouasti 

