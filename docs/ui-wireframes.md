# 🎨 Wireframes et flux utilisateur - BachataVibe

## 📱 Structure de navigation

```mermaid
graph TD
    A[Page d'accueil] --> B[Compétitions]
    A --> C[Événements]
    A --> D[Cours]
    A --> E[Formations]
    A --> F[Artistes]
    A --> G[Connexion]
    
    B --> B1[Liste des compétitions]
    B1 --> B2[Détail compétition]
    B2 --> B3[Inscription]
    
    C --> C1[Liste des événements]
    C1 --> C2[Détail événement]
    C2 --> C3[Inscription]
    
    D --> D1[Liste des cours]
    D1 --> D2[Détail cours]
    D2 --> D3[Inscription]
    
    G --> G1[Connexion]
    G --> G2[Inscription]
    G1 --> G3[Profil utilisateur]
    G2 --> G3
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
```

## 🏠 Page d'accueil - Layout

```mermaid
graph TB
    subgraph "Header"
        A[Logo BachataVibe] --> B[Navigation Menu]
        B --> C[Connexion/Profil]
    end
    
    subgraph "Hero Section"
        D[Image principale] --> E[Titre accrocheur]
        E --> F[Call-to-action]
    end
    
    subgraph "Stats Section"
        G[Compétitions] --> H[Événements]
        H --> I[Cours]
        I --> J[Participants]
    end
    
    subgraph "Featured Content"
        K[Cours en vedette] --> L[Événements à venir]
        L --> M[Compétitions populaires]
    end
    
    subgraph "Footer"
        N[Liens utiles] --> O[Contact]
        O --> P[Réseaux sociaux]
    end
    
    A --> D
    D --> G
    G --> K
    K --> N
    
    style A fill:#e1f5fe
    style D fill:#f3e5f5
    style G fill:#e8f5e8
    style K fill:#fff3e0
```

## 🏆 Page Compétitions - Layout

```mermaid
graph TB
    subgraph "Filtres"
        A[Catégorie] --> B[Statut]
        B --> C[Localisation]
        C --> D[Date]
    end
    
    subgraph "Liste des compétitions"
        E[Carte compétition 1] --> F[Carte compétition 2]
        F --> G[Carte compétition 3]
        G --> H[Pagination]
    end
    
    subgraph "Carte compétition"
        I[Image] --> J[Titre]
        J --> K[Description]
        K --> L[Informations]
        L --> M[Bouton inscription]
    end
    
    subgraph "Informations"
        N[📍 Lieu] --> O[📅 Date]
        O --> P[💰 Prix]
        P --> Q[👥 Participants]
    end
    
    A --> E
    E --> I
    I --> N
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style N fill:#fff3e0
```

## 📅 Page Événements - Layout

```mermaid
graph TB
    subgraph "Header"
        A[Titre page] --> B[Description]
        B --> C[Filtres rapides]
    end
    
    subgraph "Filtres avancés"
        D[Recherche] --> E[Type d'événement]
        E --> F[Date de début]
        F --> G[Date de fin]
        G --> H[Localisation]
    end
    
    subgraph "Grille événements"
        I[Événement 1] --> J[Événement 2]
        J --> K[Événement 3]
        K --> L[Événement 4]
    end
    
    subgraph "Carte événement"
        M[Image] --> N[Titre]
        N --> O[Date/Heure]
        O --> P[Lieu]
        P --> Q[Prix]
        Q --> R[Bouton détails]
    end
    
    A --> D
    D --> I
    I --> M
    
    style A fill:#e1f5fe
    style D fill:#f3e5f5
    style I fill:#e8f5e8
    style M fill:#fff3e0
```

## 👤 Page de profil utilisateur

```mermaid
graph TB
    subgraph "Header profil"
        A[Photo de profil] --> B[Nom utilisateur]
        B --> C[Statut membre]
        C --> D[Bouton modifier]
    end
    
    subgraph "Onglets"
        E[Mes inscriptions] --> F[Mes créations]
        F --> G[Paramètres]
        G --> H[Notifications]
    end
    
    subgraph "Mes inscriptions"
        I[Compétitions] --> J[Événements]
        J --> K[Cours]
        K --> L[Formations]
    end
    
    subgraph "Mes créations"
        M[Compétitions créées] --> N[Événements créés]
        N --> O[Cours créés]
        O --> P[Statistiques]
    end
    
    A --> E
    E --> I
    I --> M
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
    style M fill:#fff3e0
```

## 🔐 Pages d'authentification

