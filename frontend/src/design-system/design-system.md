# Design System - CompChat

## Vue d'ensemble
Design system moderne et professionnel pour une application de chat d'entreprise, inspiré des standards actuels (Slack, Teams, Discord) tout en restant sobre et adapté au contexte professionnel.

## Palette de couleurs

### Couleurs principales
- **Primary Blue**: `#2563eb` - Couleur principale, actions importantes
- **Primary Blue Dark**: `#1e40af` - États hover/active
- **Primary Blue Light**: `#3b82f6` - États focus
- **Secondary Gray**: `#64748b` - Texte secondaire, bordures
- **Background**: `#ffffff` - Fond principal
- **Background Secondary**: `#f8fafc` - Fond alternatif
- **Background Tertiary**: `#f1f5f9` - Fond de sidebar

### Couleurs sémantiques
- **Success**: `#10b981` - Confirmations, succès
- **Warning**: `#f59e0b` - Avertissements
- **Error**: `#ef4444` - Erreurs, suppressions
- **Info**: `#3b82f6` - Informations

### Couleurs de chat
- **Message Sent**: `#2563eb` - Messages envoyés
- **Message Received**: `#f1f5f9` - Messages reçus
- **Message Text**: `#1e293b` - Texte des messages
- **Message Timestamp**: `#94a3b8` - Horodatage

### États
- **Hover**: Opacité 0.9 ou légère variation de couleur
- **Active**: Couleur plus foncée
- **Disabled**: `#cbd5e1` avec opacité 0.5
- **Focus**: Bordure `#2563eb` avec shadow

## Typographie

### Familles de polices
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Monospace**: `'JetBrains Mono', 'Courier New', monospace` (pour le code)

### Hiérarchie typographique
- **H1**: `32px / 40px` - Titres principaux
- **H2**: `24px / 32px` - Titres de section
- **H3**: `20px / 28px` - Sous-titres
- **H4**: `18px / 24px` - Titres de composants
- **Body Large**: `16px / 24px` - Texte principal
- **Body**: `14px / 20px` - Texte standard
- **Body Small**: `12px / 16px` - Texte secondaire, labels
- **Caption**: `11px / 14px` - Légendes, timestamps

### Poids de police
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Espacements

### Système de spacing (basé sur 4px)
- **xs**: `4px`
- **sm**: `8px`
- **md**: `16px`
- **lg**: `24px`
- **xl**: `32px`
- **2xl**: `48px`
- **3xl**: `64px`

## Ombres

- **sm**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **md**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- **lg**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- **xl**: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`

## Bordures

- **Radius sm**: `4px`
- **Radius md**: `8px`
- **Radius lg**: `12px`
- **Radius xl**: `16px`
- **Radius full**: `9999px` (pour les avatars, badges)

## Composants

### Boutons
- **Primary**: Fond bleu, texte blanc
- **Secondary**: Fond transparent, bordure bleue
- **Ghost**: Pas de fond, texte bleu
- **Danger**: Fond rouge pour actions destructives

### Inputs
- Bordure subtile, focus avec bordure bleue
- Placeholder en gris clair
- États: default, focus, error, disabled

### Cards
- Fond blanc, ombre légère
- Padding: 16px-24px
- Border radius: 12px

### Messages de chat
- Bulles arrondies
- Espacement entre messages: 8px
- Timestamp discret en bas
- Avatar à côté du message (pour les messages reçus)

## Layout

### Breakpoints
- **Mobile**: `640px`
- **Tablet**: `768px`
- **Desktop**: `1024px`
- **Large Desktop**: `1280px`

### Grille
- Sidebar: `280px` (collapsible)
- Main content: `flex: 1`
- Header: `64px` de hauteur

## Animations

- **Transition standard**: `150ms ease-in-out`
- **Transition lente**: `300ms ease-in-out`
- **Hover scale**: `scale(1.02)`
- **Fade in**: `opacity 0.2s ease-in`

## Accessibilité

- Contraste minimum: 4.5:1 pour le texte
- Focus visible sur tous les éléments interactifs
- Support clavier complet
- Labels ARIA appropriés
