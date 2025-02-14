// import { offertsData } from './tempData.js';
let offertsData = [];
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};

fetch("http://192.168.1.132:8053/api/OfertaDescuento/Lista", options)
  .then(res => {
    let offertsData = [];
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(response => {
    offertsData = response;
    console.log('Respuesta:', offertsData);
  })
  .catch(error => {
    console.error('Error en la petición:', error);
  });

const typeOfDiscount = document.getElementById('typeOfDiscount');

const horientation = document.getElementById('horientation');
const horientationDiv = document.getElementById('horientationDiv');

const itemsNumber = document.getElementById('itemsNumber');
const itemsNumberDiv = document.getElementById('itemsNumberDiv');

const search = document.getElementById('default-search');
const searchButton = document.getElementById('searchButton');
const searchDiv = document.getElementById('searchDiv');
const brandIconSwitch = document.getElementById('brandIconSwitch');
const colorSelector = document.getElementById('colorSelector');


const toolsButtonsDiv = document.getElementById('toolsButtonsDiv');
const preview = document.getElementById('preview');

typeOfDiscount.addEventListener('change', () => {
  if (typeOfDiscount.value !== "none") {
    horientationDiv.classList.remove('hidden');
  } else {
    horientationDiv.classList.add('hidden');
    itemsNumber.classList.add('hidden');
    searchDiv.classList.add('hidden');
    brandIconSwitch.classList.add('hidden');
    colorSelector.classList.add('hidden');
    toolsButtonsDiv.classList.add('hidden');
  }

});

horientation.addEventListener('change', () => {
  if (horientation.value !== "none") {
    itemsNumberDiv.classList.remove('hidden');

    let page = document.getElementById('page');

    if (!page) {
      page = document.createElement('div');
      page.id = 'page';
      preview.appendChild(page);
    } else {
      preview.removeChild(page);
      page = document.createElement('div');
      page.id = 'page';
      preview.appendChild(page);
    }

    page.classList.add(horientation.value, "page", "shadow-xl");

  } else{
    itemsNumberDiv.classList.add('hidden');
    searchDiv.classList.add('hidden');
    brandIconSwitch.classList.add('hidden');
    colorSelector.classList.add('hidden');
    toolsButtonsDiv.classList.add('hidden');
  }
});

itemsNumber.addEventListener('change', () => {
  if (itemsNumber.value !== "none") {
    searchDiv.classList.remove('hidden');
    brandIconSwitch.classList.remove('hidden');
    colorSelector.classList.remove('hidden');
    toolsButtonsDiv.classList.remove('hidden');

    let page = document.getElementById('page');

    page.classList.remove(...page.classList);
    page.classList.add(horientation.value, "page", "shadow-xl");
    page.classList.add(`${itemsNumber.value}-${horientation.value}`);

  } else{
    searchDiv.classList.add('hidden');
    brandIconSwitch.classList.add('hidden');
    colorSelector.classList.add('hidden');
    toolsButtonsDiv.classList.add('hidden');
  }
});

function searchOffert() {
  let searchValue = document.getElementById('default-search').value.trim();
  let searchResult = offertsData[0].ofertas.find(offert => offert.idOferta === searchValue);

  if (searchResult) {
      const offertList = searchResult.productos;
      let productListContainer = document.getElementById('previewContainer');

      // Eliminar modal existente antes de crear uno nuevo
      let existingModal = document.getElementById('productModal');
      if (existingModal) {
          productListContainer.removeChild(existingModal);
      }

      // Crear modal
      let productModal = document.createElement('div');
      productModal.id = 'productModal';
      productModal.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-gray-900', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');

      
      let productList = document.createElement('div');
      productList.classList.add('bg-white', 'w-2/3', 'h-auto', 'overflow-y-auto', 'p-4', 'rounded-lg', 'shadow-xl', 'relative');

      
      let closeButton = document.createElement('button');
      closeButton.classList.add('absolute', 'top-2', 'right-2', 'p-2', 'bg-red-500', 'text-white', 'rounded');
      closeButton.innerHTML = 'X';
      closeButton.addEventListener('click', () => {
          productListContainer.removeChild(productModal);
      });

      
      let productListTitle = document.createElement('h2');
      productListTitle.classList.add('text-lg', 'font-bold', 'mb-2');
      productListTitle.innerHTML = searchResult.nombreOferta;

      
      let productTable = document.createElement('table');
      productTable.classList.add('w-full', 'table-auto', 'border', 'mt-2');

      let tableHead = document.createElement('thead');
      tableHead.innerHTML = `
          <tr class="bg-gray-300">
              <th class="p-2 border">Seleccionar</th>
              <th class="p-2 border">Descripción</th>
              <th class="p-2 border">Precio Normal</th>
              <th class="p-2 border">Precio Oferta</th>
          </tr>
      `;
      productTable.appendChild(tableHead);

      let tableBody = document.createElement('tbody');
      offertList.forEach((product, index) => {
          let row = document.createElement('tr');
          row.classList.add('border');

          let checkboxCell = document.createElement('td');
          let checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = index;
          checkbox.classList.add('mx-2', 'product-checkbox');
          checkbox.dataset.productIndex = index;
          checkboxCell.appendChild(checkbox);

          let descriptionCell = document.createElement('td');
          descriptionCell.textContent = product.descripcion;

          let priceStandardCell = document.createElement('td');
          priceStandardCell.textContent = `$${product.precioStandard.toFixed(2)}`;

          let priceOfferCell = document.createElement('td');
          priceOfferCell.textContent = `$${product.precioOferta.toFixed(2)}`;

          row.appendChild(checkboxCell);
          row.appendChild(descriptionCell);
          row.appendChild(priceStandardCell);
          row.appendChild(priceOfferCell);
          tableBody.appendChild(row);
      });

      productTable.appendChild(tableBody);


      let acceptButton = document.createElement('button');
      acceptButton.classList.add('mt-4', 'p-2', 'bg-green-500', 'text-white', 'rounded', 'block', 'w-full');
      acceptButton.innerHTML = 'Aceptar';
      acceptButton.addEventListener('click', () => {
          addSelectedProductsToPage(searchResult);
          productListContainer.removeChild(productModal);
      });


      productList.appendChild(closeButton);
      productList.appendChild(productListTitle);
      productList.appendChild(productTable);
      productList.appendChild(acceptButton);
      productModal.appendChild(productList);
      productListContainer.appendChild(productModal);
  } else {
      alert("No se encontró ninguna oferta con ese ID.");
  }
}

function addSelectedProductsToPage(offer) {
  let selectedCheckboxes = document.querySelectorAll('.product-checkbox:checked');
  let page = document.getElementById('page');

  selectedCheckboxes.forEach(checkbox => {
      let product = offer.productos[checkbox.dataset.productIndex];

      let productCard = document.createElement('div');
      productCard.classList.add('bg-white', 'w-full', 'h-full', 'items-center');


      let titleDiv = document.createElement('div');
      let title = document.createElement('h1');
      title.classList.add('text-4xl', 'font-black', 'text-white', 'bg-red-500', 'p-6', 'text-center');
      title.innerHTML = `OFERTA`;
      titleDiv.appendChild(title);

      
      let priceDiv = document.createElement('div');
      priceDiv.classList.add('flex', 'justify-center', 'items-center', 'mt-2', 'py-4', 'px-6', 
        'gap-8'
      );
      let normalPrice = document.createElement('h2');
      normalPrice.innerHTML = `Antes: <br><strong class="line-through text-3xl w-full text-red-500">$${product.precioStandard.toFixed(2)}</strong>`;
      let offerPrice = document.createElement('h2');
      offerPrice.innerHTML = `Precio de Oferta: <br><strong class=" text-3xl w-full">$${product.precioOferta.toFixed(2)}</strong>`;
      priceDiv.appendChild(normalPrice);
      priceDiv.appendChild(offerPrice);

      
      let detailsDiv = document.createElement('div');
      detailsDiv.classList.add('flex', 'flex-col', 'items-center', 'mt-2', 'py-4', 'px-6');
      let productId = document.createElement('h3');
      productId.innerHTML = `${product.codigo}`;
      let productDesc = document.createElement('h3');
      productDesc.classList.add('text-bold', 'text-xl');
      productDesc.innerHTML = product.descripcion;
      detailsDiv.appendChild(productId);
      detailsDiv.appendChild(productDesc);

      
      let image = document.createElement('img');
      image.src = `./src/${product.marcaCodigo}`;
      image.classList.add('w-full', 'h-[15%]', 'object-cover', 'mt-2');

      
      let validityDiv = document.createElement('div');
      let validityText = document.createElement('p');
      validityText.classList.add('text-sm', 'text-gray-600', 'text-center', 'items-center');
      validityText.innerHTML = `Válido desde <strong>${offer.fechaInicial}</strong> al <strong>${offer.fechaFinal}</strong>`;
      validityDiv.appendChild(validityText);

      
      productCard.appendChild(titleDiv);
      productCard.appendChild(priceDiv);
      productCard.appendChild(detailsDiv);
      productCard.appendChild(image);
      productCard.appendChild(validityDiv);


      page.appendChild(productCard);
  });
}

document.getElementById('searchButton').addEventListener('click', searchOffert);