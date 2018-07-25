$(document).ready(prependLocalStorage);
$('.js-title-input').on('keyup', enableSave);
$('.js-body-input').on('keyup', enableSave);
$('.js-save-btn').on('click', saveInputValues);
$('.js-filter-btn').on('click', toggleFilterButton);
$('.js-filter-input').on('keyup', filterCards);
$('.js-show-complete').on('click', showComplete);
$('.js-show-more').on('click', showMore);
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
};

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
  if (currentCollection) {
    var sortedCollection = currentCollection.filter(function(listItem) {
      return listItem.complete === null;
    });

    printStorage(sortedCollection);
    checkForCompleted(currentCollection, sortedCollection);
  };
};

function checkForCompleted(collection, sorted) {
  if (collection.length !== sorted.length) {
    $('.js-show-complete').prop('disabled', '');
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
  var listCard = `<article aria-label="To do list task" class="card-container" data-id=${cardInfo.id}>
    <div class="card-header">
      <h2 aria-label="Click to edit your task title" class="title-of-card js-title" contenteditable>${cardInfo.title}</h2>
      <button aria-label="Click to delete task" class="delete-button" onclick="deleteListItem(event)"></button>
    </div>
    <p aria-label="Click to edit your task description" class="body-of-card js-body" contenteditable>${cardInfo.body}</p>
    <div class="card-footer">
      <div class="importance-voting">
        <button aria-label="Click to increase task importance" class="upvote" onclick="getCardQuality(event)"></button>
        <button aria-label="Click to decrease task importance" class="downvote" onclick="getCardQuality(event)"></button>
        <p aria-label="Task importance level" class="quality">importance: <span class="quality-variable js-quality">${cardInfo.importance}</span></p>
      </div>
      <a aria-label="Mark task complete" class="complete-button js-complete-button" onclick="toggleComplete(event)">Complete</a>
    </div>
  </article>`;

  $('.js-bottom-box').prepend(listCard);
  $('.js-title, .js-body').on('keydown', checkKey).on('blur', editCardText);
  printComplete(completed);
  hideExtras();
};

function printComplete(completed) {
  if (completed) $('.card-container').first().toggleClass('complete');
};

function hideExtras() {
  if ($('article').length > 10) {
    $('article').slice(10).hide();
    $('.js-show-more').prop('disabled', '');
  };
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
  var titleValue = $('.js-title-input').val().trim();
  var bodyValue = $('.js-body-input').val().trim();
  event.preventDefault();
  newCard(titleValue, bodyValue);
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
  if (event.which === 13 && !event.shiftKey) {
    $(event.target).blur();
  };
};

function editCardText(event) {
  if (!$(event.target).text()) {
    alert('Please refresh the page and enter a title and a description for your idea.');
    return;
  } else {
    var card = $(event.target).closest('article');
    var cardId = card.prop('dataset').id;
    $(event.target).text().trim();
    updateLocalStorage(card, cardId);
  };
};

function getCardQuality(event) {
  var card = $(event.target).closest('article');
  var cardId = card.prop('dataset').id;
  var qualityHtml = card.find('.js-quality').text();
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
      listItem.title = card.find('.js-title').text().trim();
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
  var card = $(event.target).closest('article');
  var deleteId = card.prop('dataset').id;
  card.remove();
  removeFromCollection(deleteId);
  if (!localStorage.length) resetFilter();
  if ($('article').length < 11) {
    $('.js-show-more').prop('disabled', true);
  };
};

function removeFromCollection(deleteId) {
  var currentCollection = parseLocalStorage();
  var newCollection = currentCollection.filter(function(listItem) {
    return listItem.id !== parseInt(deleteId);
  });

  if (!newCollection.length) {
    localStorage.clear();
  } else {
    stringifyNewCollection(newCollection);
  };
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
    checkContents(title, body, terms);
  });
};

function checkContents(title, body, terms) {
  if (title.includes(terms) || body.includes(terms)) {
    $(this).show();
  } else {
    $(this).hide();
  };
};

function resetFilter() {
  $('.js-filter-input').val('');
  $('.js-filter-input, .js-filter-btn').prop('disabled', true);
};

// ============================================================================
//   Filter by Importance Buttons
// ============================================================================

function toggleFilterButton(event) {
  var buttonQualities = [];
  var activeSiblings = $(event.target).siblings().filter(function(index) {
    return $(this).hasClass('active-filter');
  });

  $(event.target).toggleClass('active-filter');
  populateQualities(event, activeSiblings, buttonQualities);
};

function populateQualities(event, activeSiblings, buttonQualities) {
  if ($(event.target).hasClass('active-filter')) {
    buttonQualities.push($(event.target).text());
  };

  if (activeSiblings) {
    activeSiblings.each(function(index) {
      buttonQualities.push($(this).text());
    });
  };

  toggleCards(buttonQualities);
};

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

// ============================================================================
//   Marking a Task as Complete
// ============================================================================

function toggleComplete(event) {
  var currentCollection = parseLocalStorage();
  var task = $(event.target).closest('article');
  var taskId = task.prop('dataset').id;
  task.toggleClass('complete');
  setComplete(event, task, taskId, currentCollection);
};

function setComplete(event, task, taskId, currentCollection) {
  if (task.prop('className') === 'card-container complete') {
    storeCompleteProp(taskId, currentCollection);
  } else if (task.prop('className') === 'card-container') {
    storeIncomplete(taskId, currentCollection);
  };
};

function storeCompleteProp(taskId, currentCollection) {
  currentCollection.forEach(function(listItem) {
    if (listItem.id === parseInt(taskId)) {
      listItem.complete = true;
    };

    stringifyNewCollection(currentCollection);
  });
};

function storeIncomplete(taskId, currentCollection) {
  currentCollection.forEach(function(listItem) {
    if (listItem.id === parseInt(taskId)) {
      listItem.complete = null;
    };

    stringifyNewCollection(currentCollection);
  });
};

// ============================================================================
//   Show Completed Tasks
// ============================================================================

function showComplete(event) {
  var currentCollection = parseLocalStorage();
  event.preventDefault();
  prependComplete(currentCollection);
  disableCompleteTaskBtn();
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

function disableCompleteTaskBtn() {
  $('.js-show-complete').prop('disabled', true)
};

// ============================================================================
//   Show More Tasks
// ============================================================================

function showMore() {
  $('article').slice(10).show();
  $('.js-show-more').prop('disabled', true);
};