# 📊 Diagrammes d'architecture - BachataVibe

## 🏗️ Architecture générale

```mermaid
graph TB
    subgraph "Frontend React"
        A[React App] --> B[Components]
        B --> C[Services/API]
        C --> D[Config/API]
    end
    
    subgraph "Backend Django"
        E[Django App] --> F[Models]
        F --> G[Views/API]
        G --> H[URLs]
    end
    
    subgraph "Base de données"
        I[(SQLite/PostgreSQL)]
    end
    
    subgraph "Serveur web"
        J[Nginx/Apache]
        K[Phusion Passenger]
    end
    
    subgraph "Fichiers statiques"
        L[CSS/JS Build]
        M[Images/Media]
    end
    
    A --> E
    C --> G
    E --> I
    J --> K
    K --> E
    J --> L
    J --> M
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style J fill:#fff3e0
```

## 🔄 Flux de données API

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend React
    participant C as Config API
    participant S as Service API
    participant D as Django Backend
    participant DB as Base de données
    
    U->>F: Accède à la page
    F->>C: getApiUrl()
    C->>C: Détecte environnement
    C-->>F: URL API (local/prod)
    F->>S: ApiService.getCompetitions()
    S->>D: GET /api/competitions/
    D->>DB: Query competitions
    DB-->>D: Data
    D-->>S: JSON Response
    S-->>F: Processed Data
    F-->>U: Affichage
```

## 🌐 Configuration des environnements

```mermaid
graph LR
    subgraph "Développement Local"
        A1[localhost:3000] --> B1[localhost:8000/api]
        B1 --> C1[SQLite]
    end
    
    subgraph "Production"
        A2[bachatavibe.com] --> B2[bachatavibe.com/api]
        B2 --> C2[PostgreSQL]
    end
    
    subgraph "Configuration"
        D[settings_test.py]
        D --> E[USE_PRODUCTION_API]
        E --> F[True = Production]
        E --> G[False = Local]
    end
    
    F --> A2
    G --> A1
    
    style A1 fill:#e8f5e8
    style A2 fill:#ffebee
    style D fill:#e3f2fd
```

## 🔧 Flux de build et déploiement

```mermaid
graph TD
    A[Code Source] --> B[npm run build]
    B --> C[frontend/build/]
    C --> D[python manage.py collectstatic]
    D --> E[staticfiles/]
    E --> F[git push]
    F --> G[GitHub]
    G --> H[git pull sur serveur]
    H --> I[collectstatic sur serveur]
    I --> J[./manage_bachata.sh restart]
    J --> K[Application en ligne]
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style E fill:#e8f5e8
    style K fill:#fff3e0
```

## 📱 Structure des composants React

```mermaid
graph TD
    A[App.js] --> B[Router]
    B --> C[HomePage]
    B --> D[CompetitionsPage]
    B --> E[EventsPage]
    B --> F[CoursesPage]
    B --> G[AuthContext]
    
    D --> H[ApiService]
    E --> H
    F --> H
    G --> H
    
    H --> I[config/api.js]
    I --> J[getApiUrl()]
    J --> K[Mode Local]
    J --> L[Mode Production]
    
    style A fill:#e1f5fe
    style H fill:#f3e5f5
    style I fill:#e8f5e8
```

## 🗄️ Structure de la base de données

```mermaid
erDiagram
    COMPETITIONS {
        int id PK
        string title
        text description
        string location
        string city
        date start_date
        string category
        string status
        decimal prize_pool
        string currency
        int max_participants
        string main_image
    }
    
    EVENTS {
        int id PK
        string title
        text description
        string location
        date start_date
        date end_date
        string status
        boolean featured
        string main_image
    }
    
    COURSES {
        int id PK
        string title
        text description
        string instructor
        string level
        decimal price
        string currency
        boolean featured
        string main_image
    }
    
    USERS {
        int id PK
        string username
        string email
        string first_name
        string last_name
        date date_joined
    }
    
    ENROLLMENTS {
        int id PK
        int user_id FK
        int event_id FK
        int course_id FK
        int competition_id FK
        date enrolled_at
        string status
    }
    
    USERS ||--o{ ENROLLMENTS : "s'inscrit"
    EVENTS ||--o{ ENROLLMENTS : "contient"
    COURSES ||--o{ ENROLLMENTS : "contient"
    COMPETITIONS ||--o{ ENROLLMENTS : "contient"
```

## 🔐 Flux d'authentification

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant A as AuthContext
    participant S as Service API
    participant D as Django Backend
    
    U->>F: Clic "Se connecter"
    F->>A: login(username, password)
    A->>S: ApiService.login()
    S->>D: POST /api/auth/login/
    D-->>S: Token + User data
    S-->>A: Auth response
    A->>A: Store token in localStorage
    A-->>F: User logged in
    F-->>U: Interface utilisateur
```

## 📊 Métriques et monitoring

```mermaid
graph TB
    subgraph "Application"
        A[Frontend] --> B[API Calls]
        B --> C[Backend]
        C --> D[Database]
    end
    
    subgraph "Monitoring"
        E[Logs] --> F[Error Tracking]
        G[Performance] --> H[Metrics]
        I[User Analytics] --> J[Usage Stats]
    end
    
    A --> E
    B --> G
    C --> I
    D --> E
    
    style E fill:#ffebee
    style G fill:#e8f5e8
    style I fill:#e3f2fd
```

## 🚀 Pipeline de déploiement

```mermaid
graph LR
    A[Code Changes] --> B[Local Testing]
    B --> C[npm run build]
    C --> D[collectstatic]
    D --> E[git commit]
    E --> F[git push]
    F --> G[GitHub]
    G --> H[Server Pull]
    H --> I[Server collectstatic]
    I --> J[Restart App]
    J --> K[Health Check]
    K --> L[Deployment Complete]
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style G fill:#e8f5e8
    style L fill:#fff3e0
```

## 🔧 Configuration des environnements

```mermaid
graph TD
    subgraph "Local Development"
        A1[settings_test.py] --> B1[USE_PRODUCTION_API = False]
        B1 --> C1[API_BASE_URL = localhost:8000]
        C1 --> D1[SQLite Database]
    end
    
    subgraph "Production"
        A2[settings_test.py] --> B2[USE_PRODUCTION_API = True]
        B2 --> C2[API_BASE_URL = bachatavibe.com]
        C2 --> D2[PostgreSQL Database]
    end
    
    subgraph "Frontend Detection"
        E[window.location.hostname] --> F[bachatavibe.com?]
        F -->|Yes| G[Production Mode]
        F -->|No| H[Local Mode]
    end
    
    style A1 fill:#e8f5e8
    style A2 fill:#ffebee
    style E fill:#e3f2fd
```

Ces diagrammes vous donnent une vue d'ensemble complète de votre architecture BachataVibe ! 🎯









