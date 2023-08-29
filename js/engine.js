


function initenprices(d = null) {

 
  languageNameSpace.initLanguage(REF.language);

  $("#links").empty();

  linksContent = 	"<div class='modalHeader'>"
  + '<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close">x</button>'
  + "<h5>" + languageNameSpace.labels["LINKS"] + "</h5>"
  + "</div>"
  + "<div>"
  + '<a href=\"https://ec.europa.eu/info/cookies_'+ REF.language.toLowerCase() +'\" target=\"_blank\" class="underline"><span>'+languageNameSpace.labels["COOKIES"]+'</span><svg viewBox="0 0 13 20"><polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" /></svg></a>'
  + "</div>"
  + "<div>"
  + '<a href=\"https://ec.europa.eu/info/privacy-policy_'+ REF.language.toLowerCase() +'\" target=\"_blank\" class="underline"><span>'+languageNameSpace.labels["PRIVACY"]+'</span><svg viewBox="0 0 13 20"><polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" /></svg></a>'
  + "</div>"
  + "<div>"
  + '<a href=\"https://ec.europa.eu/info/legal-notice_'+ REF.language.toLowerCase() +'\" target=\"_blank\" class="underline"><span>'+languageNameSpace.labels["LEGAL"]+'</span><svg viewBox="0 0 13 20"><polyline points="0.5 19.5 3 19.5 12.5 10 3 0.5" /></svg></a>'
  + "</div>"  
  + "<div>"
  + "</div>"

  endash()


}

function createForm(actionURL, nextURL) {
  // Create the form element
  const formElement = document.createElement("form");
  formElement.classList.add("d-none");
  formElement.name = "formDown";
  formElement.id = "formDown";
  formElement.autocomplete = "off";
  formElement.action = actionURL;
  formElement.method = "POST";

  // Create the card body
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create the message input group
  const messageInputGroup = document.createElement("div");
  messageInputGroup.classList.add("input-group", "mb-4", "input-group-static");
  
  // Create the label for the message textarea
  const messageLabel = document.createElement("label");
  messageLabel.classList.add("text-white");
  messageLabel.textContent = "Your message";

  // Create the message textarea
  const messageTextarea = document.createElement("textarea");
  messageTextarea.id = "message";
  messageTextarea.name = "message";
  messageTextarea.classList.add("form-control", "text-white");
  messageTextarea.rows = "4";
  messageTextarea.required = true;
  messageTextarea.textContent = `The ENPRICES tool is down since: ${new Date()}`;

  // Append the label and textarea to the input group
  messageInputGroup.appendChild(messageLabel);
  messageInputGroup.appendChild(messageTextarea);

  // Create hidden input elements
  const subjectInput = document.createElement("input");
  subjectInput.type = "hidden";
  subjectInput.name = "_subject";
  subjectInput.value = "ENPRICES is down";

  const captchaInput = document.createElement("input");
  captchaInput.type = "hidden";
  captchaInput.name = "_captcha";
  captchaInput.value = "false";

  const templateInput = document.createElement("input");
  templateInput.type = "hidden";
  templateInput.name = "_template";
  templateInput.value = "table";

  const nextInput = document.createElement("input");
  nextInput.type = "hidden";
  nextInput.name = "_next";
  nextInput.value = nextURL;

  // Create the submit button
  const submitButton = document.createElement("button");
  submitButton.id = "contactSend";
  submitButton.type = "submit";
  submitButton.name = "btnSubmit";
  submitButton.classList.add("btn", "bg-gradient-primary", "w-100");
  submitButton.textContent = "Send Message";

  // Append all elements to the form
  messageInputGroup.appendChild(messageLabel);
  messageInputGroup.appendChild(messageTextarea);

  cardBody.appendChild(messageInputGroup);
  cardBody.appendChild(subjectInput);
  cardBody.appendChild(captchaInput);
  cardBody.appendChild(templateInput);
  cardBody.appendChild(nextInput);
  cardBody.appendChild(submitButton);

  formElement.appendChild(cardBody);

  // Return the form element
  return formElement;
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  // Perform any additional form submission logic here if needed
  form.submit();
}

function submitFormDown() {
  const actionURL = "https://formsubmit.co/e466de393c51be5bb8265025772c5712";
  const nextURL = "https://ec.europa.eu/eurostat/cache/infographs/energy_prices/404.html";
  const formElement = createForm(actionURL, nextURL);
  formElement.addEventListener("submit", handleFormSubmit);
  document.getElementById("hiddenFormDiv").appendChild(formElement);
  $("#formDown").submit();
}

