const updateBtn = document.querySelector('#update');
const deleteBtn = document.querySelector('#delete');

updateBtn.addEventListener('click', () => {
  window.location.assign(`${window.location.pathname}/update`);
});

deleteBtn.addEventListener('click', () => {
  window.location.assign(`${window.location.pathname}/delete`);
});
