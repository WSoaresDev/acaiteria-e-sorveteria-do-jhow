const DB = {
    products: [
        { id: 1, cat: 'acai', name: "Açaí Tradicional Prime", desc: "Açaí puro. Monte do seu jeito.", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] },
        { id: 2, cat: 'sorvete', name: "Sorvete Prime", desc: "Diversos sabores cremosos.", img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:20}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] },
        { id: 3, cat: 'casadinho', name: "Açaí com Sorvete", desc: "O mix perfeito de energia e cremosidade.", img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] },
        { id: 4, cat: 'picole', name: "Picolé Leite Condensado", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 5, cat: 'picole', name: "Picolé Milho Verde", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 6, cat: 'picole', name: "Picolé de Coco", desc: "Refrescante", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500", options: [{s:"Unidade", p:3.00}] },
        { id: 7, cat: 'picole', name: "Picolé Brigadeiro Skimo", desc: "Cobertura de chocolate", img: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=500", options: [{s:"Unidade", p:6.00}] },
        { id: 10, cat: 'bebida', name: "Água com Gás", desc: "500ml", img: "https://images.unsplash.com/photo-1559839914-17aae19cea9e?w=500", options: [{s:"Unidade", p:4.00}] },
        { id: 11, cat: 'bebida', name: "Coca Cola 600ml", desc: "Gelada", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:8.00}] },
        { id: 12, cat: 'bebida', name: "Guaracamp", desc: "Copo tradicional", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500", options: [{s:"Unidade", p:2.00}] }
    ],
    config: {
        whatsApp: "5511999998888",
        taxas: { "Nova Belém": 5.00, "Chacrinha": 7.00, "Beira Rio": 4.00, "0": 0 }
    }
};

let CART = [];
let tempItem = null;

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();
    renderProducts('todos');
    setTimeout(() => { document.getElementById('loader').style.display = 'none'; }, 800);
});

function renderProducts(cat) {
    const list = document.getElementById('product-list');
    const filtered = cat === 'todos' ? DB.products : DB.products.filter(p => p.cat === cat);
    list.innerHTML = filtered.map(p => {
        const isSingle = (p.cat === 'picole' || p.cat === 'bebida');
        return `
        <div class="p-card" data-aos="fade-up">
            <img src="${p.img}" class="p-img">
            <div class="p-info">
                <h3 class="p-title">${p.name}</h3>
                <p class="p-desc">${p.desc}</p>
                <select id="size-${p.id}" class="p-selector" style="${isSingle ? 'display:none' : ''}">
                    ${p.options.map(o => `<option value="${o.p}">${o.s} - R$ ${o.p.toFixed(2)}</option>`).join('')}
                </select>
                <button class="btn-add" onclick="initPersonalization(${p.id})">
                    ${isSingle ? 'Adicionar R$ ' + p.options[0].p.toFixed(2) : 'Escolher e Montar'}
                </button>
            </div>
        </div>`;
    }).join('');
}

function initPersonalization(id) {
    const p = DB.products.find(i => i.id === id);
    const sel = document.getElementById(`size-${id}`);
    const price = parseFloat(sel.value);
    const sizeLabel = p.options.length > 1 ? sel.options[sel.selectedIndex].text.split(' - ')[0] : "";
    if(p.cat === 'picole' || p.cat === 'bebida') {
        CART.push({ name: p.name, price: price });
        updateCartUI();
        toggleCart();
        return;
    }
    tempItem = { name: p.name, size: sizeLabel, price: price, cat: p.cat };
    document.getElementById('selected-product-name').innerText = `${p.name} ${sizeLabel}`;
    document.getElementById('monte-seu').style.display = 'block';
    document.getElementById('step-sabores-acai').style.display = (p.cat === 'acai' || p.cat === 'casadinho') ? 'block' : 'none';
    document.getElementById('step-sabores-sorvete').style.display = (p.cat === 'sorvete' || p.cat === 'casadinho') ? 'block' : 'none';
    document.getElementById('monte-seu').scrollIntoView({ behavior: 'smooth' });
}

