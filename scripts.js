// ======================
//    Event Listeners
// ======================

$(document).ready(prependLocalStorage);
// $(document).on('click', checkSource);
$('.js-title-input').on('keyup', enableSave);
$('.js-body-input').on('keyup', enableSave);
$('.js-save-btn').on('click', saveInputValues);
$('.js-filter-input').on('keyup', filterCards);

// ======================
//       Functions
// ===============================================
//   Constructor Functions and Prototype Methods
// ===============================================

function ListItem(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.importance = 'Normal';
}

// ===============================
//   Local Storage - get and set
// ===============================

function stringifyNewCollection(newCollection) {
  localStorage.setItem('collection', JSON.stringify(newCollection));
}

function parseLocalStorage() {
  return JSON.parse(localStorage.getItem('collection'));
};

// ======================
//     On Page Load
// ======================

function prependLocalStorage() {
  var currentCollection = parseLocalStorage();
  if (currentCollection) {
    enableFilter();
    currentCollection.forEach(function(listItemInstance) {
      prependCard(listItemInstance);
    });
  };
};

function prependCard(cardInfo) {
  var listCard = `<article aria-label="To do list task" data-id=${cardInfo.id} class="card-container">
              <h2 class="title-of-card js-title" onkeydown="checkKey(event)" contenteditable>${cardInfo.title}</h2>
              <button class="delete-button" onclick="deleteListItem(event)"></button>
              <p class="body-of-card js-body" onkeydown="checkKey(event)" contenteditable>${cardInfo.body}</p>
              <button class="upvote" onclick="getQuality(event)"></button>
              <button class="downvote" onclick="getQuality(event)"></button>
              <p class="quality">importance: <span class="quality-variable js-quality">${cardInfo.importance}</span></p>
              <hr>
            </article>`
    $('.js-bottom-box').prepend(listCard);
}

// ======================
//   Making a New Card
// ======================

function enableSave() {
  var titleInput = $('.js-title-input').val().trim();
  var bodyInput = $('.js-body-input').val().trim();
  var isDisabled = (!titleInput || !bodyInput);
  $('.js-save-btn').prop('disabled', isDisabled);
};

function saveInputValues(event) {
  event.preventDefault();
  var titleValue = $('.js-title-input').val().trim();
  var bodyValue = $('.js-body-input').val().trim();
  checkInputs(titleValue, bodyValue);
}

function checkInputs(titleValue, bodyValue) {
  if (!titleValue || !bodyValue) {
    alertEmpty();
  } else {
    newCard(titleValue, bodyValue);
  };
};

function alertEmpty() {
  alert('Please enter a title and description for your idea.');
  return;
}

function newCard(titleValue, bodyValue) {
    var listItem = new ListItem(titleValue, bodyValue);
    prependCard(listItem);
    addToLocalStorage(listItem);
    resetForm();
    enableFilter();
};

function resetForm() {
  $('.js-create-card')[0].reset();
  $('.js-save-btn').prop('disabled', true);
};

// ================================
//  Saving a Task to Local Storage
// ================================

function addToLocalStorage(listItem) {
  if (!localStorage.length) {
    initialCard(listItem);
  } else {
    var currentCollection = parseLocalStorage();
    currentCollection.push(listItem);
    stringifyNewCollection(currentCollection);
  };
};

function initialCard(listItem) {
  var firstCollection = [];
  firstCollection.push(listItem);
  stringifyNewCollection(firstCollection);
};

// ====================================
//  Removing a Task from Local Storage
// ====================================

function deleteListItem(event) {
  var card = $(event.target).parent();
  var deleteId = card.prop('dataset').id;
  card.remove();
  removeFromCollection(deleteId);
  if (!localStorage.length) resetFilter();
};

function removeFromCollection(deleteId) {
  var currentCollection = parseLocalStorage();
  var newCollection = currentCollection.filter(function(listItem) {
     return listItem.id !== parseInt(deleteId);
  });
  !newCollection.length ? localStorage.clear() : stringifyNewCollection(newCollection);
};

// ===========================================
//  Editing a Task and Updating Local Storage
// ===========================================

function checkKey(event) {
  if (trueEnter(event)) {
    editCardText(event);
  }
}

function trueEnter(event) {
  if (event.which === 13 && event.shiftKey === false) {
    $(event.target).blur();
    return true;
  }
}

// function checkSource(event) {
//   if (event !== undefined) {
//     return $(event.target);
//   }
// }

function editCardText(event) {
  if (!$(event.target).text()) {
    alertEmpty()
  } else {
    var card = $(event.target).closest('article');
    var cardId = card.prop('dataset').id;
    updateLocalStorage(card, cardId);
  };
};

function getQuality(event) {
  var card = $(event.target).closest('article');
  var cardId = card.prop('dataset').id;
  var qualityHtml = card.find('.js-quality').text()
  var possibleImport = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var currIndex = jQuery.inArray(qualityHtml, possibleImport);
  setNewQuality(event, card, cardId, possibleImport, currIndex);
};

function setNewQuality(event, card, cardId, possibleImport, currIndex) {
  if ($(event.target).prop('className') === 'upvote') {
    upQuality(card, possibleImport, currIndex);
  } else {
    downQuality(card, possibleImport, currIndex);
  };
  updateLocalStorage(card, cardId);
};

function upQuality(card, possibleImport, currIndex) {
  possibleImport.forEach(function(element, index, array) {
    if ((index === currIndex) && (index < array.length - 1)) {
      card.find('.js-quality').text(`${possibleImport[currIndex + 1]}`);
    };
  });
};

function downQuality(card, possibleImport, currIndex) {
  possibleImport.forEach(function(element, index, array) {
    if ((index === currIndex) && (index > 0)) {
      card.find('.js-quality').text(`${possibleImport[currIndex - 1]}`);
    };
  });
};

function updateLocalStorage(card, cardId) {
  var currentCollection = parseLocalStorage();
  currentCollection.forEach(function(listItem) {
    if (listItem.id === parseInt(cardId)) {
      listItem.title = card.children('.js-title').text();
      listItem.body = card.children('.js-body').text();
      listItem.importance = card.find('.js-quality').text();
    };
  });
  stringifyNewCollection(currentCollection);
};

// =========================
// Filter Bar functionality
// =========================

function enableFilter() {
  var isDisabled = (!localStorage.length);
  $('.js-filter-input').prop('disabled', isDisabled);
};

function filterCards() {
  var cards = $('article');
  cards.filter(function(index) {
    var terms = $('.js-filter-input').val().toLowerCase();
    var title = $(this).find('.js-title').text().toLowerCase();
    var body = $(this).children('.js-body').text().toLowerCase();
    title.includes(terms) || body.includes(terms) ? $(this).show() : $(this).hide();
  });
};

function resetFilter() {
  $('.js-filter-input').val('');
  $('.js-filter-input').prop('disabled', true);
};
































