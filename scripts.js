// ======================
//    Event Listeners
// ======================

$(document).ready(prependLocalStorage);
$('.js-title-input').on('keyup', enableSave);
$('.js-body-input').on('keyup', enableSave);
$('.js-save-btn').click(saveInputValues);

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

// ListItem.prototype.changeImportance = function(cardQuality, event) {
//   var possibleImport = ['None', 'Low', 'Normal', 'High', 'Critical'];
//   debugger;
//   currentIndex = possibleImport.inArray(cardQuality);
// }

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
    currentCollection.forEach(function(listItemInstance) {
      prependCard(listItemInstance);
    });
  };
};

function prependCard(cardInfo) {
  var listCard = `<article aria-label="To do list task" data-id=${cardInfo.id} class="card-container">
              <h2 class="title-of-card js-title-of-card" oninput="editCardText(event)" contenteditable>${cardInfo.title}</h2>
              <button class="delete-button" onclick="deleteListItem(event)"></button>
              <p class="body-of-card js-body-of-card" oninput="editCardText(event)" contenteditable>${cardInfo.body}</p>
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
    alert('Please enter a title and description for your idea.');
    return;
  } else {
    newCard(titleValue, bodyValue);
  };
};

function newCard(titleValue, bodyValue) {
    var listItem = new ListItem(titleValue, bodyValue);
    prependCard(listItem);
    addToLocalStorage(listItem);
    resetForm();
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
  // if (!localStorage.length) clearSearch();
};

function removeFromCollection(deleteId) {
  var currentCollection = parseLocalStorage();
  var newCollection = currentCollection.filter(function(listItem) {
     return listItem.id !== parseInt(deleteId);
  });
  stringifyNewCollection(newCollection);
};

// ===========================================
//  Editing a Task and Updating Local Storage
// ===========================================

function editCardText(event) {
  if (!$(event.target).text()) {
    alert('Please enter a title and description for your idea.');
    return;
  } else {
    var card = $(event.target).closest('article');
    var cardId = card.prop('dataset').id;
    updateLocalStorage(card, cardId);
  }
}

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
      listItem.title = card.children('.js-title-of-card').text();
      listItem.body = card.children('.js-body-of-card').text();
      listItem.importance = card.find('.js-quality').text();
    };
  });
  stringifyNewCollection(currentCollection);
};


// $('.save-btn').on('click', function(event) {
//     event.preventDefault();
//     if ($('#js-title-input').val() === "" || $('#js-body-input').val() === "") {
//        return false;
//     };

//     numCards++;
//     $( ".bottom-box" ).prepend(newCard('card' + numCards, $('#js-title-input').val(), $('#js-body-input').val(), qualityVariable));
//     localStoreCard();
//     $('form')[0].reset();
// });

// $(".bottom-box").on('click', function(event){
//     var currentQuality = $($(event.target).siblings('p.quality').children()[0]).text().trim();
//     var qualityVariable;

//     if (event.target.className === "upvote" || event.target.className === "downvote"){

//         if (event.target.className === "upvote" && currentQuality === "plausible"){
//             qualityVariable = "genius";
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "upvote" && currentQuality === "swill") {
//             qualityVariable = "plausible";
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "plausible") {
//             qualityVariable = "swill"
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "genius") {
//             qualityVariable = "plausible"
//             $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

//         } else if (event.target.className === "downvote" && currentQuality === "swill") {
//             qualityVariable = "swill";

//         } else if (event.target.className === "upvote" && currentQuality === "genius") {
//             qualityVariable = "genius";
//         }

//     var cardHTML = $(event.target).closest('.card-container');
//     var cardHTMLId = cardHTML[0].id;
//     var cardObjectInJSON = localStorage.getItem(cardHTMLId);
//     var cardObjectInJS = JSON.parse(cardObjectInJSON);

//     cardObjectInJS.quality = qualityVariable;

//     var newCardJSON = JSON.stringify(cardObjectInJS);
//     localStorage.setItem(cardHTMLId, newCardJSON);
//     }

//     else if (event.target.className === "delete-button") {
//         var cardHTML = $(event.target).closest('.card-container').remove();
//         var cardHTMLId = cardHTML[0].id;
//         localStorage.removeItem(cardHTMLId);
//     }
// });