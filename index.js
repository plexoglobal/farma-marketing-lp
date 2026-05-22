// Plexo Farma - Interactivity Engine

// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// Substitua os valores abaixo pelas credenciais do seu projeto do Supabase.
// ==========================================
const SUPABASE_URL = 'https://jumatokindwpnplmoujy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TwOn7Bg7qTxT4IfGRSXJ_w_DS9Hz5-t';

// Helper para enviar eventos ao GA4 de forma segura (previne erros caso o script do GA4 seja bloqueado por adblockers)
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  } else {
    console.log(`[GA4 simulated] Evento: ${eventName}`, eventParams);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupHeaderScroll();
  setupTabs();
  setupMobileMenu();
  setupDashboardTabs();
  setupAnalytics();
});

// Scroll detection to update header styling
function setupHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Tab navigation for solutions/methods
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      // Hide all panes
      tabPanes.forEach(p => p.classList.remove('active'));

      // Activate selected button
      btn.classList.add('active');
      // Show matching pane
      const targetTab = btn.getAttribute('data-tab');
      const activePane = document.getElementById(targetTab);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });
}

// Dashboard tab navigation
function setupDashboardTabs() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const dashPanes = document.querySelectorAll('.dash-pane');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Deactivate all sidebar items
      sidebarItems.forEach(i => i.classList.remove('active'));
      // Hide all panes
      dashPanes.forEach(p => p.classList.remove('active'));

      // Activate clicked sidebar item
      item.classList.add('active');

      // Show matching pane
      const targetPaneId = item.getAttribute('data-dash-tab');
      const activePane = document.getElementById(targetPaneId);
      if (activePane) {
        activePane.classList.add('active');
      }

      // Track click in GA4
      const tabTitle = item.textContent.trim();
      trackEvent('dashboard_tab_click', {
        tab_id: targetPaneId,
        tab_title: tabTitle
      });
    });
  });
}

// Mobile burger menu toggle
function setupMobileMenu() {
  const burgerBtn = document.getElementById('burger-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
      // Toggle menu visibility (quick pure CSS toggles via inline style or custom classes)
      const isVisible = navLinks.style.display === 'flex';
      
      if (isVisible) {
        navLinks.style.display = 'none';
        burgerBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        `;
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '72px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid var(--border-medium)';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
        navLinks.style.gap = '1.5rem';
        
        burgerBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      }
    });

    // Close menu when clicking link
    const links = navLinks.querySelectorAll('a');
    links.forEach(l => {
      l.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
          burgerBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          `;
        }
      });
    });
  }
}

// Contact form submit controller
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('leads-form');
  const successCard = document.getElementById('form-success');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Coletar valores do formulário
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const farmaType = document.getElementById('farma-type').value;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando dados...';
  
  // Verificar se o Supabase está configurado
  const isSupabaseConfigured = 
    SUPABASE_URL && 
    SUPABASE_URL !== 'COLOQUE_AQUI_SUA_URL_DO_SUPABASE' && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY !== 'COLOQUE_AQUI_SUA_ANON_KEY_DO_SUPABASE';
    
  if (!isSupabaseConfigured) {
    console.warn("Supabase não configurado. Simulando envio do lead localmente...");
    
    // Track simulated lead generation in GA4
    trackEvent('generate_lead', { farma_type: farmaType });
    
    setTimeout(() => {
      form.style.display = 'none';
      successCard.style.display = 'block';
    }, 1200);
    return;
  }
  
  // Enviar dados para o Supabase via REST API (PostgREST)
  fetch(`${SUPABASE_URL}/rest/v1/leads_plexo_farma`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      phone: phone,
      farma_type: farmaType
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Falha ao salvar lead.');
    }
    
    // Track successful lead generation in GA4
    trackEvent('generate_lead', { farma_type: farmaType });
    
    form.style.display = 'none';
    successCard.style.display = 'block';
  })
  .catch(error => {
    console.error('Erro ao enviar lead para o Supabase:', error);
    alert('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente ou fale conosco pelo WhatsApp.');
    
    // Restaurar botão para permitir nova tentativa
    submitBtn.disabled = false;
    submitBtn.textContent = 'Solicitar Diagnóstico Sem Custo';
  });
}

// Configurar ouvintes de eventos para cliques de CTAs e WhatsApp
function setupAnalytics() {
  // 1. Clicks em botões do WhatsApp
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('click_whatsapp', {
        link_text: link.textContent.trim(),
        destination: link.href
      });
    });
  });

  // 2. Clicks em CTAs de âncora de diagnóstico
  document.querySelectorAll('a[href="#diagnostico"]').forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('click_cta', {
        link_text: link.textContent.trim(),
        target: '#diagnostico'
      });
    });
  });
}
