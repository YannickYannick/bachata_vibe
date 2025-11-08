// JavaScript pour le widget de catégories en cascade MPTT
(function($) {
    'use strict';

    // Fonction pour mettre à jour l'affichage de la sélection
    function updateSelectionDisplay(widgetName) {
        const hiddenField = document.getElementById(widgetName);
        const display = document.getElementById(widgetName + '_display');
        
        if (!hiddenField || !display) return;
        
        // Trouver la dernière valeur sélectionnée
        let selectedValue = '';
        let selectedPath = [];
        
        for (let level = 0; level < 5; level++) {
            const select = document.getElementById(`${widgetName}_level_${level}`);
            if (select && select.value) {
                selectedValue = select.value;
                selectedPath.push(select.value);
            }
        }
        
        // Mettre à jour le champ caché
        hiddenField.value = selectedValue;
        
        // Mettre à jour l'affichage
        if (selectedValue) {
            const categoryTree = JSON.parse(document.querySelector(`[data-widget-name="${widgetName}"]`).dataset.categoryTree);
            const pathNames = buildPathNames(categoryTree, selectedPath);
            
            if (pathNames.length > 1) {
                display.innerHTML = `📁 ${pathNames[0]}` + 
                    pathNames.slice(1).map(name => ` → └── ${name}`).join('');
            } else {
                display.innerHTML = `📁 ${pathNames[0]}`;
            }
        } else {
            display.innerHTML = '<em style="color: #6c757d;">Aucune catégorie sélectionnée</em>';
        }
    }

    // Fonction pour construire les noms du chemin
    function buildPathNames(categoryTree, pathIds) {
        const pathNames = [];
        
        function findCategoryName(tree, categoryId) {
            for (const [id, data] of Object.entries(tree)) {
                if (id == categoryId) {
                    return data.name;
                }
                if (data.children) {
                    const found = findCategoryName(data.children, categoryId);
                    if (found) return found;
                }
            }
            return null;
        }
        
        for (const categoryId of pathIds) {
            const name = findCategoryName(categoryTree, categoryId);
            if (name) {
                pathNames.push(name);
            }
        }
        
        return pathNames;
    }

    // Fonction pour mettre à jour les dropdowns en cascade
    function updateCascadingDropdowns(widgetName, selectedLevel) {
        const widget = document.querySelector(`[data-widget-name="${widgetName}"]`);
        const categoryTree = JSON.parse(widget.dataset.categoryTree);
        
        // Masquer tous les dropdowns après le niveau sélectionné
        for (let level = selectedLevel + 1; level < 5; level++) {
            const dropdownLevel = document.querySelector(`[data-widget-name="${widgetName}"] .dropdown-level[data-level="${level}"]`);
            if (dropdownLevel) {
                dropdownLevel.style.display = 'none';
                const select = dropdownLevel.querySelector('.category-dropdown');
                if (select) {
                    select.innerHTML = '<option value="">Sélectionnez...</option>';
                    select.value = '';
                }
            }
        }
        
        // Remplir le dropdown suivant
        if (selectedLevel < 4) {
            const currentSelect = document.getElementById(`${widgetName}_level_${selectedLevel}`);
            if (currentSelect && currentSelect.value) {
                const selectedCategoryId = currentSelect.value;
                const children = findChildrenInTree(categoryTree, selectedCategoryId);
                
                if (children && Object.keys(children).length > 0) {
                    // Afficher le dropdown suivant
                    const nextLevel = selectedLevel + 1;
                    const nextDropdownLevel = document.querySelector(`[data-widget-name="${widgetName}"] .dropdown-level[data-level="${nextLevel}"]`);
                    if (nextDropdownLevel) {
                        nextDropdownLevel.style.display = 'flex';
                        
                        // Remplir les options
                        const nextSelect = nextDropdownLevel.querySelector('.category-dropdown');
                        if (nextSelect) {
                            nextSelect.innerHTML = '<option value="">Sélectionnez...</option>';
                            
                            for (const [childId, childData] of Object.entries(children)) {
                                const option = document.createElement('option');
                                option.value = childId;
                                option.textContent = childData.name;
                                nextSelect.appendChild(option);
                            }
                        }
                    }
                }
            }
        }
    }

    // Fonction pour trouver les enfants dans l'arbre
    function findChildrenInTree(tree, parentId) {
        function searchTree(currentTree) {
            for (const [id, data] of Object.entries(currentTree)) {
                if (id == parentId) {
                    return data.children || {};
                }
                if (data.children) {
                    const found = searchTree(data.children);
                    if (found && Object.keys(found).length > 0) {
                        return found;
                    }
                }
            }
            return {};
        }
        
        return searchTree(tree);
    }

    // Fonction pour initialiser un widget
    function initCascadingWidget(widgetName) {
        const widget = document.querySelector(`[data-widget-name="${widgetName}"]`);
        if (!widget) return;
        
        // Ajouter les événements à tous les dropdowns
        for (let level = 0; level < 5; level++) {
            const select = document.getElementById(`${widgetName}_level_${level}`);
            if (select) {
                select.addEventListener('change', function() {
                    // Ajouter un effet de chargement
                    const dropdownLevel = this.closest('.dropdown-level');
                    dropdownLevel.classList.add('updating');
                    
                    setTimeout(() => {
                        updateCascadingDropdowns(widgetName, level);
                        updateSelectionDisplay(widgetName);
                        dropdownLevel.classList.remove('updating');
                    }, 200);
                });
                
                // Effet de focus
                select.addEventListener('focus', function() {
                    this.parentElement.classList.add('active');
                });
                
                select.addEventListener('blur', function() {
                    this.parentElement.classList.remove('active');
                });
            }
        }
        
        // Initialiser l'affichage
        updateSelectionDisplay(widgetName);
    }

    // Fonction pour initialiser tous les widgets
    function initAllCascadingWidgets() {
        const widgets = document.querySelectorAll('.cascading-category-widget');
        widgets.forEach(function(widget) {
            const widgetName = widget.dataset.widgetName;
            if (widgetName) {
                initCascadingWidget(widgetName);
            }
        });
    }

    // Fonction pour améliorer l'expérience utilisateur
    function enhanceUserExperience() {
        // Ajouter des styles dynamiques
        const style = document.createElement('style');
        style.textContent = `
            .cascading-category-widget .dropdown-level.active {
                transform: scale(1.02);
                transition: transform 0.2s ease;
            }
            
            .cascading-category-widget .category-dropdown option:hover {
                background-color: #e3f2fd;
            }
            
            .cascading-category-widget .selection-display.loading {
                opacity: 0.7;
            }
            
            .cascading-category-widget .dropdown-level.updating {
                opacity: 0.6;
                transform: scale(0.98);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialiser au chargement de la page
    $(document).ready(function() {
        initAllCascadingWidgets();
        enhanceUserExperience();
    });

    // Réinitialiser après les changements AJAX (pour l'admin Django)
    $(document).on('formset:added', function() {
        initAllCascadingWidgets();
    });

    // Exposer les fonctions globalement pour compatibilité
    window.updateCascadingDropdowns = updateCascadingDropdowns;
    window.updateSelectionDisplay = updateSelectionDisplay;

})(django.jQuery || jQuery);



