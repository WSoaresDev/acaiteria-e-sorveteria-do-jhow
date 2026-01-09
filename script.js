const DB = {
    products: [
        { 
            id: 1, 
            cat: 'acai', 
            name: "Açaí Tradicional Prime", 
            desc: "Dois sabores de açaí, com a opção de escolher diversos acompanhamentos, e uma calda", 
            img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", 
            options: [
                {s:"200ml", p:10.00}, 
                {s:"300ml", p:12.00}, 
                {s:"400ml", p:16.00}, 
                {s:"500ml", p:18.00}, 
                {s:"770ml", p:22.00}, 
                {s:"1 Litro", p:31.00}
            ] 
        },
        { 
            id: 2, 
            cat: 'sorvete', 
            name: "Sorvete Prime", 
            desc: "Dois sabores de sorvete, com a opção de escolher diversos acompanhamentos, e uma calda", 
            img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500", 
            options: [
                {s:"200ml", p:10.00}, 
                {s:"300ml", p:12.00}, 
                {s:"400ml", p:16.00}, 
                {s:"500ml", p:20.00}, 
                {s:"770ml", p:22.00}, 
                {s:"1 Litro", p:31.00}
            ] 
        }
    ],
    config: {
        whatsApp: "5511999998888", // TROQUE PELO SEU NÚMERO
        horarioAbertura: 11,
        horarioFechamento: 23,
        taxas: { "Nova Belém": 5.00, "Chacrinha": 7.00, "Beira Rio": 4.00, "0": 0 }
    }
};

let CART = [];
let discountFactor = 0;

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    checkLojaStatus();
    renderProducts('todos');
    setTimeout(() => { document.getElementById('loader').style.display = 'none'; }, 1000);
});

function renderProducts(cat) {
    const list = document.getElementById('product-list');
    const filtered = cat === 'todos' ? DB.products : DB.products.filter(p => p.cat === cat);
    list.innerHTML = filtered.map(p => `
        <div class="p-card" data-aos="fade-up">
            <img src="${p.img}" class="p-img">
            <div class="p-info">
                <h3 class="p-title">${p.name}</h3>
                <p class="p-desc">${p.desc}</p>
                <select id="size-${p.id}" class="p-selector">
                    ${p.options.map(o => `<option value="${o.p}">${o.s} - R$ ${o.p.toFixed(2)}</option>`).join('')}
                </select>
                <button class="btn-add" onclick="addItem(${p.id})">Adicionar ao Pedido</button>
            </div>
        </div>
    `).join('');
}

function filterMenu(cat, el) {
    document.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderProducts(cat);
}

function addItem(id) {
    const p = DB.products.find(i => i.id === id);
    const sel = document.getElementById(`size-${id}`);
    const sizeName = sel.options[sel.selectedIndex].text.split(' - ')[0];
    CART.push({ name: `${p.name} (${sizeName})`, price: parseFloat(sel.value) });
    updateCartUI();
}

function limitCheckboxes() {
    const checked = document.querySelectorAll('.extra-free:checked');
    document.querySelectorAll('.extra-free').forEach(c => c.disabled = (!c.checked && checked.length >= 3));
}

function addChefCombination() {
    const base = document.getElementById('custom-base');
    const price = parseFloat(base.value);
    const label = base.options[base.selectedIndex].text.split(' - ')[0];
    let extras = [];
    document.querySelectorAll('.extra-free:checked').forEach(e => extras.push(e.value));
    CART.push({ name: `Chef: ${label} (${extras.join(', ')})`, price });
    updateCartUI();
    alert("Montagem adicionada ao carrinho!");
}

function applyCoupon() {
    const code = document.getElementById('coupon-input').value.toUpperCase();
    if(code === "PRIME10") {
        discountFactor = 0.10;
        alert("Cupom aplicado!");
    } else {
        discountFactor = 0;
        alert("Cupom inválido");
    }
    updateCartUI();
}

function updateCartUI() {
    const flow = document.getElementById('cart-items-flow');
    const bairro = document.getElementById('bairro-select').value;
    const taxa = DB.config.taxas[bairro] || 0;
    
    flow.innerHTML = CART.map((item, i) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span>${item.name}</span>
            <div>
                <span>R$ ${item.price.toFixed(2)}</span>
                <i class="fas fa-trash" onclick="remove(${i})" style="color:red; margin-left:10px; cursor:pointer"></i>
            </div>
        </div>
    `).join('');

    const sub = CART.reduce((a, b) => a + b.price, 0);
    const total = (sub * (1 - discountFactor)) + taxa;

    document.getElementById('subtotal').innerText = `R$ ${sub.toFixed(2)}`;
    document.getElementById('delivery-fee').innerText = `R$ ${taxa.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
    document.getElementById('cart-count').innerText = CART.length;
}

function remove(i) { CART.splice(i, 1); updateCartUI(); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }

function checkLojaStatus() {
    const hora = new Date().getHours();
    const statusEl = document.getElementById('status-loja');
    const aberto = (hora >= DB.config.horarioAbertura && hora < DB.config.horarioFechamento);
    statusEl.innerHTML = aberto ? `<i class="fas fa-circle" style="color:#25d366"></i> Aberto Agora` : `<i class="fas fa-circle" style="color:red"></i> Fechado Agora`;
}

function sendToWhatsApp() {
    const bairro = document.getElementById('bairro-select').value;
    if(bairro === "0") return alert("Escolha o bairro!");
    if(CART.length === 0) return alert("Carrinho vazio!");

    let msg = `*NOVO PEDIDO - AÇAÍ PRIME*%0A%0A`;
    CART.forEach(i => msg += `• ${i.name} - R$ ${i.price.toFixed(2)}%0A`);
    msg += `%0A*Bairro:* ${bairro}`;
    msg += `%0A*TOTAL:* ${document.getElementById('cart-total').innerText}`;
    window.open(`https://wa.me/${DB.config.whatsApp}?text=${msg}`);
}