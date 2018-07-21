// ======================
//   Global Variables
// ======================

// ======================
//    Event Listeners
// ======================

$('.js-save-btn').click(checkInputs);
$('#js-title-input').on('keyup', enableSave)
$('#js-body-input').on('keyup', enableSave)

// ======================
//       Functions
// ======================
//   Making a New Task
// ======================

function checkInputs(event) {
  event.preventDefault();
  if (!$('.js-title-input').val().trim() || !$('.js-body-input').val().trim()) {
    alert('Please enter a title and description for your idea.');
    return;
  } else {
    var titleValue = $('.js-title-input').val().trim();
    var bodyValue = $('.js-body-input').val().trim();
    newCard(titleValue, bodyValue);
  };
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
    var listCard = `<div aria-label="To do list item" id=${listItem.id} class="card-container">
              <h2 class="title-of-card">${listItem.title}</h2>
              <button class="delete-button"></button>
              <p class="body-of-card">${listItem.body}</p>
              <button class="upvote"></button>
              <button class="downvote"></button>
              <p class="quality">importance: <span class="qualityVariable">${listItem.importance}</span></p>
              <hr>
            </div>`
    $('.js-bottom-box').prepend(listCard);
    saveInput(listItem);
    clearInputs();
    $('.js-save-btn').prop('disabled', true);
};

function clearInputs() {
  $('.js-create-card')[0].reset();
};

function enableSave() {
  var titleInput = $('.js-title-input');
  var bodyInput = $('.js-body-input');
  var isDisabled = (!titleInput || !bodyInput);
  $('.js-save-btn').prop('disabled', isDisabled);
};


// ================================
//  Saving a Task to Local Storage
// ================================

function saveInput(listItem) {
    localStorage.setItem(listItem.id, JSON.stringify(listItem));
};

// $.each(localStorage, function(key) {
//     var cardData = JSON.parse(this);
//     $( ".bottom-box" ).prepend(newCard(key, cardData.title, cardData.body, cardData.quality));
// });

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