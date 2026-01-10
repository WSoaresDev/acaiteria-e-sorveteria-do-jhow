const DB = {
    products: [
        { id: 1, cat: 'acai', name: "Açaí Tradicional Prime", desc: "Açaí puro. Monte do seu jeito.", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:18}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] },
        { id: 2, cat: 'sorvete', name: "Sorvete Prime", desc: "Cremoso. Escolha até 2 sabores.", img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500", 
            options: [{s:"200ml", p:10}, {s:"300ml", p:12}, {s:"400ml", p:16}, {s:"500ml", p:20}, {s:"770ml", p:22}, {s:"1 Litro", p:31}] },
        { id: 3, cat: 'casadinho', name: "Açaí com Sorvete", desc: "O mix perfeito (1 sabor de cada).", img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", 
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
        whatsApp: "5521968896846", 
        taxas: { "Nova Belém": 5.00, "Chacrinha": 7.00, "Beira Rio": 4.00, "0": 0 }
    }
};

let CART = [];
let tempItem = null;

document.addEventListener('DOMContentLoaded', () => {
    if(typeof AOS !== 'undefined') AOS.init();
    renderProducts('todos');
    setTimeout(() => { 
        const loader = document.getElementById('loader');
        if(loader) loader.style.display = 'none'; 
    }, 800);
});

function renderProducts(cat) {
    const list = document.getElementById('product-list');
    if (!list) return;
    const filtered = cat === 'todos' ? DB.products : DB.products.filter(p => p.cat === cat);

    list.innerHTML = filtered.map(p => {
        const isSingle = (p.cat === 'picole' || p.cat === 'bebida');
        let sizeHtml = '';

        if (!isSingle) {
            sizeHtml = `<div class="size-options-container" id="sizes-container-${p.id}">`;
            p.options.forEach((opt, idx) => {
                // Se for 500ml, coloca o selo
                const selo = opt.s === "500ml" ? '<span class="badge-mais-vendido">🔥 TOP</span>' : '';
                // O primeiro item (idx === 0) vem marcado por padrão
                sizeHtml += `
                    <div class="size-option ${idx === 0 ? 'selected' : ''}" 
                         onclick="selectSize(this, ${p.id}, ${opt.p}, '${opt.s}')">
                        ${selo}
                        <span class="size-name">${opt.s}</span>
                        <span class="size-price">R$ ${opt.p.toFixed(2)}</span>
                    </div>`;
            });
            sizeHtml += `</div>`;
        }

        return `
        <div class="p-card" data-aos="fade-up">
            <img src="${p.img}" class="p-img">
            <div class="p-info">
                <h3 class="p-title">${p.name}</h3>
                <p class="p-desc">${p.desc}</p>
                ${sizeHtml}
                <button class="btn-add" id="btn-add-${p.id}" 
                    data-price="${p.options[0].p}" 
                    data-label="${p.options[0].s}"
                    onclick="initPersonalization(${p.id})">
                    ${isSingle ? 'Adicionar R$ ' + p.options[0].p.toFixed(2) : 'Montar Copo'}
                </button>
            </div>
        </div>`;
    }).join('');
}

// Função para gerenciar a seleção visual
function selectSize(element, productId, price, label) {
    // Remove 'selected' de todos no mesmo container
    const container = document.getElementById(`sizes-container-${productId}`);
    container.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    
    // Adiciona no clicado
    element.classList.add('selected');
    
    // Guarda o valor selecionado temporariamente num atributo do botão de adicionar
    const addBtn = document.getElementById(`btn-add-${productId}`);
    addBtn.setAttribute('data-price', price);
    addBtn.setAttribute('data-label', label);
}

