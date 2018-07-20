var importance = ['None', 'Low', 'Normal', 'High', 'Critical'];


$('.save-btn').on('click', function(event) {
  event.preventDefault();
  checkInputs();
  });
// $('#title-input').on('keyup', )
// $('#body-input').on('keyup', )

function checkInputs() {
  if (!$('.title-input').val().trim() || !$('.body-input').val().trim()) {
    alert('Please enter a title and description for your idea.');
    return;
  } else {
    newCard($('.title-input').val().trim(), $('.body-input').val().trim());
  };
};

function ListItem(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.importance = importance[2];
}

function newCard(title, body) {
    var listItem = new ListItem(title, body)
    var listCard = `<div aria-label="To do list item" id=${listItem.id} class="card-container">
              <h2 class="title-of-card">${listItem.title}</h2>
              <button class="delete-button"></button>
              <p class="body-of-card">${listItem.body}</p>
              <button class="upvote"></button>
              <button class="downvote"></button> 
              <p class="quality">importance: <span class="qualityVariable">${listItem.importance}</span></p>
              <hr>
            </div>`
    $('.bottom-box').append(listCard);
    saveInput(listItem);
};

function saveInput(listItem) {
    localStorage.setItem(listItem.id, JSON.stringify(listItem));
};

// $.each(localStorage, function(key) {
//     var cardData = JSON.parse(this);
//     $( ".bottom-box" ).prepend(newCard(key, cardData.title, cardData.body, cardData.quality));
// });

// $('.save-btn').on('click', function(event) {
//     event.preventDefault();
//     if ($('#title-input').val() === "" || $('#body-input').val() === "") {
//        return false;
//     };  

//     numCards++;
//     $( ".bottom-box" ).prepend(newCard('card' + numCards, $('#title-input').val(), $('#body-input').val(), qualityVariable)); 
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