# TexteO API

TexteO API est une application web développée avec FastAPI, conçue pour offrir une plateforme robuste et évolutive pour la gestion de contenu textuel.

## Caractéristiques

*   **Framework Moderne**: Construit avec [FastAPI](https://fastapi.tiangolo.com/), garantissant des performances élevées et une validation des données intuitive.
*   **Base de Données**: Utilise SQLAlchemy pour l'ORM et Alembic pour les migrations de base de données, permettant une gestion de schéma flexible.
*   **Authentification**: Implémente l'authentification JWT pour sécuriser les points d'accès de l'API.
*   **Environnement Virtuel**: Géré avec `uv`, assurant des dépendances de projet isolées et reproductibles.

## Technologies Utilisées

*   **Backend**: Python 3.11, FastAPI
*   **Base de Données**: SQLAlchemy (ORM), Alembic (Migrations)
*   **Authentification**: JWT (JSON Web Tokens)
*   **Gestion des Dépendances**: `uv`

## Installation

1.  **Clonez le Dépôt**
    ```bash
    git clone https://github.com/VOTRE_NOM_UTILISATEUR/03-texteo.git
    cd 03-texteo/backend
    ```

2.  **Installez les Dépendances**
    Assurez-vous d'avoir `uv` installé, puis exécutez :
    ```bash
    uv sync
    ```

3.  **Configurez la Base de Données**
    Modifiez le fichier `alembic.ini` pour y inclure l'URL de votre base de données :
    ```ini
    sqlalchemy.url = postgresql://user:password@host/dbname
    ```

## Utilisation

1.  **Démarrez le Serveur**
    Depuis le répertoire `backend`, lancez l'application avec `uvicorn` :
    ```bash
    uvicorn main:app --reload
    ```
    L'API sera accessible à l'adresse `http://127.0.0.1:8000`.

2.  **Documentation de l'API**
    Accédez à la documentation interactive de l'API (générée par Swagger UI) à l'adresse :
    `http://127.0.0.1:8000/docs`

## Migrations de la Base de Données

Pour gérer les migrations de la base de données avec Alembic :

*   **Créer une nouvelle migration** :
    ```bash
    alembic revision --autogenerate -m "Description de la migration"
    ```

*   **Appliquer les migrations** :
    ```bash
    alembic upgrade head
    ```

## Contribuer

Les contributions sont les bienvenues ! Pour toute suggestion ou rapport de bogue, veuillez ouvrir une *issue* sur GitHub.

## Licence

Ce projet est distribué sous la licence MIT. Voir le fichier `LICENSE` pour plus de détails.
