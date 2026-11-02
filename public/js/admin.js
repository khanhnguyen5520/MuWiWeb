// Admin Panel Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // Initialize Quill Rich Text Editor if editor container exists
  const editorElem = document.getElementById('editor');
  const hiddenContent = document.getElementById('contentHtml');
  if (editorElem && hiddenContent && typeof Quill !== 'undefined') {
    const quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image'],
          ['clean']
        ]
      }
    });

    // Populate initial content
    if (hiddenContent.value) {
      quill.root.innerHTML = hiddenContent.value;
    }

    // Sync before form submit
    const parentForm = hiddenContent.closest('form');
    if (parentForm) {
      parentForm.addEventListener('submit', () => {
        hiddenContent.value = quill.root.innerHTML;
      });
    }
  }

  // Confirm delete buttons
  document.querySelectorAll('.btn-delete-confirm').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const message = this.getAttribute('data-confirm') || 'Bạn có chắc chắn muốn xóa mục này? Thao tác không thể hoàn tác!';
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });

  // Dynamic add item for stats, whyUs, perks
  const addStatBtn = document.getElementById('btnAddStat');
  if (addStatBtn) {
    addStatBtn.addEventListener('click', () => {
      const container = document.getElementById('statsContainer');
      const item = document.createElement('div');
      item.className = 'repeatable-item';
      item.innerHTML = `
        <button type="button" class="btn btn-sm btn-outline-danger btn-remove-item" onclick="this.closest('.repeatable-item').remove()">
          <i class="fa-solid fa-trash"></i>
        </button>
        <div class="row g-2">
          <div class="col-md-4">
            <label class="form-label">Chỉ số số liệu</label>
            <input type="text" name="statNumber" class="form-control" placeholder="VD: 500+">
          </div>
          <div class="col-md-8">
            <label class="form-label">Tên nhãn mô tả</label>
            <input type="text" name="statLabel" class="form-control" placeholder="VD: Khách hàng hài lòng">
          </div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // Image Preview on file select
  document.querySelectorAll('input[type="file"][data-preview]').forEach(input => {
    input.addEventListener('change', function () {
      const previewId = this.getAttribute('data-preview');
      const previewImg = document.getElementById(previewId);
      if (previewImg && this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  });
});

