// tạo biến users để lưu trữ danh sách người dùng
let users = JSON.parse(localStorage.getItem("users")) || [];
//tạo hàm saveUser để lưu người dùng vào localStorage
function saveUser() {
  localStorage.setItem("users", JSON.stringify(users));
}
//tạo function generate Id để tạo id ngẫu nhiên cho người dùng theo định dạng date time
function generateId() {
  return Date.now().toString();
}
const openBtn = document.getElementById("add-user-button");
const userDialog = document.getElementById("user-dialog");
openBtn.addEventListener("click", () => userDialog.showModal());

//tạo function closeUserDialog để đóng hộp thoại thêm người dùng
function closeUserDialog() {
  userDialog.close();
  document.getElementById("user-form").reset();
}
// Viết sự kiện submit addUser để thêm người dùng addEventListener cho submit form
userDialog.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  let isValidate = true;

  // Reset lỗi trước
  document.getElementById("name-error").innerText = "";
  document.getElementById("email-error").innerText = "";
  document.getElementById("phone-error").innerText = "";

  //tạo Validate
  if (name.length < 2) {
    document.getElementById("name-error").innerText =
      "Name must be at least 2 characters";
    isValidate = false;
  }

  if (phone.length < 10 || phone.length > 11) {
    document.getElementById("phone-error").innerText =
      "Phone number must be between 10 and 11 digits";
    isValidate = false;
  }
  // Kiểm tra trùng tên và số điện thoại
  const isDuplicate = users.some(
    (user) =>
      user.name.toLowerCase() === name.toLowerCase() && user.phone === phone
  );

  if (isDuplicate) {
    document.getElementById("phone-error").innerText =
      "Người dùng với tên và số điện thoại này đã tồn tại";
    isValidate = false;
  }

  if (!isValidate) return;
  if (!isValidate) return;

  // Thêm người dùng mới
  users.push({
    id: generateId(),
    name,
    email,
    phone,
  });

  saveUser();
  closeUserDialog();
  renderUsers();
});

// renderUsers hiển thị danh sách người dùng
function renderUsers() {
  const usersGrid = document.getElementById("users-grid");
  const emptyState = document.getElementById("empty-state");
  const users = JSON.parse(localStorage.getItem("users")) || [];

  usersGrid.innerHTML = "";
  emptyState.innerHTML = "";

  // Kiểm tra nếu không có người dùng nào thì hiển thị trạng thái rỗng
  if (users.length === 0) {
    emptyState.innerHTML = `
      <div class="empty-state">
        <h3>Chưa có người dùng nào</h3>
        <p>Hãy thêm người dùng đầu tiên của bạn!</p>
      </div>`;
    return;
  }

  usersGrid.innerHTML = users
    .map(
      (user, index) => `
        <div class="user-card">
          <h3>${user.name}</h3>
          <p>Email: ${user.email}</p>
          <p>Phone: ${user.phone}</p>
          <div class="user-actions">
            <button class="btn btn-primary" >Edit</button>
            <button class="btn btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
          </div>
        </div>
      `
    )
    .join("");
}

//tạo function deleteUser để xóa người dùng
function deleteUser(userId) {
  //tạo biến userIndex để lưu lại id cần xóa
  const userIndex = users.findIndex((u) => u.id === userId);
  //lọc mảng users để xóa người dùng có id trùng với userId
  users.splice(userIndex, 1);
  //lưu lại mảng users vào localStorage
  saveUser();
  //gọi hàm renderUsers để hiển thị lại danh sách người dùng
  renderUsers();
}
renderUsers();