function confirmChefItem(finishOrder) {
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

    if((tempItem.cat === 'acai' || tempItem.cat === 'casadinho') && saboresAcai.length === 0) return alert("Escolha o sabor do Açaí!");
    if((tempItem.cat === 'sorvete' || tempItem.cat === 'casadinho') && saboresSorvete.length === 0) return alert("Escolha o sabor do Sorvete!");

    let finalDesc = `${tempItem.name} (${tempItem.size})`;
    if(saboresAcai.length > 0) finalDesc += ` | Açaí: ${saboresAcai.join(',')}`;
    if(saboresSorvete.length > 0) finalDesc += ` | Sorvete: ${saboresSorvete.join(',')}`;
    if(extras.length > 0) finalDesc += ` | Extras: ${extras.join(',')}`;
    if(frutas.length > 0) finalDesc += ` | Frutas: ${frutas.join(',')}`;
    if(caldas.length > 0) finalDesc += ` | Calda: ${caldas.join(',')}`;

    CART.push({ name: finalDesc, price: tempItem.price });
    updateCartUI();
    cancelSelection();
    if(finishOrder) { toggleCart(); } else { document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' }); }
}

function cancelSelection() {
    document.getElementById('monte-seu').style.display = 'none';
    document.querySelectorAll('input[type="checkbox"]').forEach(c => { c.checked = false; c.disabled = false; });
    tempItem = null;
}

function limitChecks(className, limit) {
    const checked = document.querySelectorAll(`.${className}:checked`);
    document.querySelectorAll(`.${className}`).forEach(c => { c.disabled = (!c.checked && checked.length >= limit); });
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
        <div class="cart-item" style="border-bottom:1px solid #eee; padding:10px 0;">
            <div style="font-size:0.8rem; line-height:1.2;">${item.name}</div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top:5px;">
                <span>R$ ${item.price.toFixed(2)}</span>
                <span onclick="remove(${i})" style="color:red; cursor:pointer;"><i class="fas fa-trash"></i></span>
            </div>
        </div>`).join('');
    const sub = CART.reduce((a, b) => a + b.price, 0);
    document.getElementById('subtotal').innerText = `R$ ${sub.toFixed(2)}`;
    document.getElementById('delivery-fee').innerText = `R$ ${taxa.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `R$ ${(sub + taxa).toFixed(2)}`;
    document.getElementById('cart-count').innerText = CART.length;
}

function remove(i) { CART.splice(i, 1); updateCartUI(); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }

function sendToWhatsApp() {
    const bairro = document.getElementById('bairro-select').value;
    const rua = document.getElementById('end-rua').value;
    const numero = document.getElementById('end-numero').value;
    const ref = document.getElementById('end-ref').value;
    
    if(bairro === "0") return alert("Por favor, selecione o bairro!");
    if(rua.trim() === "") return alert("Por favor, digite o nome da rua!");
    if(numero.trim() === "") return alert("Por favor, digite o número da casa!");
    if(CART.length === 0) return alert("Seu carrinho está vazio!");

    let msg = `*NOVO PEDIDO - AÇAÍ PRIME*%0A%0A`;
    CART.forEach(i => msg += `• ${i.name} - R$ ${i.price.toFixed(2)}%0A`);
    msg += `%0A*Subtotal:* ${document.getElementById('subtotal').innerText}`;
    msg += `%0A*Entrega:* ${document.getElementById('delivery-fee').innerText}`;
    msg += `%0A*TOTAL:* ${document.getElementById('cart-total').innerText}`;
    msg += `%0A%0A*ENDEREÇO DE ENTREGA:*`;
    msg += `%0A*Bairro:* ${bairro}`;
    msg += `%0A*Rua:* ${rua}`;
    msg += `%0A*Número:* ${numero}`;
    if(ref) msg += `%0A*Ponto de Referência:* ${ref}`;

    window.open(`https://wa.me/${DB.config.whatsApp}?text=${msg}`);
}