function initPersonalization(id) {
    const p = DB.products.find(i => i.id === id);
    const addBtn = document.getElementById(`btn-add-${id}`);
    
    // Pega o preço e tamanho (Garante que se for nulo, pega o primeiro da lista)
    let price = parseFloat(addBtn.getAttribute('data-price')) || p.options[0].p;
    let sizeLabel = addBtn.getAttribute('data-label') || p.options[0].s;

    // 1. Se for Picolé ou Bebida, adiciona direto
    if(p.cat === 'picole' || p.cat === 'bebida') {
        CART.push({ name: `*${p.name} (${sizeLabel})*`, price: price });
        updateCartUI();
        toggleCart();
        return;
    }

    // 2. Se for Açaí ou Sorvete, prepara a montagem
    tempItem = { name: p.name, size: sizeLabel, price: price, cat: p.cat };
    
    // Reseta todos os campos antes de abrir
    document.querySelectorAll('.builder-body input[type="checkbox"]').forEach(c => { 
        c.checked = false; 
        c.disabled = false; 
    });

    // Configura os textos e visibilidade das etapas
    const stepAcai = document.getElementById('step-sabores-acai');
    const stepSorvete = document.getElementById('step-sabores-sorvete');

    stepAcai.style.display = (p.cat === 'acai' || p.cat === 'casadinho') ? 'block' : 'none';
    stepSorvete.style.display = (p.cat === 'sorvete' || p.cat === 'casadinho') ? 'block' : 'none';

    // Define os limites baseados no produto
    let limiteAcai = 1;
    let limiteSorvete = (p.cat === 'sorvete') ? 2 : 1;
    let limiteAcomp = 5;

    // Atualiza os títulos das etapas com os limites
    if(stepAcai) stepAcai.querySelector('.step-title').innerHTML = `<span class="numb">1</span> Escolha seu Açaí (Máx: ${limiteAcai})`;
    if(stepSorvete) stepSorvete.querySelector('.step-title').innerHTML = `<span class="numb">2</span> Escolha o Sorvete (Máx: ${limiteSorvete})`;

    // Reatribui as funções de limite para garantir que funcionem
    document.querySelectorAll('.extra-sabor-acai').forEach(el => el.onchange = () => limitChecks('extra-sabor-acai', limiteAcai));
    document.querySelectorAll('.extra-sabor-sorvete').forEach(el => el.onchange = () => limitChecks('extra-sabor-sorvete', limiteSorvete));
    document.querySelectorAll('.extra-free').forEach(el => el.onchange = () => limitChecks('extra-free', limiteAcomp));
    document.querySelectorAll('.extra-calda').forEach(el => el.onchange = () => limitChecks('extra-calda', 1));

    // Mostra a tela e joga o foco nela
    document.getElementById('selected-product-name').innerText = `${p.name} (${sizeLabel})`;
    const builderSection = document.getElementById('monte-seu');
    builderSection.style.display = 'block';
    
    // Scroll suave para o início da montagem
    builderSection.scrollIntoView({ behavior: 'smooth' });
}

function cancelSelection() {
    document.getElementById('monte-seu').style.display = 'none';
}

function limitChecks(className, limit) {
    const checked = document.querySelectorAll(`.${className}:checked`);
    document.querySelectorAll(`.${className}`).forEach(c => {
        c.disabled = (!c.checked && checked.length >= limit);
    });
}

function confirmChefItem(finishOrder) {
    let acai = []; document.querySelectorAll('.extra-sabor-acai:checked').forEach(e => acai.push(e.value));
    let sorvete = []; document.querySelectorAll('.extra-sabor-sorvete:checked').forEach(e => sorvete.push(e.value));
    let extras = []; document.querySelectorAll('.extra-free:checked').forEach(e => extras.push(e.value));
    let caldas = []; document.querySelectorAll('.extra-calda:checked').forEach(e => caldas.push(e.value));

    // Validações
    if((tempItem.cat === 'acai' || tempItem.cat === 'casadinho') && acai.length === 0) return alert("Escolha o Açaí!");
    if((tempItem.cat === 'sorvete' || tempItem.cat === 'casadinho') && sorvete.length === 0) return alert("Escolha o Sorvete!");
    if(extras.length === 0) return alert("Escolha pelo menos 1 acompanhamento!");

    // FORMATANDO A DESCRIÇÃO PARA FICAR FÁCIL DE LER
    let desc = `*${tempItem.name} (${tempItem.size})*`; 
    
    if(acai.length) desc += `\n🟣 *Açaí:* ${acai.join(', ')}`;
    if(sorvete.length) desc += `\n🍦 *Sorvete:* ${sorvete.join(', ')}`;
    if(extras.length) desc += `\n🥜 *Acomp:* ${extras.join(', ')}`;
    if(caldas.length) desc += `\n🍯 *Cobertura:* ${caldas.join(', ')}`;

    CART.push({ name: desc, price: tempItem.price });
    updateCartUI();
    cancelSelection();
    if(finishOrder) toggleCart();
}

