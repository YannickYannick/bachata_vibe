# 🚀 Infrastructure et déploiement - BachataVibe

## 🏗️ Architecture de déploiement

```mermaid
graph TB
    subgraph "Développement Local"
        A[VS Code] --> B[Git]
        B --> C[Local Django Server]
        C --> D[SQLite Database]
        E[React Dev Server] --> F[Hot Reload]
    end
    
    subgraph "Version Control"
        G[GitHub Repository] --> H[Main Branch]
        H --> I[Feature Branches]
        I --> J[Pull Requests]
    end
    
    subgraph "Production Server"
        K[HostHarmada] --> L[Apache/Nginx]
        L --> M[Phusion Passenger]
        M --> N[Django Application]
        N --> O[PostgreSQL]
        P[Static Files] --> L
        Q[SSL Certificate] --> L
    end
    
    subgraph "CDN & Performance"
        R[CloudFlare] --> S[Global CDN]
        S --> T[Image Optimization]
        T --> U[Gzip Compression]
    end
    
    A --> G
    G --> K
    L --> R
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style K fill:#fff3e0
    style R fill:#e8f5e8
```

## 🔄 Pipeline de déploiement

```mermaid
graph LR
    A[Code Changes] --> B[Local Testing]
    B --> C[Git Commit]
    C --> D[Git Push]
    D --> E[GitHub Webhook]
    E --> F[Server Pull]
    F --> G[Build Frontend]
    G --> H[Collect Static]
    H --> I[Database Migration]
    I --> J[Restart App]
    J --> K[Health Check]
    K --> L[Deployment Complete]
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style K fill:#e8f5e8
    style L fill:#fff3e0
```

## 🌐 Configuration réseau

```mermaid
graph TB
    subgraph "Internet"
        A[Utilisateurs] --> B[DNS bachatavibe.com]
        B --> C[CloudFlare CDN]
    end
    
    subgraph "HostHarmada Server"
        D[Load Balancer] --> E[Apache/Nginx]
        E --> F[SSL Termination]
        F --> G[Static Files]
        F --> H[Phusion Passenger]
        H --> I[Django App]
        I --> J[PostgreSQL]
    end
    
    subgraph "Monitoring"
        K[Uptime Monitoring] --> L[Performance Metrics]
        L --> M[Error Tracking]
        M --> N[Log Analysis]
    end
    
    C --> D
    I --> K
    
    style A fill:#e1f5fe
    style D fill:#f3e5f5
    style K fill:#e8f5e8
```

## 📊 Monitoring et observabilité

```mermaid
graph TB
    subgraph "Application Metrics"
        A[Response Time] --> B[Throughput]
        B --> C[Error Rate]
        C --> D[User Sessions]
    end
    
    subgraph "Infrastructure Metrics"
        E[CPU Usage] --> F[Memory Usage]
        F --> G[Disk Usage]
        G --> H[Network I/O]
    end
    
    subgraph "Business Metrics"
        I[User Registrations] --> J[Competition Signups]
        J --> K[Event Attendance]
        K --> L[Revenue]
    end
    
    subgraph "Alerting"
        M[Threshold Alerts] --> N[Email Notifications]
        N --> O[Slack Integration]
        O --> P[PagerDuty]
    end
    
    A --> M
    E --> M
    I --> M
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style M fill:#ffebee
```

## 🔐 Sécurité et authentification

```mermaid
graph TB
    subgraph "Frontend Security"
        A[HTTPS Only] --> B[CSRF Protection]
        B --> C[XSS Prevention]
        C --> D[Content Security Policy]
    end
    
    subgraph "Backend Security"
        E[Token Authentication] --> F[Password Hashing]
        F --> G[SQL Injection Prevention]
        G --> H[Input Validation]
    end
    
    subgraph "Infrastructure Security"
        I[Firewall Rules] --> J[SSL/TLS Encryption]
        J --> K[Regular Updates]
        K --> L[Backup Strategy]
    end
    
    subgraph "Data Protection"
        M[GDPR Compliance] --> N[Data Encryption]
        N --> O[Access Control]
        O --> P[Audit Logging]
    end
    
    A --> E
    E --> I
    I --> M
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style M fill:#fff3e0
```

## 📈 Scalabilité et performance

```mermaid
graph TB
    subgraph "Current Architecture"
        A[Single Server] --> B[PostgreSQL]
        B --> C[Static Files]
        C --> D[CDN]
    end
    
    subgraph "Scaling Strategy"
        E[Load Balancer] --> F[Multiple App Servers]
        F --> G[Database Replication]
        G --> H[Redis Cache]
    end
    
    subgraph "Future Architecture"
        I[Microservices] --> J[API Gateway]
        J --> K[Database Sharding]
        K --> L[Message Queue]
    end
    
    subgraph "Performance Optimization"
        M[Code Splitting] --> N[Lazy Loading]
        N --> O[Image Optimization]
        O --> P[Database Indexing]
    end
    
    A --> E
    E --> I
    I --> M
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style M fill:#fff3e0
```

## 🗄️ Gestion des données

```mermaid
graph TB
    subgraph "Data Sources"
        A[User Input] --> B[API Calls]
        B --> C[File Uploads]
        C --> D[External APIs]
    end
    
    subgraph "Data Processing"
        E[Validation] --> F[Sanitization]
        F --> G[Transformation]
        G --> H[Storage]
    end
    
    subgraph "Data Storage"
        I[PostgreSQL] --> J[File System]
        J --> K[CDN Cache]
        K --> L[Backup Storage]
    end
    
    subgraph "Data Access"
        M[API Endpoints] --> N[Database Queries]
        N --> O[Cache Layer]
        O --> P[Search Index]
    end
    
    A --> E
    E --> I
    I --> M
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style M fill:#fff3e0
```

