const DB = {
    products: [], // VAMOS PREENCHER AQUI
    config: {
        whatsApp: "5511999998888",
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
    if (DB.products.length === 0) {
        list.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>Nenhum produto cadastrado.</p>";
        return;
    }
    const filtered = cat === 'todos' ? DB.products : DB.products.filter(p => p.cat === cat);
    list.innerHTML = filtered.map(p => `
        <div class="p-card">
            <img src="${p.img}" class="p-img">
            <div class="p-info">
                <h3 class="p-title">${p.name}</h3>
                <select id="size-${p.id}" class="p-selector">
                    ${p.options.map(o => `<option value="${o.p}">${o.s} - R$ ${o.p.toFixed(2)}</option>`).join('')}
                </select>
                <button class="btn-add" onclick="addItem(${p.id})">Adicionar</button>
            </div>
        </div>
    `).join('');
}

function addItem(id) {
    const p = DB.products.find(i => i.id === id);
    const sel = document.getElementById(`size-${id}`);
    CART.push({ name: `${p.name} (${sel.options[sel.selectedIndex].text.split(' - ')[0]})`, price: parseFloat(sel.value) });
    updateCartUI();
}

function limitCheckboxes() {
    const checked = document.querySelectorAll('.extra-free:checked');
    document.querySelectorAll('.extra-free').forEach(c => c.disabled = (!c.checked && checked.length >= 3));
}

function addChefCombination() {
    const base = document.getElementById('custom-base');
    if(!base.value) return alert("Selecione um copo!");
    const price = parseFloat(base.value);
    const size = base.options[base.selectedIndex].text.split(' - ')[0];
    let extras = [];
    document.querySelectorAll('.extra-free:checked').forEach(e => extras.push(e.value));
    CART.push({ name: `Chef: ${size} (${extras.join(', ')})`, price });
    updateCartUI();
    alert("Adicionado!");
}

function applyCoupon() {
    const code = document.getElementById('coupon-input').value.toUpperCase();
    if(code === "PRIME10") {
        discountFactor = 0.10;
        alert("Desconto de 10% aplicado!");
    } else {
        discountFactor = 0;
        alert("Cupom inválido!");
    }
    updateCartUI();
}

function updateCartUI() {
    const flow = document.getElementById('cart-items-flow');
    const bairro = document.getElementById('bairro-select').value;
    const taxa = DB.config.taxas[bairro] || 0;
    
    flow.innerHTML = CART.map((item, i) => `
        <div class="cart-item">
            <span>${item.name}</span>
            <i class="fas fa-trash" onclick="remove(${i})" style="color:red; cursor:pointer"></i>
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
    statusEl.innerHTML = aberto ? `<span style="color:#25d366">● Aberto</span>` : `<span style="color:red">● Fechado</span>`;
}

function sendToWhatsApp() {
    const bairro = document.getElementById('bairro-select').value;
    if(bairro === "0") return alert("Escolha o bairro!");
    if(CART.length === 0) return alert("Carrinho vazio!");

    let msg = `*NOVO PEDIDO - AÇAÍ PRIME*%0A`;
    CART.forEach(i => msg += `- ${i.name} (R$ ${i.price.toFixed(2)})%0A`);
    msg += `%0A*Bairro:* ${bairro}%0A*Pagamento:* ${document.getElementById('payment-method').value}%0A*TOTAL:* ${document.getElementById('cart-total').innerText}`;
    window.open(`https://wa.me/${DB.config.whatsApp}?text=${msg}`);
}