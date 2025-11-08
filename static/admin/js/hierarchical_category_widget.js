// JavaScript pour le widget de catégories hiérarchiques MPTT
(function($) {
    'use strict';

    // Fonction pour mettre à jour l'affichage de la sélection
    function updateSelectionDisplay(widgetName) {
        const select = document.getElementById(widgetName + '_select');
        const hiddenField = document.getElementById(widgetName);
        const display = document.getElementById(widgetName + '_display');
        
        if (!select || !hiddenField || !display) {
            return;
        }
        
        // Mettre à jour le champ caché
        hiddenField.value = select.value;
        
        // Mettre à jour l'affichage
        if (select.value) {
            const selectedOption = select.options[select.selectedIndex];
            const optionText = selectedOption.text.trim();
            
            // Analyser le texte de l'option pour extraire la hiérarchie
            if (optionText.startsWith('📁')) {
                // Catégorie racine
                display.innerHTML = '<strong>' + optionText + '</strong>';
            } else if (optionText.includes('└──')) {
                // Sous-catégorie - extraire le chemin
                const parts = optionText.split('└──');
                if (parts.length >= 2) {
                    const parent = parts[0].trim().replace('📁', '').trim();
                    const child = parts[parts.length - 1].trim();
                    display.innerHTML = '<strong>📁 ' + parent + '</strong> → <em>' + child + '</em>';
                } else {
                    display.innerHTML = '<em>' + optionText + '</em>';
                }
            } else {
                display.innerHTML = '<em>' + optionText + '</em>';
            }
        } else {
            display.innerHTML = '<em style="color: #6c757d;">Aucune catégorie sélectionnée</em>';
        }
    }

    // Fonction pour ajouter des effets visuels
    function addVisualEffects(widgetName) {
        const select = document.getElementById(widgetName + '_select');
        const display = document.getElementById(widgetName + '_display');
        
        if (!select || !display) return;
        
        // Effet de focus
        select.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        select.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Effet de changement
        select.addEventListener('change', function() {
            display.classList.add('loading');
            
            setTimeout(() => {
                updateSelectionDisplay(widgetName);
                display.classList.remove('loading');
            }, 200);
        });
        
        // Effet de survol
        select.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        select.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }

    // Fonction d'initialisation
    function initHierarchicalWidgets() {
        const widgets = document.querySelectorAll('.hierarchical-category-widget');
        
        widgets.forEach(function(widget) {
            const widgetName = widget.dataset.widgetName;
            if (!widgetName) return;
            
            const select = document.getElementById(widgetName + '_select');
            
            if (select) {
                // Ajouter les événements
                select.addEventListener('change', function() {
                    updateSelectionDisplay(widgetName);
                });
                
                // Ajouter les effets visuels
                addVisualEffects(widgetName);
                
                // Initialiser l'affichage
                updateSelectionDisplay(widgetName);
            }
        });
    }

    // Fonction pour améliorer l'expérience utilisateur
    function enhanceUserExperience() {
        // Ajouter des styles dynamiques
        const style = document.createElement('style');
        style.textContent = `
            .hierarchical-category-widget .category-selector.focused {
                transform: scale(1.02);
                transition: transform 0.2s ease;
            }
            
            .hierarchical-category-widget .hierarchical-select option:hover {
                background-color: #e3f2fd;
            }
            
            .hierarchical-category-widget .selection-display.loading {
                opacity: 0.7;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialiser au chargement de la page
    $(document).ready(function() {
        initHierarchicalWidgets();
        enhanceUserExperience();
    });

    // Réinitialiser après les changements AJAX (pour l'admin Django)
    $(document).on('formset:added', function() {
        initHierarchicalWidgets();
    });

    // Exposer les fonctions globalement pour compatibilité
    window.updateSelectionDisplay = updateSelectionDisplay;

})(django.jQuery || jQuery);
