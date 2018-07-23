$(document).ready(prependLocalStorage);
$('.js-title-input').on('keyup', enableSave);
$('.js-body-input').on('keyup', enableSave);
$('.js-save-btn').on('click', saveInputValues);
$('.js-filter-btn').on('click', toggleFilterButton);
$('.js-filter-input').on('keyup', filterCards);
$('.js-show-complete').on('click', showComplete);
// See prependCard() template literal, etc. for card-specific event listeners

// ============================================================================
//   Constructor Functions and Prototype Methods
// ============================================================================

function ListItem(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.importance = 'Normal';
  this.complete = null;
}

// ============================================================================
//   Local Storage - Get and Set
// ============================================================================

function stringifyNewCollection(newCollection) {
  localStorage.setItem('collection', JSON.stringify(newCollection));
};

function parseLocalStorage() {
  return JSON.parse(localStorage.getItem('collection'));
};

// ============================================================================
//   On Page Load
// ============================================================================

function prependLocalStorage() {
  var currentCollection = parseLocalStorage();
  if (currentCollection.length) {
    var sortedCollection = currentCollection.filter(function(listItem) {
      return listItem.complete === null
    });
    printStorage(sortedCollection);
  };
};

function printStorage(collection) {
  if (collection) {
    enableFilter();
    collection.forEach(function(listItemInstance) {
      prependCard(listItemInstance);
    });
  };
};

function prependCard(cardInfo, completed) {
  var cardID = cardInfo.id;
  var listCard = `<article aria-label="To do list task" data-id=${cardInfo.id} class="card-container">
    <h2 class="title-of-card js-title" contenteditable>${cardInfo.title}</h2>
    <button class="delete-button" onclick="deleteListItem(event)"></button>
    <p class="body-of-card js-body" contenteditable>${cardInfo.body}</p>
    <button class="upvote" onclick="getCardQuality(event)"></button>
    <button class="downvote" onclick="getCardQuality(event)"></button>
    <p class="quality">importance: <span class="quality-variable js-quality">${cardInfo.importance}</span></p>
    <button class="complete-button js-complete-button" aria-label="Mark task complete" onclick="toggleComplete(event)">Completed Task</button>
    <hr>
  </article>`
  $('.js-bottom-box').prepend(listCard);
  if (completed) {
    $('.card-container').first().toggleClass('complete')
};
  $('.js-title, .js-body').on('keydown', checkKey).on('blur', editCardText);
};

// ============================================================================
//   Creating a New Card
// ============================================================================

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
};

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

// ============================================================================
//   Saving a Card to Local Storage
// ============================================================================

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

// ============================================================================
//   Editing a Card and Updating Local Storage
// ============================================================================

function checkKey(event) {
  if (trueEnter(event)) editCardText(event);
};

function trueEnter(event) {
  if (event.which === 13 && event.shiftKey === false) {
    $(event.target).blur();
    return true;
  };
};

function editCardText(event) {
  if (!$(event.target).text()) {
    alertEmpty()
  } else {
    $(event.target).text().trim();
    var card = $(event.target).closest('article');
    var cardId = card.prop('dataset').id;
    updateLocalStorage(card, cardId);
  };
};

function getCardQuality(event) {
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
      listItem.title = card.children('.js-title').text().trim();
      listItem.body = card.children('.js-body').text().trim();
      listItem.importance = card.find('.js-quality').text();
    };
  });
  stringifyNewCollection(currentCollection);
};

// ============================================================================
//   Deleting a Card from Local Storage
// ============================================================================

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

// ============================================================================
//   Filter Bar
// ============================================================================

function enableFilter() {
  var isDisabled = (!localStorage.length);
  $('.js-filter-input, .js-filter-btn').prop('disabled', isDisabled);
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

// ============================================================================
//   Filter by Importance Buttons
// ============================================================================

function toggleFilterButton(event) {
  var buttonQualities = []
  var activeSiblings = $(event.target).siblings().filter(function(index) {
    return $(this).hasClass('active-filter');
  });
  $(event.target).toggleClass('active-filter');
  populateQualities(event, activeSiblings, buttonQualities);
};

function populateQualities(event, activeSiblings, buttonQualities) {
  if ($(event.target).hasClass('active-filter')) {
    buttonQualities.push($(event.target).text());
  }
  if (activeSiblings) {
    activeSiblings.each(function(index) {
      buttonQualities.push($(this).text());
    });
  };

  toggleCards(buttonQualities);
}

function toggleCards(buttonQualities) {
  var cards = $('article');
  if (!buttonQualities.length) {
    cardShow(cards);
  } else {
    cardFilter(cards, buttonQualities);
  };
};

function cardShow(cards) {
  cards.each(function(index) {
    $(this).show();
  });
};

function cardFilter(cards, buttonQualities) {
  cards.filter(function(index) {
    var cardQuality = $(this).find('span').text().toLowerCase();
    buttonQualities.includes(cardQuality) ? $(this).show() : $(this).hide();
  });
};

// =============================================================================
//    Marking a Task as Complete
// =============================================================================

function toggleComplete(event) {
  var currentCollection = parseLocalStorage();
  var task = $(event.target).parent();
  var taskID = task.prop('dataset').id
  task.toggleClass('complete');
  setComplete(event, task, taskID, currentCollection)
};

function setComplete(event, task, taskID, currentCollection) {
  if (task.prop('className') === 'card-container complete') {
     storeCompleteProp(taskID, currentCollection); 
    } else if (task.prop('className') === 'card-container') {
     storeIncomplete(taskID, currentCollection); 
    };
  };

function storeCompleteProp(taskID, currentCollection) {
  currentCollection.forEach(function(listItem) {
    if (listItem.id === parseInt(taskID)) {
      listItem.complete = true;
    };
    stringifyNewCollection(currentCollection);
  });
};

function storeIncomplete(taskID, currentCollection) {
  currentCollection.forEach(function(listItem) {
    if (listItem.id === parseInt(taskID)) {
      listItem.complete = null;
    };
    stringifyNewCollection(currentCollection);
  });
};

// ==========================================
//   Show Completed Tasks
// ==========================================

function showComplete(event) {
  event.preventDefault();
  var currentCollection = parseLocalStorage();
  prependComplete(currentCollection);
  disableCompleteTaskBtn(event);
};

function prependComplete(collection) {
  if (collection.length) {
    var completedTasks = collection.filter(function(listItem) {
     return listItem.complete === true;
    });
    completedTasks.forEach(function(listItem) {
      prependCard(listItem, true);
    });
  };
};

function disableCompleteTaskBtn(event) {
  $('.js-show-complete').prop('disabled', true)
};