## 🔄 Backup et récupération

```mermaid
graph TB
    subgraph "Backup Strategy"
        A[Daily Database Backup] --> B[Weekly Full Backup]
        B --> C[Monthly Archive]
        C --> D[Offsite Storage]
    end
    
    subgraph "Recovery Process"
        E[Identify Failure] --> F[Assess Damage]
        F --> G[Restore Database]
        G --> H[Restore Files]
        H --> I[Verify Integrity]
    end
    
    subgraph "Disaster Recovery"
        J[RTO: 4 hours] --> K[RPO: 1 hour]
        K --> L[Failover Process]
        L --> M[Communication Plan]
    end
    
    subgraph "Testing"
        N[Monthly DR Tests] --> O[Backup Verification]
        O --> P[Recovery Drills]
        P --> Q[Documentation Updates]
    end
    
    A --> E
    E --> J
    J --> N
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style J fill:#e8f5e8
    style N fill:#fff3e0
```

## 📊 Métriques de déploiement

```mermaid
gantt
    title Timeline de déploiement
    dateFormat X
    axisFormat %H:%M
    
    section Phase 1
    Code Review        :0, 30
    Testing           :30, 60
    Build             :60, 90
    
    section Phase 2
    Deploy to Staging :90, 120
    Integration Tests :120, 150
    User Acceptance   :150, 180
    
    section Phase 3
    Deploy to Prod    :180, 210
    Health Checks     :210, 240
    Monitoring        :240, 300
```

## 🎯 Objectifs de performance

```mermaid
graph LR
    subgraph "Temps de réponse"
        A[Page Load] --> B[< 2s]
        C[API Response] --> D[< 200ms]
        E[Database Query] --> F[< 100ms]
    end
    
    subgraph "Disponibilité"
        G[Uptime] --> H[99.9%]
        I[Error Rate] --> J[< 0.1%]
        K[Recovery Time] --> L[< 5min]
    end
    
    subgraph "Scalabilité"
        M[Concurrent Users] --> N[1000+]
        O[Data Volume] --> P[1TB+]
        Q[Request Rate] --> R[10k/min]
    end
    
    style B fill:#e8f5e8
    style D fill:#e8f5e8
    style F fill:#e8f5e8
    style H fill:#e8f5e8
    style J fill:#e8f5e8
    style L fill:#e8f5e8
```

## 🔧 Configuration des environnements

```mermaid
graph TB
    subgraph "Development"
        A[Local Django] --> B[SQLite]
        C[React Dev Server] --> D[Hot Reload]
        E[Debug Mode] --> F[Verbose Logging]
    end
    
    subgraph "Staging"
        G[Production-like] --> H[PostgreSQL]
        I[Build Files] --> J[Static Serving]
        K[Testing Data] --> L[Mock Services]
    end
    
    subgraph "Production"
        M[Optimized Django] --> N[PostgreSQL]
        O[Minified Build] --> P[CDN]
        Q[Monitoring] --> R[Alerting]
    end
    
    A --> G
    G --> M
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style M fill:#fff3e0
```

Ces graphiques vous donnent une vision complète de l'infrastructure et du déploiement de votre application BachataVibe ! 🚀✨

## ⚙️ Mode développement du frontend

Pour connecter un serveur React en développement (hot reload) au backend Django:

- Activez le mode via les settings Django:

```12:22:bachata_site/settings.py
# Frontend dev mode configuration
FRONTEND_DEV_MODE = config('FRONTEND_DEV_MODE', default=False, cast=bool)
FRONTEND_DEV_URL = config('FRONTEND_DEV_URL', default='http://localhost:3000')
```

- En développement, ces valeurs sont déjà définies:

```10:18:bachata_site/settings_dev.py
# Frontend dev server configuration
FRONTEND_DEV_MODE = True
FRONTEND_DEV_URL = 'http://localhost:3000'
```

- En production, le mode est désactivé:

```12:14:bachata_site/settings_production.py
FRONTEND_DEV_MODE = False
```

Impact:
- CORS autorise automatiquement `FRONTEND_DEV_URL` quand `FRONTEND_DEV_MODE` est actif.
- Lancez le frontend: `npm start` dans `frontend/` (React Dev Server)
- Backend: `python manage.py runserver 0.0.0.0:8000`

Optionnel: définissez via variables d'environnement (.env) côté Django:

```env
FRONTEND_DEV_MODE=True
FRONTEND_DEV_URL=http://localhost:3000
```

Alternative via `settings_test.py` (utilisé dans votre projet):

```140:169:bachata_site/settings_test.py
# Basculer entre API prod et locale
USE_PRODUCTION_API = False

# Flags explicites pour le front en dev
FRONTEND_DEV_MODE = not USE_PRODUCTION_API
FRONTEND_DEV_URL = 'http://localhost:3000'

# URLs selon le mode et CORS mis à jour
if USE_PRODUCTION_API:
    API_BASE_URL = 'https://bachatavibe.com/api'
    FRONTEND_BASE_URL = 'https://bachatavibe.com'
else:
    API_BASE_URL = 'http://localhost:8000/api'
    FRONTEND_BASE_URL = 'http://localhost:3000'

CORS_ALLOWED_ORIGINS = [FRONTEND_BASE_URL, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:8000', 'http://127.0.0.1:8000']
if FRONTEND_DEV_MODE and FRONTEND_DEV_URL not in CORS_ALLOWED_ORIGINS:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_DEV_URL)
```







