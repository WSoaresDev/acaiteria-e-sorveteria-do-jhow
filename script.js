const DB = {
    products: [
        { 
            id: 1, cat: 'acai', name: "Açaí Tradicional Prime", desc: "Açaí puro. Escolha os acompanhamentos e frutas abaixo.", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] 
        },
        { 
            id: 2, cat: 'sorvete', name: "Sorvete Prime", desc: "Apenas sorvete. Escolha os sabores e acompanhamentos abaixo.", img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:20}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] 
        },
        { 
            id: 3, cat: 'casadinho', name: "Açaí com Sorvete", desc: "O melhor dos dois mundos. Personalize abaixo.", img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] 
        },
        { id: 4, cat: 'picole', name: "Picolé Skimo", desc: "Chocolate Crocante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:6.00}] },
        { id: 15, cat: 'bebida', name: "Coca Cola 600ml", desc: "Gelada", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:8.00}] }
    ],
    config: {
        whatsApp: "5511999998888", 
        horarioAbertura: 11,
        horarioFechamento: 23,
        taxas: { "Nova Belém": 5.00, "Chacrinha": 7.00, "Beira Rio": 4.00, "0": 0 }
    }
};

let CART = [];
let discountFactor = 0;
let tempItem = null; // Armazena o item que está sendo personalizado

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
                <button class="btn-add" onclick="initPersonalization(${p.id})">
                    ${isSingle ? 'Adicionar' : 'Escolher e Montar'}
                </button>
            </div>
        </div>
    `}).join('');
}

function initPersonalization(id) {
    const p = DB.products.find(i => i.id === id);
    const sel = document.getElementById(`size-${id}`);
    const price = parseFloat(sel.value);
    const sizeLabel = p.options.length > 1 ? sel.options[sel.selectedIndex].text.split(' - ')[0] : "";

    // Se for picolé ou bebida, adiciona direto sem abrir o personalizador
    if(p.cat === 'picole' || p.cat === 'bebida') {
        CART.push({ name: p.name, price: price });
        updateCartUI();
        return;
    }

    // Armazena os dados básicos para o Chef
    tempItem = { name: p.name, size: sizeLabel, price: price, cat: p.cat };

    // Ajusta o que aparece no Personalizador
    document.getElementById('selected-product-name').innerText = `${p.name} ${sizeLabel}`;
    document.getElementById('monte-seu').style.display = 'block';
    
    // Mostra/Esconde seções de acordo com a categoria
    document.getElementById('step-sabores-acai').style.display = (p.cat === 'acai' || p.cat === 'casadinho') ? 'block' : 'none';
    document.getElementById('step-sabores-sorvete').style.display = (p.cat === 'sorvete' || p.cat === 'casadinho') ? 'block' : 'none';

    window.location.hash = "#monte-seu";
}

function confirmChefItem() {
    let saboresAcai = [];
    document.querySelectorAll('.extra-sabor-acai:checked').forEach(e => saboresAcai.push(e.value));
    
    let saboresSorvete = [];
    document.querySelectorAll('.extra-sabor-sorvete:checked').forEach(e => saboresSorvete.push(e.value));

    let extras = [];
    document.querySelectorAll('.extra-free:checked').forEach(e => extras.push(e.value));
    
    let frutas = [];
    document.querySelectorAll('.extra-fruta:checked').forEach(e => frutas.push(e.value));
    
    let caldas = [];
    document.querySelectorAll('.extra-calda:checked').forEach(e => caldas.push(e.value));

    // Validação de segurança
    if(tempItem.cat === 'acai' && saboresAcai.length === 0) return alert("Escolha o sabor do Açaí!");
    if(tempItem.cat === 'sorvete' && saboresSorvete.length === 0) return alert("Escolha o sabor do Sorvete!");

    let finalDesc = `${tempItem.name} (${tempItem.size})`;
    if(saboresAcai.length > 0) finalDesc += ` | Açaí: ${saboresAcai.join(',')}`;
    if(saboresSorvete.length > 0) finalDesc += ` | Sorvete: ${saboresSorvete.join(',')}`;
    if(extras.length > 0) finalDesc += ` | Extras: ${extras.join(',')}`;
    if(frutas.length > 0) finalDesc += ` | Frutas: ${frutas.join(',')}`;
    if(caldas.length > 0) finalDesc += ` | Calda: ${caldas.join(',')}`;

    CART.push({ name: finalDesc, price: tempItem.price });
    updateCartUI();
    cancelSelection();
    alert("Adicionado ao carrinho!");
}

function cancelSelection() {
    document.getElementById('monte-seu').style.display = 'none';
    document.querySelectorAll('input[type="checkbox"]').forEach(c => { c.checked = false; c.disabled = false; });
    tempItem = null;
}

function limitChecks(className, limit) {
    const checked = document.querySelectorAll(`.${className}:checked`);
    document.querySelectorAll(`.${className}`).forEach(c => {
        c.disabled = (!c.checked && checked.length >= limit);
    });
}

function filterMenu(cat, el) {
    document.querySelectorAll('.filter-item').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderProducts(cat);
}

function updateCartUI() {
    const flow = document.getElementById('cart-items-flow');
    const bairro = document.getElementById('bairro-select').value;
    const taxa = DB.config.taxas[bairro] || 0;
    
    flow.innerHTML = CART.map((item, i) => `
        <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <span style="font-size: 0.8rem; max-width: 70%;">${item.name}</span>
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
    statusEl.innerHTML = aberto ? `<i class="fas fa-circle" style="color:#25d366"></i> Aberto` : `<i class="fas fa-circle" style="color:red"></i> Fechado`;
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