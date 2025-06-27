let posts = [];
let selectedPost = 0;

const postsList = document.getElementById('posts-list');
const detailTitle = document.getElementById('detail-title');
const detailMeta = document.getElementById('detail-meta');
const detailImage = document.getElementById('detail-image');
const detailContent = document.getElementById('detail-content');
const postCount = document.getElementById('post-count');

const addPostForm = document.getElementById('add-post-form');
const cancelBtn = document.getElementById('cancel-btn');

// Fetch posts from JSON Server
function fetchPosts() {
  fetch("http://localhost:3000/posts")
    .then(res => res.json())
    .then(data => {
      posts = data.reverse(); // newest first
      renderPostList();
      renderPostDetail(selectedPost);
    })
    .catch(err => console.error("Failed to fetch posts:", err));
}

function renderPostList() {
  postsList.innerHTML = "";
  postCount.textContent = `${posts.length} posts`;

  posts.forEach((post, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;
    li.innerHTML = `<div>${post.title}</div><div class="meta">${post.author} &bull; ${post.date}</div>`;
    if (index === selectedPost) li.classList.add("selected");
    postsList.appendChild(li);
  });
}

function renderPostDetail(index) {
  const post = posts[index];
  if (!post) return;
  detailTitle.textContent = post.title;
  detailMeta.textContent = `By ${post.author} • ${post.date}`;
  detailImage.src = post.image;
  detailContent.textContent = post.content;
}

postsList.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-index]');
  if (!li) return;
  const idx = Number(li.dataset.index);
  if (selectedPost !== idx) {
    postsList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
    li.classList.add('selected');
    selectedPost = idx;
    renderPostDetail(idx);
  }
});

addPostForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const title = addPostForm.title.value.trim();
  const author = addPostForm.author.value.trim();
  const image = addPostForm.image.value.trim() || "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80";
  const content = addPostForm.content.value.trim();
  const date = new Date().toISOString().split("T")[0];

  if (!title || !author || !content) return;

  const newPost = { title, author, date, image, content };

  fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  })
    .then(res => res.json())
    .then(post => {
      posts.unshift(post); // add to top
      selectedPost = 0;
      renderPostList();
      renderPostDetail(0);
      addPostForm.reset();
    })
    .catch(err => console.error("Failed to add post:", err));
});

cancelBtn.addEventListener('click', () => {
  addPostForm.reset();
});

fetchPosts();
