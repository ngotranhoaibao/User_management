let users = JSON.parse(localStorage.getItem("users")) || [];
const userOpenBtn = document.getElementById("add-user-button");
const userDialog = document.getElementById("user-dialog");
const userForm = document.getElementById("user-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const userDialogTitle = document.getElementById("dialog-title");
const userSubmitBtn = document.getElementById("submit-btn");
let editingUserId = null;

function saveUser() {
  localStorage.setItem("users", JSON.stringify(users));
}

function generateId() {
  return Date.now().toString();
}
userOpenBtn.addEventListener("click", () => openUserDialog());

function openUserDialog(id = null) {
  editingUserId = id;
  if (editingUserId) {
    const u = users.find((x) => x.id === editingUserId);
    if (!u) return;

    if (userDialogTitle) userDialogTitle.textContent = "Edit user";
    if (userSubmitBtn) userSubmitBtn.textContent = "Save changes";

    nameInput.value = u.name;
    emailInput.value = u.email;
    phoneInput.value = u.phone;
  } else {
    if (userDialogTitle) userDialogTitle.textContent = "Add user";
    if (userSubmitBtn) userSubmitBtn.textContent = "Create user";
    userForm.reset();
  }
  userDialog.show();
}

function closeUserDialog() {
  userDialog.close();
  userForm.reset();
  editingUserId = null;
}

//viết sự kiện submit cho dialogform
userDialog.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  let isValidate = true;
  if (name.length < 2) {
    document.getElementById("name-error").innerText =
      "Tên phải ≥ 2 ký tự";
    isValidate = false;
  }

  if (phone.length < 10 || phone.length > 11) {
    document.getElementById("phone-error").innerText =
      "SĐT phải 10–11 chữ số";
    isValidate = false;
  }
  if (!isValidate) return;

  if (editingUserId) {
    const idx = users.findIndex((u) => u.id === editingUserId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], name, email, phone };
    }
  } else {
    users.push({
      id: generateId(),
      name,
      email,
      phone,
    });
  }

  saveUser();
  closeUserDialog();
  renderUsers();
});

// Hiển thị danh sách
function renderUsers() {
  const usersGrid = document.getElementById("users-grid");
  const emptyState = document.getElementById("empty-state");
  const data = JSON.parse(localStorage.getItem("users")) || [];

  usersGrid.innerHTML = "";
  emptyState.innerHTML = "";

  if (data.length === 0) {
    emptyState.innerHTML = `
      <div class="empty-state">
        <h3>Chưa có người dùng nào</h3>
        <p>Hãy thêm người dùng đầu tiên của bạn!</p>
      </div>`;
    return;
  }

  usersGrid.innerHTML = data
    .map(
      (user) => `
        <div class="user-card">
          <h3>${user.name}</h3>
          <p>Email: ${user.email || ""}</p>
          <p>Phone: ${user.phone || ""}</p>
          <div class="user-actions">
            <button class="btn btn-primary" onclick="openUserDialog('${
              user.id
            }')">Edit</button>
            <button class="btn btn-danger" onclick="deleteUser('${
              user.id
            }')">Delete</button>
          </div>
        </div>
      `
    )
    .join("");
}

// Xoá user
function deleteUser(userId) {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return;

  const deleteModal = document.getElementById("delete-modal");
  const confirmDeleteBtn = document.getElementById("confirm-delete");
  const cancelBtn = document.getElementById("btn_cancel");

  deleteModal.show();

// hiện xác nhận xoá
  confirmDeleteBtn.onclick = () => {
    users.splice(userIndex, 1);
    saveUser();
    renderUsers();
    deleteModal.close();
  };
  if (cancelBtn) {
    cancelBtn.onclick = () => deleteModal.close();
  }
  deleteModal.onclick = (event) => {
    if (event.target === deleteModal) deleteModal.close();
  };
}

window.addEventListener("storage", function (event) {
  if (event.key === "users") {
    users = JSON.parse(event.newValue) || [];
    renderUsers();
  }
});

renderUsers();
