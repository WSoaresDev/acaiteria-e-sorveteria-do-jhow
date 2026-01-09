// 1. DADOS DOS PRODUTOS
const DB = {
    products: [
        { id: 1, cat: 'acai', name: "Açaí Tradicional Prime", desc: "Açaí puro, banana fatiada e granola artesanal.", badge: "Mais Vendido", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", options: [{s:"300ml", p:16}, {s:"500ml", p:24}, {s:"700ml", p:32}] },
        { id: 2, cat: 'acai', name: "Açaí Trufado Nutella", desc: "Camadas generosas de Nutella e leite em pó.", badge: "Premium", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500", options: [{s:"300ml", p:20}, {s:"500ml", p:28}, {s:"700ml", p:36}] },
        { id: 3, cat: 'casadinho', name: "Casadinho Cupuaçu", desc: "O equilíbrio perfeito entre Açaí e Cupuaçu.", badge: "Regional", img: "https://images.unsplash.com/photo-1623334200455-241578332155?w=500", options: [{s:"300ml", p:18}, {s:"500ml", p:26}] },
        { id: 4, cat: 'sorvete', name: "Grand Gateau Açaí", desc: "Açaí com picolé de chocolate e frutas vermelhas.", badge: "Exclusivo", img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500", options: [{s:"Tamanho Único", p:35}] },
        { id: 5, cat: 'bebidas', name: "Smoothie Energético", desc: "Batido com guaraná, amendoim e catuaba.", badge: "Energia", img: "https://images.unsplash.com/photo-1579954115545-a95591f28be0?w=500", options: [{s:"500ml", p:15}] },
        { id: 6, cat: 'promocao', name: "Combo Casal", desc: "2 Açaís de 500ml + 2 adicionais extras.", badge: "Oferta", img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", options: [{s:"Combo", p:42}] }
    ],
    config: {
        taxaEntrega: 5.00,
        whatsApp: "5511999998888",
        horarioAbertura: 11,
        horarioFechamento: 23
    }
};

let CART = [];

// 2. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true });
    checkLojaStatus();
    renderProducts('todos');
    
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
    }, 1500);
});

// 3. RENDERIZAÇÃO
function renderProducts(cat) {
    const list = document.getElementById('product-list');
    const filtered = cat === 'todos' ? DB.products : DB.products.filter(p => p.cat === cat);
    
    list.innerHTML = filtered.map(p => `
        <div class="p-card" data-aos="fade-up">
            <img src="${p.img}" class="p-img">
            ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ''}
            <div class="p-info">
                <h3 class="p-title">${p.name}</h3>
                <p class="p-desc">${p.desc}</p>
                <select id="size-${p.id}" class="p-selector">
                    ${p.options.map(o => `<option value="${o.p}">${o.s} - R$ ${o.p.toFixed(2)}</option>`).join('')}
                </select>
                <button class="btn-add" onclick="handleAddToCart(${p.id})">
                    Adicionar ao Pedido
                </button>
            </div>
        </div>
    `).join('');
}

function filterMenu(cat, el) {
    document.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderProducts(cat);
}

// 4. LÓGICA DO CARRINHO
function handleAddToCart(id) {
    const p = DB.products.find(item => item.id === id);
    const select = document.getElementById(`size-${id}`);
    const price = parseFloat(select.value);
    const sizeName = select.options[select.selectedIndex].text.split(' - ')[0];
    
    addToCart(`${p.name} (${sizeName})`, price);
}

function addToCart(name, price) {
    CART.push({ name, price });
    updateCartUI();
    
    // Pequena animação no ícone
    const icon = document.querySelector('.cart-trigger');
    icon.style.transform = "scale(1.2)";
    setTimeout(() => icon.style.transform = "scale(1)", 200);
}

function updateCartUI() {
    const container = document.getElementById('cart-items-flow');
    const countEl = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('cart-total');

    container.innerHTML = CART.map((item, i) => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>R$ ${item.price.toFixed(2)}</small>
            </div>
            <i class="fas fa-trash-alt" onclick="removeFromCart(${i})" style="color:#ff4d4d; cursor:pointer"></i>
        </div>
    `).join('');

    const subtotal = CART.reduce((acc, curr) => acc + curr.price, 0);
    const total = subtotal + (subtotal > 0 ? DB.config.taxaEntrega : 0);
    
    countEl.innerText = CART.length;
    subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    totalEl.innerText = `R$ ${total.toFixed(2)}`;
}

function removeFromCart(i) {
    CART.splice(i, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// 5. MONTE SEU AÇAÍ (CHEF)
function addChefCombination() {
    const baseSelect = document.getElementById('custom-base');
    const basePrice = parseFloat(baseSelect.value);
    const baseName = baseSelect.options[baseSelect.selectedIndex].text.split(' - ')[0];
    
    let free = [];
    document.querySelectorAll('.extra-free:checked').forEach(c => free.push(c.value));
    
    let paid = [];
    document.querySelectorAll('.extra-paid:checked').forEach(c => paid.push(c.value));
    
    const finalPrice = basePrice + (paid.length * 3.50);
    const fullName = `Chef: ${baseName} + [${free.join(', ')}] + [${paid.join(', ')}]`;
    
    addToCart(fullName, finalPrice);
    alert("Sua criação foi adicionada!");
}

// 6. STATUS DA LOJA
function checkLojaStatus() {
    const now = new Date();
    const hora = now.getHours();
    const statusEl = document.getElementById('status-loja');
    
    if(hora >= DB.config.horarioAbertura && hora < DB.config.horarioFechamento) {
        statusEl.innerHTML = `<i class="fas fa-circle status-open"></i> ABERTO AGORA (Fecha às 23h)`;
    } else {
        statusEl.innerHTML = `<i class="fas fa-circle status-closed"></i> FECHADO (Abre às 11h)`;
    }
}

// 7. WHATSAPP CHECKOUT
function sendToWhatsApp() {
    if(CART.length === 0) return alert("Seu carrinho está vazio!");
    
    const payment = document.getElementById('payment-method').value;
    const total = document.getElementById('cart-total').innerText;
    
    let texto = `*NOVO PEDIDO - AÇAÍ PRIME*%0A%0A`;
    CART.forEach(i => texto += `• ${i.name} - R$ ${i.price.toFixed(2)}%0A`);
    texto += `%0A*Subtotal:* R$ ${document.getElementById('subtotal').innerText}`;
    texto += `%0A*Entrega:* R$ ${DB.config.taxaEntrega.toFixed(2)}`;
    texto += `%0A*TOTAL:* ${total}`;
    texto += `%0A%0A*Pagamento:* ${payment}`;
    texto += `%0A*Endereço:* (Digite aqui seu endereço)`;

    window.open(`https://wa.me/${DB.config.whatsApp}?text=${texto}`);
}