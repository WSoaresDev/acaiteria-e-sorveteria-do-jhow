const DB = {
    products: [
        { 
            id: 1, cat: 'acai', name: "Açaí Tradicional Prime", desc: "Dois sabores de açaí, diversos acompanhamentos e uma calda", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] 
        },
        { 
            id: 2, cat: 'sorvete', name: "Sorvete Prime", desc: "Dois sabores de sorvete, acompanhamentos e uma calda", img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:20}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] 
        },
        { 
            id: 3, cat: 'casadinho', name: "Açaí com Sorvete", desc: "Um sabor de cada, acompanhamentos e uma calda", img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] 
        },
        // PICOLÉS
        { id: 4, cat: 'picole', name: "Picolé Leite Condensado", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 5, cat: 'picole', name: "Picolé Milho Verde", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 6, cat: 'picole', name: "Picolé de Coco", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 7, cat: 'picole', name: "Picolé de Tapioca com Coco", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 8, cat: 'picole', name: "Picolé de Manga", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 9, cat: 'picole', name: "Picolé de Maracujá", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 10, cat: 'picole', name: "Picolé de Uva", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 11, cat: 'picole', name: "Picolé Brigadeiro Skimo", desc: "Cobertura de chocolate", img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500", options: [{s:"Unidade", p:6.00}] },
        { id: 12, cat: 'picole', name: "Picolé Chocolate Branco Skimo", desc: "Cobertura branca", img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500", options: [{s:"Unidade", p:6.00}] },
        { id: 13, cat: 'picole', name: "Picolé Tapioca Recheado", desc: "Recheio de Leite Condensado", img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500", options: [{s:"Unidade", p:7.00}] },
        { id: 14, cat: 'picole', name: "Picolé Maracujá Recheado", desc: "Recheio de Leite Condensado", img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500", options: [{s:"Unidade", p:7.00}] },
        
        // BEBIDAS (NOVAS)
        { id: 15, cat: 'bebida', name: "Água c/ Gás", desc: "500ml", img: "https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500", options: [{s:"Unidade", p:4.00}] },
        { id: 16, cat: 'bebida', name: "Água s/ Gás", desc: "500ml", img: "https://images.unsplash.com/photo-1523362628242-f513a0052716?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 17, cat: 'bebida', name: "Água c/ Gás 1,5L", desc: "Garrafa família", img: "https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500", options: [{s:"Unidade", p:5.00}] },
        { id: 18, cat: 'bebida', name: "Coca Cola 600ml", desc: "Gelada", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:8.00}] },
        { id: 19, cat: 'bebida', name: "Coca Cola 2L", desc: "Gelada", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:16.00}] },
        { id: 20, cat: 'bebida', name: "Guaracamp", desc: "Copo tradicional", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:2.00}] },
        { id: 21, cat: 'bebida', name: "Coca Cola 320ml", desc: "Lata", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:6.00}] },
        { id: 22, cat: 'bebida', name: "Guaracamp 265ml", desc: "Garrafinha", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 23, cat: 'bebida', name: "Fanta Laranja 2L", desc: "Gelada", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:16.00}] }
    ],
    config: {
        whatsApp: "5521968896846", 
        horarioAbertura: 11,
        horarioFechamento: 22,
        taxas: { "Nova Belém": 4.00, "Chacrinha": 5.00, "Beira Rio": 6.00, "0": 0 }
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
    
    list.innerHTML = filtered.map(p => {
        // Se for picolé ou bebida, não mostra o select (pois só tem um tamanho/preço)
        const isSingle = (p.cat === 'picole' || p.cat === 'bebida');
        const hideSelect = isSingle ? 'display:none' : '';
        const priceLabel = isSingle ? `R$ ${p.options[0].p.toFixed(2)}` : '';

        return `
        <div class="p-card" data-aos="fade-up">
            <img src="${p.img}" class="p-img">
            <div class="p-info">
                <h3 class="p-title">${p.name} ${priceLabel}</h3>
                <p class="p-desc">${p.desc}</p>
                <select id="size-${p.id}" class="p-selector" style="${hideSelect}">
                    ${p.options.map(o => `<option value="${o.p}">${o.s} - R$ ${o.p.toFixed(2)}</option>`).join('')}
                </select>
                <button class="btn-add" onclick="addItem(${p.id})">Adicionar ao Pedido</button>
            </div>
        </div>
    `}).join('');
}

function filterMenu(cat, el) {
    document.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderProducts(cat);
}

function addItem(id) {
    const p = DB.products.find(i => i.id === id);
    const sel = document.getElementById(`size-${id}`);
    const price = parseFloat(sel.value);
    
    // Lógica para nome no carrinho
    const isSingle = (p.cat === 'picole' || p.cat === 'bebida');
    const label = isSingle ? p.name : `${p.name} (${sel.options[sel.selectedIndex].text.split(' - ')[0]})`;
    
    CART.push({ name: label, price: price });
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
    alert("Adicionado!");
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
            <span style="font-size: 0.9rem;">${item.name}</span>
            <div>
                <span style="font-weight: bold;">R$ ${item.price.toFixed(2)}</span>
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
    msg += `%0A*Subtotal:* ${document.getElementById('subtotal').innerText}`;
    msg += `%0A*Bairro:* ${bairro}`;
    msg += `%0A*TOTAL:* ${document.getElementById('cart-total').innerText}`;
    window.open(`https://wa.me/${DB.config.whatsApp}?text=${msg}`);
}