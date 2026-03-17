// Initialize Icons
lucide.createIcons();

// --- MOBILE MENU LOGIC ---
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('active');

    // Animate Icons
    if (isOpen) {
        menuIcon.classList.replace('opacity-100', 'opacity-0');
        menuIcon.classList.replace('scale-100', 'scale-50');
        menuIcon.classList.replace('rotate-0', 'rotate-90');
        
        closeIcon.classList.replace('opacity-0', 'opacity-100');
        closeIcon.classList.replace('scale-50', 'scale-100');
        closeIcon.classList.replace('-rotate-90', 'rotate-0');
    } else {
        menuIcon.classList.replace('opacity-0', 'opacity-100');
        menuIcon.classList.replace('scale-50', 'scale-100');
        menuIcon.classList.replace('rotate-90', 'rotate-0');
        
        closeIcon.classList.replace('opacity-100', 'opacity-0');
        closeIcon.classList.replace('scale-100', 'scale-50');
        closeIcon.classList.replace('rotate-0', '-rotate-90');
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
}

menuToggle.addEventListener('click', toggleMenu);

// Close menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        
        // Reset Icons to Menu State
        menuIcon.classList.replace('opacity-0', 'opacity-100');
        menuIcon.classList.replace('scale-50', 'scale-100');
        menuIcon.classList.replace('rotate-90', 'rotate-0');
        
        closeIcon.classList.replace('opacity-100', 'opacity-0');
        closeIcon.classList.replace('scale-100', 'scale-50');
        closeIcon.classList.replace('rotate-0', '-rotate-90');
        
        document.body.style.overflow = 'auto';
    });
});

// --- DYNAMIC RECIPES LOADER ---
let allRecipes = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('collection.json')
        .then(response => response.json())
        .then(data => {
            allRecipes = data;
            populateDropdown();
            renderRecipes(allRecipes);
        })
        .catch(error => console.error('Error loading recipes:', error));
});

function populateDropdown() {
    const filterSelect = document.getElementById('recipe-filter');
    const types = [...new Set(allRecipes.map(r => r.Type))];

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        option.className = 'bg-[var(--dark)] text-white';
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', (e) => {
        const category = e.target.value;
        const grid = document.getElementById('recipe-grid');
        const sizer = document.getElementById('recipe-filter-sizer');

        if (sizer) {
            sizer.textContent = e.target.options[e.target.selectedIndex].text;
        }

        // Fade out slightly before rendering
        Array.from(grid.children).forEach(card => card.style.opacity = '0');

        setTimeout(() => {
            if (category === 'all') {
                renderRecipes(allRecipes);
            } else {
                const filtered = allRecipes.filter(r => r.Type.toLowerCase() === category);
                renderRecipes(filtered);
            }
        }, 300);
    });
}

function renderRecipes(recipes) {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card group relative h-[500px] border border-white/10 overflow-hidden';
        card.dataset.spirit = recipe.Type.toLowerCase();
        card.style.opacity = '0'; // Initial state for fade-in
        card.innerHTML = `
            <img src="${recipe.Image}" class="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition duration-700" alt="${recipe.Name}">
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div class="absolute bottom-0 p-8 w-full z-10">
                <span class="text-[var(--gold)] text-xs tracking-widest uppercase">${recipe.Type}</span>
                <h3 class="text-3xl mb-2 pb-2 italic">${recipe.Name}</h3>
                ${recipe.Description ? `<p class="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition duration-500 transform translate-y-4 group-hover:translate-y-0">${recipe.Description}</p>` : ''}
            </div>
        `;
        grid.appendChild(card);

        // Render step
        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.opacity = '1';
            }, 50);
        });
    });
}