function cancelSelection() {
    document.getElementById('monte-seu').style.display = 'none';
    tempItem = null;
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
        <div class="cart-item">
            <p style="font-size:0.85rem; margin:0;">${item.name}</p>
            <div style="display:flex; justify-content:space-between;">
                <b>R$ ${item.price.toFixed(2)}</b>
                <button onclick="remove(${i})" style="border:none; background:none; color:red; cursor:pointer;"><i class="fas fa-trash"></i></button>
            </div>
        </div><hr>`).join('');

    const sub = CART.reduce((a, b) => a + b.price, 0);
    document.getElementById('subtotal').innerText = `R$ ${sub.toFixed(2)}`;
    document.getElementById('delivery-fee').innerText = `R$ ${taxa.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `R$ ${(sub + taxa).toFixed(2)}`;
    document.getElementById('cart-count').innerText = CART.length;
}

function remove(i) { CART.splice(i, 1); updateCartUI(); }
function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('active'); }

function updateCartUI() {
    const flow = document.getElementById('cart-items-flow');
    const bairro = document.getElementById('bairro-select').value;
    const taxa = DB.config.taxas[bairro] || 0;
    
    // Atualiza contador de itens no ícone
    document.getElementById('cart-count').innerText = CART.length;

    if (CART.length === 0) {
        flow.innerHTML = '<p style="text-align:center; padding:20px; opacity:0.5;">Seu carrinho está vazio...</p>';
    } else {
        flow.innerHTML = CART.map((item, i) => `
            <div class="cart-item">
                <div style="flex:1">
                    <p style="font-size:0.85rem; margin:0; font-weight:600;">${item.name}</p>
                    <b>R$ ${item.price.toFixed(2)}</b>
                </div>
                <button onclick="removeItem(${i})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; padding:5px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    const subtotal = CART.reduce((acc, cur) => acc + cur.price, 0);
    const total = subtotal + taxa;

    document.getElementById('subtotal').innerText = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').innerText = `R$ ${taxa.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
}

function removeItem(index) {
    CART.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function sendToWhatsApp() {
    if (CART.length === 0) return alert("Seu carrinho está vazio!");
    
    const bairro = document.getElementById('bairro-select').value;
    const rua = document.getElementById('end-rua').value;
    const num = document.getElementById('end-numero').value;
    const ref = document.getElementById('end-ref').value;

    if (bairro === "0" || !rua || !num) {
        return alert("Por favor, preencha o endereço completo!");
    }

    let msg = `*NOVO PEDIDO - AÇAÍ DO JHOW*\n`;
    msg += `------------------------------\n`;
    
    CART.forEach(item => {
        msg += `${item.name}\n*Subtotal:* R$ ${item.price.toFixed(2)}\n\n`;
    });

    msg += `------------------------------\n`;
    msg += `📍 *ENTREGA:* ${rua}, nº ${numero}\n`;
    msg += `🏘️ *Bairro:* ${bairro}\n`;
    msg += `🚩 *Ref:* ${referencia}\n\n`;
    msg += `*TOTAL COM ENTREGA:* R$ ${totalGeral}`;

    const url = `https://api.whatsapp.com/send?phone=${DB.config.whatsApp}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}