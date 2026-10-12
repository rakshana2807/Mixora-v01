document.addEventListener('DOMContentLoaded', () => {
    let lastOrderCount = 0;
    let currentDashboardFilterTab = 'all';
    
    // SPA Navigation
    const navLinks = document.querySelectorAll('#admin-sidebar-nav a[data-view]');
    const views = document.querySelectorAll('.admin-view');
    const titleEl = document.getElementById('current-view-title');
    
    // Sidebar Toggle
    const sidebar = document.getElementById('admin-sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');
    if(window.Storage.get('mixora_sidebar_collapsed')) {
        sidebar.classList.add('collapsed');
    }
    const toggleSidebarHandler = () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open');
            mobileOverlay?.classList.toggle('active');
        } else {
            sidebar.classList.toggle('collapsed');
            window.Storage.set('mixora_sidebar_collapsed', sidebar.classList.contains('collapsed'));
        }
    };

    document.getElementById('btn-toggle-sidebar')?.addEventListener('click', toggleSidebarHandler);
    document.getElementById('btn-sidebar-brand-toggle')?.addEventListener('click', toggleSidebarHandler);

    mobileOverlay?.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetView = link.getAttribute('data-view');
            views.forEach(v => {
                if(v.id === targetView) v.style.display = 'block';
                else v.style.display = 'none';
            });
            
            titleEl.textContent = link.textContent;
            
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                mobileOverlay?.classList.remove('active');
            }
            
            loadAdminData();
        });
    });

    document.getElementById('btn-sign-out')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.Storage.remove('mixora_admin_token');
        window.location.href = 'index.html';
    });
    
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--clr-primary);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div style="font-weight: 500;">${message}</div>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }
    
    // Reconcile Demo Orders safely: ensure exactly the intended 79 demo orders exist without duplicates
    function reconcileDemoOrders() {
        const orders = window.Storage.get(window.Storage.KEYS.ORDERS, []);
        const realOrders = orders.filter(o => !o.isDemo);
        const demoOrders = orders.filter(o => o.isDemo);

        // Deduplicate demo orders by orderId
        const seen = new Set();
        const uniqueDemoOrders = [];
        for (const o of demoOrders) {
            if (!seen.has(o.orderId)) {
                seen.add(o.orderId);
                uniqueDemoOrders.push(o);
            }
        }

        // If duplicate demo orders existed or count exceeded 79, trim down to max 79 canonical demo orders
        if (uniqueDemoOrders.length !== demoOrders.length || (uniqueDemoOrders.length > 79)) {
            const canonicalDemo = uniqueDemoOrders.slice(0, 79);
            window.Storage.set(window.Storage.KEYS.ORDERS, [...realOrders, ...canonicalDemo]);
        }
    }

    // Main Data Loader
    function loadAdminData() {
        reconcileDemoOrders();
        const orders = window.Storage.get(window.Storage.KEYS.ORDERS, []);
        
        // Notify new order
        if(orders.length > lastOrderCount && lastOrderCount > 0) {
            const diff = orders.length - lastOrderCount;
            showToast(`${diff} New Order(s) Received!`);
        }
        lastOrderCount = orders.length;
        
        renderDashboard(orders);
        renderAllOrders(orders);
        renderQueue(orders);
        renderMenu();
        renderIngredients();
        renderCustomers(orders);
        renderAnalytics(orders);
    }
    
    function isDateInRange(dateString, range) {
        if (range === 'all') return true;
        const d = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (range === 'today') return d >= today;
        if (range === 'yesterday') {
            const yest = new Date(today);
            yest.setDate(yest.getDate() - 1);
            return d >= yest && d < today;
        }
        if (range === '7days') {
            const week = new Date(today);
            week.setDate(week.getDate() - 7);
            return d >= week;
        }
        if (range === '30days') {
            const month = new Date(today);
            month.setDate(month.getDate() - 30);
            return d >= month;
        }
        if (range === 'month') {
            const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return d >= startMonth;
        }
        return true;
    }

    function renderDashboard(allOrders) {

        const demoOrders = allOrders.filter(o => o.isDemo);
        
        const demoIndicator = document.getElementById('demo-mode-indicator');
        if(demoIndicator) {
            demoIndicator.style.display = demoOrders.length > 0 ? 'inline-block' : 'none';
        }

        const headerDemoBadge = document.getElementById('header-demo-badge');
        const headerDemoCount = document.getElementById('header-demo-count');
        if(headerDemoBadge && headerDemoCount) {
            headerDemoBadge.style.display = demoOrders.length > 0 ? 'block' : 'none';
            headerDemoCount.textContent = demoOrders.length;
        }


        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const isToday = (dStr) => new Date(dStr) >= today;

        const countStatus = (list, st) => list.filter(o => o.status === st).length;
        
        const card = (label, value, clickView, filter) => `
            <div class="stat-card" style="cursor: pointer;" onclick="document.querySelector('[data-view=\\'${clickView}\\']').click(); ${filter ? `document.getElementById('order-status-filter').value='${filter}'; document.getElementById('order-status-filter').dispatchEvent(new Event('change'));` : ''}">
                <div class="stat-label">${label}</div>
                <div class="stat-value" style="font-size: 1.55rem; color: var(--adm-deep-berry, #3B1F2B) !important;">${value}</div>
            </div>`;

        const ordersToday = allOrders.filter(o => isToday(o.date)).length;
        const newOrders = countStatus(allOrders, 'New');
        const prepOrders = countStatus(allOrders, 'Preparing');
        const readyOrders = countStatus(allOrders, 'Ready');
        
        const realOrders = allOrders.filter(o => !o.isDemo);
        const revToday = realOrders.filter(o => o.status === 'Completed' && isToday(o.date)).reduce((sum, o) => sum + (o.totals?.total || 0), 0);

        const kpiMain = document.getElementById('kpi-main');
        if(kpiMain) {
            kpiMain.innerHTML = `
                ${card("Today's Orders", ordersToday, 'view-orders', null)}
                ${card('New Orders', newOrders, 'view-orders', 'New')}
                ${card('Preparing', prepOrders, 'view-queue')}
                ${card('Ready for Pickup', readyOrders, 'view-queue')}
                ${card("Today's Revenue", window.Pricing.formatPrice(revToday), 'view-analytics')}
            `;
        }
        
        const alerts = [];
        if (newOrders > 0) {
            alerts.push(`<div style="background: #FFFBEB; color: #92400E; padding: 0.85rem 1.25rem; border-radius: 10px; border: 1.5px solid #FCD34D; border-left: 5px solid #F59E0B; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 6px rgba(146, 64, 14, 0.08);">
                <span style="font-weight: 500;">You have <strong style="color: #78350F;">${newOrders}</strong> new order(s) awaiting confirmation.</span>
                <button class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.84rem; border-color: #B45309 !important; color: #78350F !important; background: #FFFFFF !important; font-weight: 700;" onclick="document.querySelector('[data-view=\\'view-orders\\']').click(); document.getElementById('order-status-filter').value='New'; document.getElementById('order-status-filter').dispatchEvent(new Event('change'));">Review</button>
            </div>`);
        }
        if (readyOrders > 0) {
            alerts.push(`<div style="background: #F0FDF4; color: #166534; padding: 0.85rem 1.25rem; border-radius: 10px; border: 1.5px solid #86EFAC; border-left: 5px solid #22C55E; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 6px rgba(22, 101, 52, 0.08);">
                <span style="font-weight: 500;"><strong style="color: #14532D;">${readyOrders}</strong> order(s) are ready for customer pickup.</span>
                <button class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.84rem; border-color: #15803D !important; color: #14532D !important; background: #FFFFFF !important; font-weight: 700;" onclick="document.querySelector('[data-view=\\'view-queue\\']').click();">View Queue</button>
            </div>`);
        }
        const alertsContainer = document.getElementById('dashboard-alerts');
        if(alertsContainer) {
            alertsContainer.innerHTML = alerts.join('');
        }
        
        // Unified Order Management Table & Status Tabs
        const tabsBar = document.getElementById('dash-order-tabs');
        const unifiedTable = document.getElementById('dash-unified-orders-list');

        const tabDefs = [
            { id: 'all', label: 'All', filter: () => true },
            { id: 'new', label: 'New', filter: o => o.status === 'New' },
            { id: 'confirmed', label: 'Confirmed', filter: o => o.status === 'Confirmed' },
            { id: 'preparing', label: 'Preparing', filter: o => o.status === 'Preparing' },
            { id: 'ready', label: 'Ready for Pickup', filter: o => o.status === 'Ready' },
            { id: 'completed', label: 'Completed', filter: o => o.status === 'Completed' },
            { id: 'cancelled_rejected', label: 'Cancelled / Rejected', filter: o => ['Cancelled', 'Rejected'].includes(o.status) }
        ];

        if (tabsBar) {
            tabsBar.innerHTML = '';
            tabDefs.forEach(t => {
                const count = allOrders.filter(t.filter).length;
                const isActive = t.id === currentDashboardFilterTab;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `order-tab-btn ${isActive ? 'active' : ''}`;
                btn.setAttribute('data-tab', t.id);
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                btn.innerHTML = `${t.label} <span class="tab-count">${count}</span>`;
                btn.onclick = () => {
                    currentDashboardFilterTab = t.id;
                    tabsBar.querySelectorAll('.order-tab-btn').forEach(b => {
                        b.classList.remove('active');
                        b.setAttribute('aria-selected', 'false');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('aria-selected', 'true');
                    renderUnifiedRows();
                };
                tabsBar.appendChild(btn);
            });
        }

        function renderUnifiedRows() {
            if (!unifiedTable) return;
            unifiedTable.innerHTML = '';

            const currentDef = tabDefs.find(t => t.id === currentDashboardFilterTab) || tabDefs[0];
            const filteredOrders = allOrders
                .filter(currentDef.filter)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            const latest10 = filteredOrders.slice(0, 10);

            if (latest10.length === 0) {
                unifiedTable.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 2.5rem; color: #75646A; font-weight: 500;">No orders found in <strong>${currentDef.label}</strong> status.</td></tr>`;
                return;
            }

            latest10.forEach(o => {
                const drinkCount = (o.items || []).reduce((sum, i) => sum + (i.quantity || 1), 0);
                const orderDate = new Date(o.date);
                const timeStr = !isNaN(orderDate.getTime())
                    ? orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Just now';
                const totalFormatted = window.Pricing ? window.Pricing.formatPrice(o.totals?.total || 0) : `₹${(o.totals?.total || 0).toFixed(2)}`;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <strong style="color: var(--adm-deep-berry, #3B1F2B); font-size: 0.92rem;">${o.orderId}</strong>
                        ${o.isDemo ? ' <small style="color: #991B1B; font-weight: 700; background: #FEE2E2; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.72rem;">DEMO</small>' : ''}
                    </td>
                    <td style="font-weight: 600; color: #2B2024;">${o.customer?.name || 'Walk-in Customer'}</td>
                    <td><span style="font-weight: 600;">${drinkCount}</span> ${drinkCount === 1 ? 'drink' : 'drinks'}</td>
                    <td><strong style="color: var(--adm-deep-berry, #3B1F2B);">${totalFormatted}</strong></td>
                    <td style="color: #75646A; font-size: 0.88rem;">${timeStr}</td>
                    <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                    <td style="text-align: right;">
                        <button type="button" class="btn btn-outline btn-view" data-id="${o.orderId}" style="padding: 0.35rem 0.85rem; font-size: 0.84rem; font-weight: 700;">View</button>
                    </td>
                `;
                unifiedTable.appendChild(tr);
            });

            bindViewButtons();
        }

        renderUnifiedRows();
        
        bindViewButtons();
    }

    function renderAllOrders(orders) {
        const query = document.getElementById('order-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('order-status-filter')?.value || 'All';
        const listContainer = document.getElementById('admin-orders-list');
        if(!listContainer) return;
        
        listContainer.innerHTML = '';
        let filtered = orders;
        
        if (statusFilter !== 'All') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }
        
        if (query) {
            filtered = filtered.filter(o => o.orderId.toLowerCase().includes(query) || (o.customer?.name || '').toLowerCase().includes(query));
        }
        
        if (filtered.length === 0) {
            listContainer.innerHTML = '<tr><td colspan="7" class="text-center" style="padding: 2rem;">No orders found.</td></tr>';
            return;
        }
        
        filtered.forEach(order => {
            const date = new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            listContainer.innerHTML += `
                <tr>
                    <td><strong>${order.orderId}</strong>${order.isDemo ? ' <small style="color:red;">(DEMO)</small>' : ''}</td>
                    <td>${date}</td>
                    <td>${order.customer?.name || 'Unknown'}</td>
                    <td>${order.fulfillment?.type || 'Pickup'}</td>
                    <td>${window.Pricing.formatPrice(order.totals?.total || 0)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td><button class="btn btn-outline btn-view" data-id="${order.orderId}" style="padding: 0.25rem 0.75rem;">View</button></td>
                </tr>
            `;
        });
        
        bindViewButtons();
    }
    
    function renderQueue(orders) {
        const renderCol = (id, statuses) => {
            const col = document.getElementById(id);
            if(!col) return;
            col.innerHTML = '';
            orders.filter(o => statuses.includes(o.status)).sort((a,b) => new Date(a.date) - new Date(b.date)).forEach(o => {
                const date = new Date(o.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                let drinksHtml = '';
                (o.items || []).forEach(item => {
                    const addonsArr = [];
                    if(item.bobas) addonsArr.push(...item.bobas);
                    if(item.jellies) addonsArr.push(...item.jellies);
                    if(item.milks_foams) addonsArr.push(...item.milks_foams);
                    if(item.syrups) addonsArr.push(...item.syrups);
                    if(item.garnishes) addonsArr.push(...item.garnishes);
                    
                    drinksHtml += `
                        <div style="border-top: 1px dashed var(--clr-border); margin-top: 0.5rem; padding-top: 0.5rem; font-size: 0.85rem;">
                            <strong>${item.quantity}x ${item.name}</strong> (${item.size})<br>
                            <span class="text-muted">${item.sugar} Sugar, ${item.ice} Ice</span>
                            ${addonsArr.length ? `<br><span class="text-muted" style="color: var(--clr-primary);">+ ${addonsArr.join(', ')}</span>` : ''}
                        </div>
                    `;
                });

                col.innerHTML += `
                    <div class="queue-card">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                            <strong>${o.orderId}</strong>
                            <span class="text-muted" style="font-size: 0.8rem;">${date}</span>
                        </div>
                        <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">${o.customer?.name || 'Unknown'} • <span class="status-badge status-${o.status}" style="padding: 0.1rem 0.4rem; font-size: 0.75rem;">${o.status}</span></div>
                        
                        <div style="margin-bottom: 1rem;">
                            ${drinksHtml}
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-view" data-id="${o.orderId}" style="flex: 1; padding: 0.35rem; font-size: 0.85rem;">View</button>
                            <button class="btn btn-outline btn-print-direct" data-id="${o.orderId}" style="flex: 1; padding: 0.35rem; font-size: 0.85rem;">Print Ticket</button>
                        </div>
                    </div>
                `;
            });
        };
        
        renderCol('queue-new', ['New']);
        renderCol('queue-preparing', ['Confirmed', 'Preparing']);
        renderCol('queue-ready', ['Ready']);
        
        bindViewButtons();
        
        document.querySelectorAll('.btn-print-direct').forEach(btn => {
            btn.onclick = (e) => {
                const orderId = e.currentTarget.getAttribute('data-id');
                const order = orders.find(o => o.orderId === orderId);
                if(order) printTicket(order);
            };
        });
    }
    
    function renderMenu() {
        const list = document.getElementById('admin-menu-list');
        if(!list) return;
        list.innerHTML = window.MIXORA_MENU.map(d => `
            <tr>
                <td><strong>${d.name}</strong></td>
                <td>${d.base}</td>
                <td>${window.Pricing.formatPrice(d.basePrice)}</td>
                <td>${d.category}</td>
                <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="alert('Configuration Required')">Edit</button></td>
            </tr>
        `).join('');
    }

    function renderIngredients() {
        const list = document.getElementById('admin-ingredients-list');
        if(!list) return;
        let html = '';
        const addSection = (title, dataObj) => {
            html += `<tr><td colspan="4" style="background: #f8fafc; font-weight: 700;">${title}</td></tr>`;
            Object.keys(dataObj).forEach(key => {
                html += `
                    <tr>
                        <td>${key}</td>
                        <td>${title}</td>
                        <td>+${window.Pricing.formatPrice(dataObj[key].price || 0)}</td>
                        <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="alert('Configuration Required')">Edit</button></td>
                    </tr>
                `;
            });
        };
        addSection('Boba', window.MIXORA_PRICES.bobas);
        addSection('Jelly', window.MIXORA_PRICES.jellies);
        addSection('Milk & Foam', window.MIXORA_PRICES.milks_foams);
        addSection('Syrup', window.MIXORA_PRICES.syrups);
        addSection('Garnish', window.MIXORA_PRICES.garnishes);
        list.innerHTML = html;
    }

    function renderCustomers(orders) {
        const list = document.getElementById('admin-customers-list');
        if(!list) return;
        
        const customers = {};
        const activeUser = window.Storage.UserProfile ? window.Storage.UserProfile.get() : window.Storage.get(window.Storage.KEYS.USER);

        orders.forEach(o => {
            if (!o.customer || !o.customer.email) return;
            const email = o.customer.email.toLowerCase();
            const displayName = (activeUser && activeUser.email && activeUser.email.toLowerCase() === email) 
                ? activeUser.name 
                : (o.customer.name || 'Customer');

            if(!customers[email]) {
                customers[email] = { name: displayName, email: o.customer.email, orders: 0, spend: 0, isDemo: o.isDemo };
            }
            customers[email].orders += 1;
            if(o.status === 'Completed') {
                customers[email].spend += o.totals.total; 
            }
        });
        
        list.innerHTML = Object.values(customers).map(c => `
            <tr>
                <td><strong>${c.name}${c.isDemo ? ' <small style="color:#b91c1c;">(DEMO)</small>' : ''}</strong></td>
                <td>${c.email}</td>
                <td>${c.orders}</td>
                <td>${window.Pricing.formatPrice(c.spend)}</td>
                <td><button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="alert('Feature requires backend to inspect user history')">View</button></td>
            </tr>
        `).join('');
    }

    function renderAnalytics(orders) {
        const charts = document.getElementById('analytics-charts');
        if(!charts) return;
        
        const allOrders = orders;
        const realOrders = allOrders.filter(o => !o.isDemo);
        const liveCompleted = realOrders.filter(o => o.status === 'Completed');
        const allCompleted = allOrders.filter(o => o.status === 'Completed');
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const isToday = (dStr) => new Date(dStr) >= today;
        const isThisWeek = (dStr) => new Date(dStr) >= startOfWeek;
        const isThisMonth = (dStr) => new Date(dStr) >= startOfMonth;
        
        // REVENUE (strictly live, non-demo)
        const revToday = realOrders.filter(o => o.status === 'Completed' && isToday(o.date)).reduce((sum, o) => sum + (o.totals?.total || 0), 0);
        const revWeek = realOrders.filter(o => o.status === 'Completed' && isThisWeek(o.date)).reduce((sum, o) => sum + (o.totals?.total || 0), 0);
        const revMonth = realOrders.filter(o => o.status === 'Completed' && isThisMonth(o.date)).reduce((sum, o) => sum + (o.totals?.total || 0), 0);
        const revTotal = liveCompleted.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
        const aov = liveCompleted.length ? revTotal / liveCompleted.length : 0;
        
        // COUNTS (includes demo orders so the dashboard looks populated)
        const totalServings = allCompleted.reduce((sum, o) => sum + (o.items || []).reduce((s, i) => s + i.quantity, 0), 0);
        
        const itemCounts = {};
        const bobaCounts = {};
        const toppingCounts = {};
        const itemRevenues = {};

        allCompleted.forEach(o => {
            (o.items || []).forEach(i => {
                itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
                if(!o.isDemo) {
                    itemRevenues[i.name] = (itemRevenues[i.name] || 0) + (i.unitPrice * i.quantity);
                }
                if(i.bobas) i.bobas.forEach(b => bobaCounts[b] = (bobaCounts[b] || 0) + i.quantity);
                if(i.jellies) i.jellies.forEach(j => toppingCounts[j] = (toppingCounts[j] || 0) + i.quantity);
            });
        });

        const getTop = (dict) => Object.keys(dict).length ? Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b) : 'No data yet';
        
        // Customer insights (includes demo customers)
        const customers = {};
        allOrders.forEach(o => {
            const em = o.customer?.email || 'unknown@example.com';
            if(!customers[em]) customers[em] = { count: 0, firstDate: o.date };
            customers[em].count++;
        });
        
        const totalCust = Object.keys(customers).length;
        const repeatCust = Object.values(customers).filter(c => c.count > 1).length;
        const avgOrdersCust = totalCust ? allOrders.length / totalCust : 0;
        
        const menuItems = window.MIXORA_MENU || [];
        const allPrices = window.MIXORA_PRICES || { bobas: {} };
        const bobas = Object.keys(allPrices.bobas);
        
        let toppingHtml = Object.entries(bobaCounts)
            .sort((a,b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => `
                <div style="margin-bottom: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                        <span>${name}</span>
                        <span>${count} uses</span>
                    </div>
                    <div style="width: 100%; background: #e2e8f0; height: 8px; border-radius: 4px;">
                        <div style="width: ${Math.min(100, count * 10)}%; background: var(--clr-primary); height: 100%; border-radius: 4px;"></div>
                    </div>
                </div>
            `).join('');
            
        if(!toppingHtml) toppingHtml = '<p class="text-muted">Insufficient live data to generate chart.</p>';
        
        const cardHtml = (title, val) => `<div style="background: #FFFFFF; padding: 1.15rem 1.25rem; border-radius: var(--radius-md, 12px); border: 1.5px solid var(--adm-border, #E9DDE0); box-shadow: 0 2px 6px rgba(43, 32, 36, 0.04);">
            <div style="font-size: 0.82rem; font-weight: 600; color: var(--adm-text-secondary, #75646A); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.03em;">${title}</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: var(--adm-deep-berry, #3B1F2B);">${val}</div>
        </div>`;

        charts.innerHTML = `
            <div style="grid-column: 1 / -1; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem;">Business Performance <span style="font-size: 0.8rem; font-weight: normal; color: #b91c1c; margin-left: 1rem;">(Excludes Demo Data)</span></h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                    ${cardHtml('Revenue Today (Live)', window.Pricing.formatPrice(revToday))}
                    ${cardHtml('Revenue This Week (Live)', window.Pricing.formatPrice(revWeek))}
                    ${cardHtml('Revenue This Month (Live)', window.Pricing.formatPrice(revMonth))}
                    ${cardHtml('Total Eligible Sales', window.Pricing.formatPrice(revTotal))}
                    ${cardHtml('Average Order Value (Live)', window.Pricing.formatPrice(aov))}
                    ${cardHtml('Completed Sales (Live)', liveCompleted.length)}
                    ${cardHtml('Servings Sold (All)', totalServings)}
                </div>
            </div>
            
            <div style="grid-column: 1 / -1; margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem;">Product & Customer Insights</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                    ${cardHtml('Best-Selling Drink', getTop(itemCounts))}
                    ${cardHtml('Highest Revenue Drink (Live)', getTop(itemRevenues))}
                    ${cardHtml('Most Popular Boba', getTop(bobaCounts))}
                    ${cardHtml('Total Menu Items', menuItems.length)}
                    ${cardHtml('Registered Customers', totalCust)}
                    ${cardHtml('Repeat Customers', repeatCust)}
                    ${cardHtml('Avg Orders/Customer', avgOrdersCust.toFixed(1))}
                </div>
            </div>

            <div>
                <h4 style="margin-bottom: 1rem;">Top Boba Varieties</h4>
                ${toppingHtml}
            </div>
            <div>
                <h4 style="margin-bottom: 1rem;">Revenue Breakdown (Live)</h4>
                <div style="display: flex; gap: 1rem; align-items: flex-end; height: 150px; border-bottom: 1px solid var(--clr-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
                    <div style="flex: 1; text-align: center;">
                        <div style="background: var(--clr-primary); width: 100%; height: 20%; border-radius: 4px 4px 0 0;"></div>
                        <div style="font-size: 0.75rem; margin-top: 0.5rem;">Mon</div>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <div style="background: var(--clr-primary); width: 100%; height: 50%; border-radius: 4px 4px 0 0;"></div>
                        <div style="font-size: 0.75rem; margin-top: 0.5rem;">Tue</div>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <div style="background: var(--clr-accent); width: 100%; height: 90%; border-radius: 4px 4px 0 0;"></div>
                        <div style="font-size: 0.75rem; margin-top: 0.5rem; font-weight: bold;">Today</div>
                    </div>
                </div>
            </div>
        `;
    }

    function bindViewButtons() {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.onclick = (e) => openOrderModal(e.currentTarget.getAttribute('data-id'));
        });
    }

    // Modal & Checklist Logic
    function openOrderModal(orderId) {
        const orders = window.Storage.get(window.Storage.KEYS.ORDERS, []);
        const order = orders.find(o => o.orderId === orderId);
        if (!order) return;
        
        document.getElementById('modal-order-id').textContent = `Order ${order.orderId}`;
        document.getElementById('btn-print-ticket').onclick = () => printTicket(order);
        
        let itemsHtml = (order.items || []).map((item, idx) => {
            const addonsArr = [];
            if(item.bobas) addonsArr.push(...item.bobas);
            if(item.jellies) addonsArr.push(...item.jellies);
            if(item.milks_foams) addonsArr.push(...item.milks_foams);
            if(item.syrups) addonsArr.push(...item.syrups);
            if(item.garnishes) addonsArr.push(...item.garnishes);
            const addonsStr = addonsArr.length ? `<br><small class="text-muted">+ ${addonsArr.join(', ')}</small>` : '';
            
            return `
            <div style="margin-bottom: 1.5rem; border-bottom: 1px solid var(--adm-border, #E9DDE0); padding-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <div>
                        <strong style="color: var(--adm-deep-berry, #3B1F2B); font-size: 1.05rem;">${item.quantity}x ${item.name}</strong> (${item.size})<br>
                        <span style="color: var(--adm-text-secondary, #75646A); font-size: 0.9rem;">${item.sugar} Sugar, ${item.ice}</span>
                        ${addonsStr}
                    </div>
                    <div style="font-weight: 700; color: var(--adm-espresso, #2B2024);">${window.Pricing.formatPrice(item.unitPrice * item.quantity)}</div>
                </div>
                <div style="background: #F8F5F6; padding: 1.15rem; border-radius: var(--radius-md, 12px); margin-top: 0.75rem; border: 1px solid var(--adm-border, #E9DDE0);">
                    <strong style="display: block; margin-bottom: 0.65rem; font-size: 0.92rem; color: var(--adm-deep-berry, #3B1F2B);">Preparation Checklist</strong>
                    <label class="checklist-item"><input type="checkbox"> Prepare ${item.size} cup for ${item.name}</label>
                    ${item.sugar !== '100%' ? `<label class="checklist-item"><input type="checkbox"> Adjust sweetness to ${item.sugar}</label>` : ''}
                    <label class="checklist-item"><input type="checkbox"> Add ${item.ice}</label>
                    ${addonsArr.map(a => `<label class="checklist-item"><input type="checkbox"> Add ${a}</label>`).join('')}
                    <label class="checklist-item"><input type="checkbox"> Verify final product quality</label>
                </div>
            </div>
            `;
        }).join('');
        
        document.getElementById('modal-order-content').innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem; font-size: 0.92rem; background: #F8F5F6; padding: 1.25rem; border-radius: var(--radius-md, 12px); border: 1px solid var(--adm-border, #E9DDE0);">
                <div style="min-width: 0; word-break: break-word; color: var(--adm-espresso, #2B2024);">
                    <strong style="color: var(--adm-deep-berry, #3B1F2B);">Customer Details:</strong><br>${order.customer?.name || 'Unknown'}<br><span style="color: var(--adm-text-secondary, #75646A);">${order.customer?.phone || 'No phone'}</span><br><span style="color: var(--adm-text-secondary, #75646A);">${order.customer?.email || 'N/A'}</span>
                </div>
                <div style="min-width: 0; word-break: break-word; color: var(--adm-espresso, #2B2024);">
                    <strong style="color: var(--adm-deep-berry, #3B1F2B);">Fulfillment:</strong><br>${order.fulfillment?.type || 'Pickup'}<br><span style="color: var(--adm-text-secondary, #75646A);">${order.fulfillment?.address || 'N/A'}</span><br><br>
                    <strong style="color: var(--adm-deep-berry, #3B1F2B);">Payment:</strong> ${order.payment || 'N/A'}
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                ${itemsHtml || '<p style="color: var(--adm-text-secondary, #75646A);">No items found in this order.</p>'}
                <div style="display: flex; justify-content: space-between; font-weight: 800; margin-top: 1.25rem; font-size: 1.35rem; color: var(--adm-deep-berry, #3B1F2B); border-top: 2px solid var(--adm-border, #E9DDE0); padding-top: 1rem;">
                    <span>Total:</span>
                    <span>${window.Pricing.formatPrice(order.totals?.total || 0)}</span>
                </div>
                ${order.notes ? `<div style="margin-top: 1rem; padding: 0.85rem 1rem; background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 6px; color: #78350F; font-size: 0.92rem;"><strong style="color: #92400E;">Notes:</strong> ${order.notes}</div>` : ''}
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong style="color: var(--adm-deep-berry, #3B1F2B);">Current Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
        `;
        
        const btnContainer = document.getElementById('status-buttons');
        btnContainer.innerHTML = '';
        
        const flow = {
            'New': ['Accept Order', 'Reject Order'],
            'Confirmed': ['Start Preparing', 'Cancel Order'],
            'Preparing': ['Mark Ready'],
            'Ready': ['Mark Completed']
        };
        const actions = flow[order.status] || [];
        const statusMap = {
            'Accept Order': 'Confirmed',
            'Reject Order': 'Rejected',
            'Start Preparing': 'Preparing',
            'Mark Ready': 'Ready',
            'Mark Completed': 'Completed',
            'Cancel Order': 'Cancelled'
        };
        
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline';
            if(action === 'Accept Order' || action === 'Start Preparing' || action === 'Mark Ready' || action === 'Mark Completed') btn.classList.add('btn-primary');
            if(action === 'Reject Order' || action === 'Cancel Order') { btn.style.borderColor = 'red'; btn.style.color = 'red'; }
            btn.textContent = action;
            btn.onclick = () => {
                updateOrderStatus(orderId, statusMap[action]);
                document.getElementById('admin-order-modal').classList.remove('active');
            };
            btnContainer.appendChild(btn);
        });
        
        document.getElementById('admin-order-modal').classList.add('active');
        document.body.classList.add('modal-open');
    }
    
    function updateOrderStatus(orderId, newStatus) {
        const orders = window.Storage.get(window.Storage.KEYS.ORDERS, []);
        const order = orders.find(o => o.orderId === orderId);
        if (order) {
            order.status = newStatus;
            window.Storage.set(window.Storage.KEYS.ORDERS, orders);
            loadAdminData();
            showToast(`Order ${orderId} marked as ${newStatus}`);
        }
    }
    
    function printTicket(order) {
        const ticketContent = document.getElementById('print-ticket-content');
        
        let itemsHtml = '';
        (order.items || []).forEach((item, idx) => {
            const addonsArr = [];
            if(item.bobas) addonsArr.push(...item.bobas);
            if(item.jellies) addonsArr.push(...item.jellies);
            if(item.milks_foams) addonsArr.push(...item.milks_foams);
            if(item.syrups) addonsArr.push(...item.syrups);
            if(item.garnishes) addonsArr.push(...item.garnishes);
            
            for(let q=0; q<item.quantity; q++) {
                itemsHtml += `
                <div class="print-ticket-drink">
                    <strong>Drink ${idx+1}.${q+1}: ${item.name}</strong><br>
                    • ${item.size}<br>
                    • ${item.sugar} Sugar<br>
                    • ${item.ice}<br>
                    ${addonsArr.map(a => `• ${a}<br>`).join('')}
                </div>`;
            }
        });
        
        ticketContent.innerHTML = `
            <h1>MIXORA</h1>
            <h2>ORDER ${order.orderId}</h2>
            <div><strong>Time:</strong> ${new Date(order.date).toLocaleTimeString()}</div>
            <div><strong>Method:</strong> ${order.fulfillment?.type || 'Pickup'}</div>
            <div><strong>Customer:</strong> ${order.customer?.name || 'Unknown'}</div>
            ${order.notes ? `<div><strong>Notes:</strong> ${order.notes}</div>` : ''}
            <br>
            ${itemsHtml || '<div>No items to prepare.</div>'}
        `;
        window.print();
    }
    
    function closeModal() {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    document.getElementById('refresh-orders')?.addEventListener('click', loadAdminData);
    document.getElementById('order-search')?.addEventListener('input', loadAdminData);
    document.getElementById('order-status-filter')?.addEventListener('change', loadAdminData);
    document.getElementById('dashboard-date-filter')?.addEventListener('change', loadAdminData);

    loadAdminData();
    setInterval(loadAdminData, 30000); 
});
