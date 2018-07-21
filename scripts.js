// ======================
//    Event Listeners
// ======================

$(document).ready(getLocalStorage);
$('.js-save-btn').click(checkInputs);
$('.js-title-input').on('keyup', enableSave);
$('.js-body-input').on('keyup', enableSave);

// ======================
//       Functions
// ======================
//     On Page Load
// ======================

function getLocalStorage() {
  var currentCollection = JSON.parse(localStorage.getItem('collection'));
  refreshCard(currentCollection);
};

function refreshCard(currentCollection) {
  currentCollection.forEach(function(listItemInstance) {
    prependCard(listItemInstance);
  });
};

function prependCard(cardInfo) {
  var listCard = `<article aria-label="To do list item" data-id=${cardInfo.id} class="card-container">
              <h2 class="title-of-card">${cardInfo.title}</h2>
              <button class="delete-button" onclick="deleteListItem(event)"></button>
              <p class="body-of-card">${cardInfo.body}</p>
              <button class="upvote"></button>
              <button class="downvote"></button>
              <p class="quality">importance: <span class="qualityVariable">${cardInfo.importance}</span></p>
              <hr>
            </article>`
    $('.js-bottom-box').prepend(listCard);
}

// ======================
//   Making a New Card
// ======================

function checkInputs(event) {
  event.preventDefault();
  var titleValue = $('.js-title-input').val().trim();
  var bodyValue = $('.js-body-input').val().trim();
  newCard(titleValue, bodyValue);
};

function ListItem(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.importance = 'Normal';
}

ListItem.prototype.changeImportance = function() {
  var possibleImport = ['None', 'Low', 'Normal', 'High', 'Critical'];
}

function newCard(titleValue, bodyValue) {
    var listItem = new ListItem(titleValue, bodyValue);
    prependCard(listItem);
    updateLocalStorage(listItem);
    clearInputs();
    $('.js-save-btn').prop('disabled', true);
};

function clearInputs() {
  $('.js-create-card')[0].reset();
};

function enableSave() {
  var titleInput = $('.js-title-input').val().trim();
  var bodyInput = $('.js-body-input').val().trim();
  var isDisabled = (!titleInput || !bodyInput);
  $('.js-save-btn').prop('disabled', isDisabled);
};

// ================================
//  Saving a Task to Local Storage
// ================================

function initialCard(listItem) {
  var collection = [];
  collection.push(listItem);
  localStorage.setItem('collection', JSON.stringify(collection));
};

function updateLocalStorage(listItem) {
  if (!localStorage.length) {
    initialCard(listItem);
  } else {
    var currentCollection = JSON.parse(localStorage.getItem('collection'));
    currentCollection.push(listItem);
    localStorage.setItem('collection', JSON.stringify(currentCollection));
  };
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
  var currentCollection = JSON.parse(localStorage.getItem('collection'));
  var newCollection = currentCollection.filter(function(listItem) {
     return listItem.id !== parseInt(deleteId);
  });
  localStorage.setItem('collection', JSON.stringify(newCollection));
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