```mermaid
graph TB
    subgraph "Connexion"
        A[Email] --> B[Mot de passe]
        B --> C[Se souvenir]
        C --> D[Bouton connexion]
        D --> E[Lien mot de passe oublié]
    end
    
    subgraph "Inscription"
        F[Nom] --> G[Prénom]
        G --> H[Email]
        H --> I[Mot de passe]
        I --> J[Confirmation]
        J --> K[Bouton inscription]
    end
    
    subgraph "Mot de passe oublié"
        L[Email] --> M[Bouton envoyer]
        M --> N[Message confirmation]
    end
    
    subgraph "Réinitialisation"
        O[Nouveau mot de passe] --> P[Confirmation]
        P --> Q[Bouton valider]
    end
    
    A --> F
    F --> L
    L --> O
    
    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style L fill:#e8f5e8
    style O fill:#fff3e0
```

## 📱 Responsive Design - Breakpoints

```mermaid
graph LR
    subgraph "Mobile < 768px"
        A[Menu hamburger] --> B[Colonne unique]
        B --> C[Cartes empilées]
        C --> D[Navigation bottom]
    end
    
    subgraph "Tablet 768-1024px"
        E[Menu horizontal] --> F[Deux colonnes]
        F --> G[Grille 2x2]
        G --> H[Navigation top]
    end
    
    subgraph "Desktop > 1024px"
        I[Menu complet] --> J[Trois colonnes]
        J --> K[Grille 3x3]
        K --> L[Sidebar navigation]
    end
    
    A --> E
    E --> I
    
    style A fill:#ffebee
    style E fill:#fff3e0
    style I fill:#e8f5e8
```

## 🎨 Système de couleurs

```mermaid
graph TB
    subgraph "Couleurs principales"
        A[Orange #F97316] --> B[Rouge #DC2626]
        B --> C[Blanc #FFFFFF]
        C --> D[Gris #6B7280]
    end
    
    subgraph "Couleurs secondaires"
        E[Vert #10B981] --> F[Bleu #3B82F6]
        F --> G[Violet #8B5CF6]
        G --> H[Jaune #F59E0B]
    end
    
    subgraph "Couleurs d'état"
        I[Succès #10B981] --> J[Erreur #EF4444]
        J --> K[Avertissement #F59E0B]
        K --> L[Info #3B82F6]
    end
    
    style A fill:#F97316,color:#fff
    style B fill:#DC2626,color:#fff
    style E fill:#10B981,color:#fff
    style I fill:#10B981,color:#fff
```

## 🔄 Flux d'inscription à une compétition

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant P as Page Compétition
    participant A as Auth
    participant S as Service API
    participant D as Django
    
    U->>P: Clique "S'inscrire"
    P->>A: Vérifier connexion
    A-->>P: Utilisateur connecté
    P->>S: enrollInCompetition()
    S->>D: POST /api/competitions/{id}/enroll/
    D-->>S: Confirmation
    S-->>P: Succès
    P-->>U: Message de confirmation
    P->>P: Mettre à jour l'interface
```

## 📊 Dashboard administrateur

```mermaid
graph TB
    subgraph "Sidebar"
        A[Tableau de bord] --> B[Compétitions]
        B --> C[Événements]
        C --> D[Cours]
        D --> E[Utilisateurs]
        E --> F[Statistiques]
    end
    
    subgraph "Contenu principal"
        G[Métriques clés] --> H[Graphiques]
        H --> I[Liste récente]
        I --> J[Actions rapides]
    end
    
    subgraph "Métriques"
        K[Utilisateurs actifs] --> L[Inscriptions]
        L --> M[Revenus]
        M --> N[Engagement]
    end
    
    A --> G
    G --> K
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style K fill:#e8f5e8
```

## 🎯 Call-to-Actions principaux

```mermaid
graph LR
    subgraph "Page d'accueil"
        A[Rejoindre la communauté] --> B[Voir les compétitions]
        B --> C[Découvrir les cours]
    end
    
    subgraph "Compétitions"
        D[S'inscrire] --> E[Voir détails]
        E --> F[Partager]
    end
    
    subgraph "Événements"
        G[Participer] --> H[Ajouter au calendrier]
        H --> I[Inviter des amis]
    end
    
    subgraph "Cours"
        J[S'inscrire au cours] --> K[Contacter l'instructeur]
        K --> L[Évaluer]
    end
    
    style A fill:#F97316,color:#fff
    style D fill:#DC2626,color:#fff
    style G fill:#10B981,color:#fff
    style J fill:#3B82F6,color:#fff
```

Ces wireframes et flux utilisateur vous donnent une vision complète de l'expérience utilisateur de votre application BachataVibe ! 🎨✨











