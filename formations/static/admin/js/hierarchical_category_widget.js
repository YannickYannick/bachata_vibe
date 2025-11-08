/**
 * JavaScript pour le widget de sélection hiérarchique multiniveau
 * Version compatible Django Admin - Solution 2
 */

(function($) {
    'use strict';

    // Fonction d'initialisation du widget
    function initHierarchicalWidget() {
        $('.hierarchical-category-widget').each(function() {
            const $widget = $(this);
            const widgetName = $widget.data('widget-name');
            let categoryTree = $widget.data('category-tree');
            
            // Vérifier si categoryTree est déjà un objet ou une chaîne JSON
            if (typeof categoryTree === 'string') {
                try {
                    categoryTree = JSON.parse(categoryTree);
                } catch (e) {
                    console.error('Erreur parsing JSON:', e);
                    categoryTree = {};
                }
            } else if (typeof categoryTree !== 'object' || categoryTree === null) {
                categoryTree = {};
            }
            
            // Construire le menu
            buildMenu($widget, categoryTree);
            
            // Bind events avec la solution robuste
            bindEventsRobust($widget);

            // Appliquer la sélection initiale si présente
            applyInitialSelection($widget);
        });
    }

    function buildMenu($widget, categoryTree) {
        const menuHtml = buildMenuHtml(categoryTree, 0, [], []);
        $widget.find('.multilevel-dropdown-menu').remove();
        $widget.append(`<ul class="multilevel-dropdown-menu">${menuHtml}</ul>`);
    }

    function escapeAttribute(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function buildMenuHtml(categories, level, parentPathNames, parentPathIds) {
        let html = '';
        
        for (const [categoryId, categoryData] of Object.entries(categories)) {
            const hasChildren = Object.keys(categoryData.children || {}).length > 0;
            const categoryIcon = categoryData.icon || '📁';
            const articleCount = categoryData.article_count > 0 ? `<span class="article-count">${categoryData.article_count}</span>` : '';
            const currentPathNames = [...parentPathNames, categoryData.name];
            const currentPathIds = [...parentPathIds, categoryId];
            const fullPath = escapeAttribute(currentPathNames.join(' › '));
            
            html += `
                <li class="parent">
                    <a href="#"
                       data-category-id="${categoryId}"
                       data-level="${level}"
                       data-full-path="${fullPath}"
                       data-path-ids="${currentPathIds.join('>')}">
                        ${categoryIcon} ${categoryData.name} ${articleCount}
                    </a>
            `;
            
            if (hasChildren) {
                html += `<ul class="child">${buildMenuHtml(categoryData.children, level + 1, currentPathNames, currentPathIds)}</ul>`;
            }
            
            html += '</li>';
        }
        
        return html;
    }

    // Solution robuste pour Django Admin
    function bindEventsRobust($widget) {
        // Gestion des clics sur les catégories
        $widget.on('click', '.multilevel-dropdown-menu a', function(e) {
            e.preventDefault();
            
            const categoryId = $(this).data('category-id');
            const categoryName = $(this).text().trim();
            const fullPath = $(this).data('full-path') || categoryName;
            
            // Mettre à jour la sélection
            $widget.find('.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            
            // Mettre à jour le champ caché
            const $hiddenInput = $widget.find('input[type="hidden"]');
            $hiddenInput.val(categoryId);
            
            // Mettre à jour l'affichage
            updateSelectionDisplay($widget, fullPath);
            
            // Déclencher l'événement change sur le champ caché
            $hiddenInput.trigger('change');
            $hiddenInput.trigger('input');
        });

        // Solution robuste pour les sous-menus - compatible Django Admin
        initMenuRobust($widget);
    }

    function applyInitialSelection($widget) {
        const $hiddenInput = $widget.find('input[type="hidden"]');
        const currentValue = $hiddenInput.val();

        if (!currentValue) {
            return;
        }

        const $selectedLink = $widget.find(`.multilevel-dropdown-menu a[data-category-id="${currentValue}"]`);
        if ($selectedLink.length === 0) {
            return;
        }

        $widget.find('.selected').removeClass('selected');
        $selectedLink.parent().addClass('selected');

        const fullPath = $selectedLink.data('full-path') || $selectedLink.text().trim();
        updateSelectionDisplay($widget, fullPath);
    }

    // Solution robuste pour les sous-menus basée sur l'extrait fourni
    function initMenuRobust($widget) {
        const parents = $widget.find('.multilevel-dropdown-menu .parent');
        
        if (parents.length === 0) {
            // Si les éléments ne sont pas encore là, réessayer
            setTimeout(() => initMenuRobust($widget), 100);
            return;
        }
        
        parents.each(function() {
            const $parent = $(this);
            const $child = $parent.find('.child');
            
            if ($child.length === 0) return;
            
            let timeout;
            
            function showSubmenu() {
                clearTimeout(timeout);
                $child.css('display', 'block');
            }
            
            function hideSubmenu() {
                timeout = setTimeout(() => {
                    $child.css('display', 'none');
                }, 200);
            }
            
            $parent.on('mouseenter', showSubmenu);
            $parent.on('mouseleave', hideSubmenu);
            $child.on('mouseenter', showSubmenu);
            $child.on('mouseleave', hideSubmenu);
        });
    }

    // Initialisation vanilla JS inspirée de l'extrait fourni
    function initMenuVanilla() {
        const parents = document.querySelectorAll('.multilevel-dropdown-menu .parent');
        
        if (parents.length === 0) {
            setTimeout(initMenuVanilla, 100);
            return;
        }
        
        parents.forEach(parent => {
            const child = parent.querySelector('.child');
            if (!child) return;
            
            let timeout;
            
            function showSubmenu() {
                clearTimeout(timeout);
                child.style.display = 'block';
            }
            
            function hideSubmenu() {
                timeout = setTimeout(() => {
                    child.style.display = 'none';
                }, 200);
            }
            
            parent.addEventListener('mouseenter', showSubmenu);
            parent.addEventListener('mouseleave', hideSubmenu);
            child.addEventListener('mouseenter', showSubmenu);
            child.addEventListener('mouseleave', hideSubmenu);
        });
    }

    function updateSelectionDisplay($widget, fullPath) {
        const displayElement = $widget.find('.selection-display');
        const cleanPath = fullPath
            .replace(/📁|📄/g, '')
            .split('›')
            .map(segment => segment.trim())
            .filter(Boolean);

        const formattedPath = cleanPath
            .map((segment, index) => `<span class="path-segment level-${index}">${segment}</span>`)
            .join(' <span class="path-arrow">›</span> ');

        displayElement.html(`
            <div class="selected-path">
                <strong>Sélection actuelle :</strong><br>
                📁 ${formattedPath || 'Aucune catégorie sélectionnée'}
            </div>
        `);
        
        // Forcer la fermeture des sous-menus après sélection
        $widget.find('.multilevel-dropdown-menu .child').hide();
    }

    // Initialisation jQuery
    $(document).ready(function() {
        initHierarchicalWidget();
    });

    // Initialisation vanilla JS pour Django Admin
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenuVanilla);
    } else {
        initMenuVanilla();
    }
    
    // Pour Django admin qui charge du contenu dynamiquement
    if (typeof django !== 'undefined' && django.jQuery) {
        django.jQuery(document).on('formset:added', function() {
            initHierarchicalWidget();
            initMenuVanilla();
        });
    }

    // Réinitialisation après les changements AJAX
    $(document).on('DOMNodeInserted', function(e) {
        if ($(e.target).find('.hierarchical-category-widget').length > 0) {
            initHierarchicalWidget();
            initMenuVanilla();
        }
    });

})(django.jQuery || jQuery);